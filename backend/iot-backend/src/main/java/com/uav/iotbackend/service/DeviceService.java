package com.uav.iotbackend.service;

import com.uav.iotbackend.dto.DeviceRequest;
import com.uav.iotbackend.dto.DeviceResponse;
import com.uav.iotbackend.entity.Device;
import com.uav.iotbackend.exception.ConflictException;
import com.uav.iotbackend.repository.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;

    @Transactional
    public DeviceResponse registerDevice(DeviceRequest req) {
        if (deviceRepository.existsByDeviceCode(req.deviceCode())) {
            throw new ConflictException(
                "Mã thiết bị '" + req.deviceCode() + "' đã tồn tại trong hệ thống!"
            );
        }
        Device device = new Device();
        device.setDeviceCode(req.deviceCode().trim());
        device.setName(req.name().trim());
        device.setType(req.type().trim());
        device.setZone(req.zone() != null ? req.zone().trim() : null);
        device.setLatitude(req.latitude());
        device.setLongitude(req.longitude());
        // Nếu không truyền status → tự đặt mặc định là ACTIVE
        device.setStatus(req.status() != null ? req.status().trim() : "ACTIVE");
        
        Device saved = deviceRepository.save(device);
        return DeviceResponse.from(saved);
    }
}