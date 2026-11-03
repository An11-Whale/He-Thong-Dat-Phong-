package com.uav.iotbackend.service;

import com.uav.iotbackend.dto.ReadingRequest;
import com.uav.iotbackend.entity.Device;
import com.uav.iotbackend.entity.Reading;
import com.uav.iotbackend.exception.BadRequestException;
import com.uav.iotbackend.exception.NotFoundException;
import com.uav.iotbackend.repository.DeviceRepository;
import com.uav.iotbackend.repository.ReadingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReadingService {

    private final DeviceRepository deviceRepository;
    private final ReadingRepository readingRepository;

    /** Khoảng giá trị hợp lý cho từng chỉ số: {nhỏ nhất, lớn nhất} */
    private static final Map<String, double[]> RANGES = Map.of(
            "TEMPERATURE",   new double[]{-40, 80},
            "HUMIDITY",      new double[]{0, 100},
            "LIGHT",         new double[]{0, 200000},
            "PH",            new double[]{0, 14},
            "SOIL_MOISTURE", new double[]{0, 100},
            "WATER_LEVEL",   new double[]{0, 1000}
    );

    /** Đơn vị mặc định nếu gateway không gửi unit */
    private static final Map<String, String> DEFAULT_UNITS = Map.of(
            "TEMPERATURE", "C",
            "HUMIDITY", "%",
            "LIGHT", "lux",
            "PH", "pH",
            "SOIL_MOISTURE", "%",
            "WATER_LEVEL", "cm"
    );

    /** Kết quả lưu: bản ghi và cờ cho biết có phải bản trùng không */
    public record SaveResult(Reading reading, boolean duplicated) {}

    public SaveResult save(ReadingRequest req) {
        // Bước 1: chống trùng (gateway có thể gửi lại sau khi mất mạng)
        var existing = readingRepository.findByMeasurementId(req.measurementId());
        if (existing.isPresent()) {
            return new SaveResult(existing.get(), true);
        }

        // Bước 2: thiết bị phải tồn tại
        Device device = deviceRepository.findByDeviceCode(req.deviceCode())
                .orElseThrow(() -> new NotFoundException(
                        "Không tìm thấy thiết bị '" + req.deviceCode() + "'"));

        // Bước 3: giá trị phải nằm trong khoảng hợp lý
        double[] range = RANGES.get(req.metricType());
        if (Double.isNaN(req.value()) || Double.isInfinite(req.value())
                || req.value() < range[0] || req.value() > range[1]) {
            throw new BadRequestException("Giá trị " + req.metricType() + " = " + req.value()
                    + " nằm ngoài khoảng hợp lệ [" + range[0] + ", " + range[1] + "]");
        }

        // Bước 4: thời điểm đo không được ở tương lai (cho phép lệch 5 phút do sai đồng hồ)
        Instant measuredAt = req.measuredAt().toInstant();
        if (measuredAt.isAfter(Instant.now().plus(5, ChronoUnit.MINUTES))) {
            throw new BadRequestException("measuredAt không được ở tương lai");
        }

        // Bước 5: tạo bản ghi mới và lưu
        Reading r = new Reading();
        r.setMeasurementId(req.measurementId());
        r.setDevice(device);
        r.setMetricType(req.metricType());
        r.setValue(req.value());
        r.setUnit(req.unit() != null && !req.unit().isBlank()
                ? req.unit() : DEFAULT_UNITS.get(req.metricType()));
        r.setMeasuredAt(measuredAt);
        r.setReceivedAt(Instant.now());

        try {
            return new SaveResult(readingRepository.save(r), false);
        } catch (DataIntegrityViolationException e) {
            // Hai request cùng measurementId đến đúng cùng lúc: UNIQUE của MySQL chặn bản thứ hai
            return new SaveResult(
                    readingRepository.findByMeasurementId(req.measurementId()).orElseThrow(), true);
        }
    }

    public List<Reading> list(String deviceCode, int limit) {
        int size = Math.min(Math.max(limit, 1), 500);
        if (deviceCode != null && !deviceCode.isBlank()) {
            return readingRepository.findByDeviceDeviceCodeOrderByMeasuredAtDesc(
                    deviceCode, PageRequest.of(0, size));
        }
        return readingRepository.findAll(
                PageRequest.of(0, size, Sort.by("measuredAt").descending())).getContent();
    }
}