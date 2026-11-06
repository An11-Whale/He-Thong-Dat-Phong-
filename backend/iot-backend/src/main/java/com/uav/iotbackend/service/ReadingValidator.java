package com.uav.iotbackend.service;

import com.uav.iotbackend.entity.Device;
import com.uav.iotbackend.exception.BadRequestException;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Component
public class ReadingValidator {

    /** Cho phép đồng hồ cảm biến lệch tối đa 5 phút so với server */
    static final long MAX_FUTURE_MINUTES = 5;
    /** Dữ liệu lưu offline trên UAV tối đa 30 ngày */
    static final long MAX_AGE_DAYS = 30;

    /** Khoảng giá trị hợp lý: {nhỏ nhất, lớn nhất} */
    private static final Map<String, double[]> RANGES = Map.of(
            "TEMPERATURE",   new double[]{-40, 80},
            "HUMIDITY",      new double[]{0, 100},
            "LIGHT",         new double[]{0, 200000},
            "PH",            new double[]{0, 14},
            "SOIL_MOISTURE", new double[]{0, 100},
            "WATER_LEVEL",   new double[]{0, 1000}
    );

    /** Đơn vị chấp nhận cho từng chỉ số (phần tử đầu là đơn vị mặc định) */
    private static final Map<String, List<String>> UNITS = Map.of(
            "TEMPERATURE",   List.of("C", "°C"),
            "HUMIDITY",      List.of("%"),
            "LIGHT",         List.of("lux"),
            "PH",            List.of("pH"),
            "SOIL_MOISTURE", List.of("%"),
            "WATER_LEVEL",   List.of("cm")
    );

    /** Thiết bị phải là cảm biến và đang hoạt động */
    public void validateDevice(Device device) {
        if (!"SENSOR".equalsIgnoreCase(device.getType())) {
            throw new BadRequestException("Thiết bị '" + device.getDeviceCode() + "' có type="
                    + device.getType() + ", chỉ cảm biến (SENSOR) mới gửi được số đo");
        }
        if (device.getStatus() != null && !"ACTIVE".equalsIgnoreCase(device.getStatus())) {
            throw new BadRequestException("Thiết bị '" + device.getDeviceCode()
                    + "' đang ở trạng thái " + device.getStatus() + ", không nhận số đo");
        }
    }

    /** Giá trị phải nằm trong khoảng hợp lý, đơn vị (nếu có) phải đúng loại chỉ số */
    public void validateValue(String metricType, Double value, String unit) {
        double[] range = RANGES.get(metricType);
        if (range == null) {
            throw new BadRequestException("metricType không hợp lệ: " + metricType);
        }
        if (value == null || value.isNaN() || value.isInfinite()
                || value < range[0] || value > range[1]) {
            throw new BadRequestException("Giá trị " + metricType + " = " + value
                    + " nằm ngoài khoảng hợp lệ [" + range[0] + ", " + range[1] + "]");
        }
        if (unit != null && !unit.isBlank()) {
            boolean ok = UNITS.get(metricType).stream()
                    .anyMatch(u -> u.equalsIgnoreCase(unit.trim()));
            if (!ok) {
                throw new BadRequestException("Đơn vị '" + unit + "' không hợp lệ cho "
                        + metricType + ", chấp nhận: " + UNITS.get(metricType));
            }
        }
    }

    /** Thời điểm đo không được ở tương lai và không được quá cũ */
    public void validateTime(Instant measuredAt, Instant now) {
        if (measuredAt.isAfter(now.plus(MAX_FUTURE_MINUTES, ChronoUnit.MINUTES))) {
            throw new BadRequestException("measuredAt không được ở tương lai");
        }
        if (measuredAt.isBefore(now.minus(MAX_AGE_DAYS, ChronoUnit.DAYS))) {
            throw new BadRequestException("measuredAt quá cũ (quá " + MAX_AGE_DAYS + " ngày)");
        }
    }

    /** Nếu gateway không gửi unit thì dùng đơn vị mặc định */
    public String resolveUnit(String metricType, String unit) {
        return (unit != null && !unit.isBlank()) ? unit.trim() : UNITS.get(metricType).get(0);
    }
}
