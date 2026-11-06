package com.uav.iotbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;

public record ReadingRequest(

        @NotBlank(message = "measurementId không được để trống")
        @Size(max = 100, message = "measurementId tối đa 100 ký tự")
        String measurementId,

        @NotBlank(message = "deviceCode không được để trống")
        String deviceCode,

        @NotBlank(message = "metricType không được để trống")
        @Pattern(regexp = "TEMPERATURE|HUMIDITY|LIGHT|PH|SOIL_MOISTURE|WATER_LEVEL",
                 message = "metricType phải là TEMPERATURE, HUMIDITY, LIGHT, PH, SOIL_MOISTURE hoặc WATER_LEVEL")
        String metricType,

        @NotNull(message = "value là bắt buộc")
        Double value,

        @Size(max = 10, message = "unit tối đa 10 ký tự")
        String unit,

        @NotNull(message = "measuredAt là bắt buộc")
        OffsetDateTime measuredAt
) {}