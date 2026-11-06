package com.uav.iotbackend.dto;

import com.uav.iotbackend.entity.Device;
import java.time.Instant;

public record DeviceResponse(
        Long id,
        String deviceCode,
        String name,
        String type,
        String zone,
        Double latitude,
        Double longitude,
        String status,
        Instant createdAt
) {
    public static DeviceResponse from(Device device) {
        return new DeviceResponse(
                device.getId(),
                device.getDeviceCode(),
                device.getName(),
                device.getType(),
                device.getZone(),
                device.getLatitude(),
                device.getLongitude(),
                device.getStatus(),
                device.getCreatedAt()
        );
    }
}