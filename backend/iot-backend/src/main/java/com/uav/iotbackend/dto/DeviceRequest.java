package com.uav.iotbackend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record DeviceRequest(
        @NotBlank(message = "deviceCode không được để trống")
        @Size(min = 3, max = 50, message = "deviceCode phải từ 3 đến 50 ký tự")
        @Pattern(regexp = "^[A-Za-z0-9_-]+$", message = "deviceCode chỉ chứa chữ, số, '-' hoặc '_'")
        String deviceCode,

        @NotBlank(message = "name không được để trống")
        @Size(max = 100, message = "name tối đa 100 ký tự")
        String name,

        @NotBlank(message = "type không được để trống")
        @Pattern(regexp = "SENSOR|UAV|GATEWAY", message = "type phải là SENSOR, UAV hoặc GATEWAY")
        String type,

        // F33.4: Giới hạn độ dài phân khu
        @Size(max = 50, message = "zone tối đa 50 ký tự")
        String zone,

        // F33.2: Giới hạn vĩ độ (-90 đến 90) và kinh độ (-180 đến 180)
        @DecimalMin(value = "-90.0", message = "Vĩ độ (latitude) tối thiểu là -90.0")
        @DecimalMax(value = "90.0", message = "Vĩ độ (latitude) tối đa là 90.0")
        Double latitude,

        @DecimalMin(value = "-180.0", message = "Kinh độ (longitude) tối thiểu là -180.0")
        @DecimalMax(value = "180.0", message = "Kinh độ (longitude) tối đa là 180.0")
        Double longitude,

        @Pattern(regexp = "ACTIVE|INACTIVE|MAINTENANCE", message = "status phải là ACTIVE, INACTIVE hoặc MAINTENANCE")
        String status
) {}