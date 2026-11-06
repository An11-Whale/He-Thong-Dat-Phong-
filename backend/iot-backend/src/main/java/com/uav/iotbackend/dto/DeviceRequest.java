package com.uav.iotbackend.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
public record DeviceRequest(
        @NotBlank(message = "deviceCode không được để trống")
        @Size(max = 50, message = "deviceCode tối đa 50 ký tự")
        String deviceCode,

        @NotBlank(message = "name không được để trống")
        @Size(max = 100, message = "name tối đa 100 ký tự")
        String name,

        @NotBlank(message = "type không được để trống")
        @Pattern(regexp = "SENSOR|UAV|GATEWAY",
                 message = "type phải là SENSOR, UAV hoặc GATEWAY")
        String type,

        String zone,       // Không bắt buộc
        Double latitude,   // Không bắt buộc
        Double longitude,  // Không bắt buộc

        @Pattern(regexp = "ACTIVE|INACTIVE|MAINTENANCE",
                 message = "status phải là ACTIVE, INACTIVE hoặc MAINTENANCE")
        String status      // Không bắt buộc - mặc định ACTIVE
) {}