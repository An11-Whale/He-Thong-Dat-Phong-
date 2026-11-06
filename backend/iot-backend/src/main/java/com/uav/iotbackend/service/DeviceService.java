package com.uav.iotbackend.service;

import com.uav.iotbackend.dto.DeviceRequest;
import com.uav.iotbackend.dto.DeviceResponse;
import com.uav.iotbackend.entity.Device;
import com.uav.iotbackend.exception.BadRequestException;
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
        // F33.3: Kiểm tra chống trùng mã
        if (deviceRepository.existsByDeviceCode(req.deviceCode())) {
            throw new ConflictException("Mã thiết bị '" + req.deviceCode() + "' đã tồn tại trong hệ thống!");
        }

        // F33.2: Kiểm tra cặp toạ độ (nếu có lat thì phải có lng và ngược lại)
        boolean hasLat = req.latitude() != null;
        boolean hasLng = req.longitude() != null;
        if (hasLat ^ hasLng) {
            throw new BadRequestException("Phải cung cấp đồng thời cả latitude và longitude, không được thiếu 1 trong 2");
        }

        Device device = new Device();
        device.setDeviceCode(req.deviceCode().trim());
        device.setName(req.name().trim());
        device.setType(req.type().trim());
        
        // F33.4: Chuẩn hoá phân khu (cắt khoảng trắng, nếu chuỗi rỗng thì gán null)
        device.setZone(req.zone() != null && !req.zone().isBlank() ? req.zone().trim() : null);
        
        device.setLatitude(req.latitude());
        device.setLongitude(req.longitude());
        device.setStatus(req.status() != null && !req.status().isBlank() ? req.status().trim() : "ACTIVE");

        Device saved = deviceRepository.save(device);
        return DeviceResponse.from(saved);
    }
}