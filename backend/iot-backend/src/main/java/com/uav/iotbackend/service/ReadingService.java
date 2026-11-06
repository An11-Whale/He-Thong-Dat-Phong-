package com.uav.iotbackend.service;

import com.uav.iotbackend.dto.ReadingRequest;
import com.uav.iotbackend.entity.Device;
import com.uav.iotbackend.entity.Reading;
import com.uav.iotbackend.exception.ConflictException;
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

@Service
@RequiredArgsConstructor
public class ReadingService {

    private final DeviceRepository deviceRepository;
    private final ReadingRepository readingRepository;
    private final ReadingValidator validator;

    /** Kết quả lưu: bản ghi và cờ cho biết có phải bản trùng không */
    public record SaveResult(Reading reading, boolean duplicated) {}

    public SaveResult save(ReadingRequest req) {
        // Bước 1: chống trùng theo measurementId
        var existing = readingRepository.findByMeasurementId(req.measurementId());
        if (existing.isPresent()) {
            return handleExisting(existing.get(), req);
        }

        // Bước 2: thiết bị phải tồn tại, là cảm biến, đang hoạt động
        Device device = deviceRepository.findByDeviceCode(req.deviceCode())
                .orElseThrow(() -> new NotFoundException(
                        "Không tìm thấy thiết bị '" + req.deviceCode() + "'"));
        validator.validateDevice(device);

        // Bước 3: giá trị và đơn vị
        validator.validateValue(req.metricType(), req.value(), req.unit());

        // Bước 4: thời điểm đo
        Instant measuredAt = req.measuredAt().toInstant();
        validator.validateTime(measuredAt, Instant.now());

        // Bước 5: lưu bản ghi mới
        Reading r = new Reading();
        r.setMeasurementId(req.measurementId());
        r.setDevice(device);
        r.setMetricType(req.metricType());
        r.setValue(req.value());
        r.setUnit(validator.resolveUnit(req.metricType(), req.unit()));
        r.setMeasuredAt(measuredAt);
        r.setReceivedAt(Instant.now());

        try {
            return new SaveResult(readingRepository.save(r), false);
        } catch (DataIntegrityViolationException e) {
            // Hai request cùng measurementId đến đúng cùng lúc: UNIQUE của MySQL chặn bản thứ hai
            var saved = readingRepository.findByMeasurementId(req.measurementId())
                    .orElseThrow(() -> e);
            return handleExisting(saved, req);
        }
    }

    /** measurementId đã có: giống hệt thì là gửi lại (duplicate), khác nội dung thì là xung đột */
    private SaveResult handleExisting(Reading existing, ReadingRequest req) {
        if (!isSamePayload(existing, req)) {
            throw new ConflictException("measurementId '" + req.measurementId()
                    + "' đã tồn tại với nội dung khác (id=" + existing.getId() + ")");
        }
        return new SaveResult(existing, true);
    }

    private boolean isSamePayload(Reading r, ReadingRequest req) {
        return r.getDevice().getDeviceCode().equals(req.deviceCode())
                && r.getMetricType().equals(req.metricType())
                && Double.compare(r.getValue(), req.value()) == 0
                && r.getMeasuredAt().truncatedTo(ChronoUnit.SECONDS)
                    .equals(req.measuredAt().toInstant().truncatedTo(ChronoUnit.SECONDS));
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