package com.uav.iotbackend.controller;

import com.uav.iotbackend.dto.DeviceRequest;
import com.uav.iotbackend.dto.DeviceResponse;
import com.uav.iotbackend.service.DeviceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/devices")
@RequiredArgsConstructor
@Tag(name = "Device Management", description = "Quản lý và đăng ký nút cảm biến")
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping
    @Operation(summary = "Đăng ký cảm biến mới (F12)")
    public ResponseEntity<DeviceResponse> registerDevice(
            @Valid @RequestBody DeviceRequest request) {

        DeviceResponse response = deviceService.registerDevice(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}