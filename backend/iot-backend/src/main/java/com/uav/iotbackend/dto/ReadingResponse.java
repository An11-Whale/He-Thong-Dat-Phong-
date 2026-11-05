package com.uav.iotbackend.dto;

import com.uav.iotbackend.entity.Reading;

import java.time.Instant;

public record ReadingResponse(
        Long id,
        String measurementId,
        String deviceCode,
        String metricType,
        Double value,
        String unit,
        Instant measuredAt,
        Instant receivedAt
) {
    public static ReadingResponse from(Reading r) {
        return new ReadingResponse(
                r.getId(), r.getMeasurementId(), r.getDevice().getDeviceCode(),
                r.getMetricType(), r.getValue(), r.getUnit(),
                r.getMeasuredAt(), r.getReceivedAt());
    }
}