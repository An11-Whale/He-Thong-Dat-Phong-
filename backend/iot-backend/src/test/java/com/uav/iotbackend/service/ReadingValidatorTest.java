package com.uav.iotbackend.service;

import com.uav.iotbackend.entity.Device;
import com.uav.iotbackend.exception.BadRequestException;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ReadingValidatorTest {

    private final ReadingValidator validator = new ReadingValidator();

    private Device device(String type, String status) {
        Device d = new Device();
        d.setDeviceCode("SENSOR-001");
        d.setType(type);
        d.setStatus(status);
        return d;
    }

    @Test
    void activeSensor_isAccepted() {
        assertDoesNotThrow(() -> validator.validateDevice(device("SENSOR", "ACTIVE")));
    }

    @Test
    void uavDevice_isRejected() {
        assertThrows(BadRequestException.class,
                () -> validator.validateDevice(device("UAV", "ACTIVE")));
    }

    @Test
    void inactiveSensor_isRejected() {
        assertThrows(BadRequestException.class,
                () -> validator.validateDevice(device("SENSOR", "INACTIVE")));
    }

    @Test
    void temperatureInRange_isAccepted() {
        assertDoesNotThrow(() -> validator.validateValue("TEMPERATURE", 31.5, "C"));
    }

    @Test
    void temperatureTooHigh_isRejected() {
        assertThrows(BadRequestException.class,
                () -> validator.validateValue("TEMPERATURE", 500.0, "C"));
    }

    @Test
    void phAbove14_isRejected() {
        assertThrows(BadRequestException.class,
                () -> validator.validateValue("PH", 15.0, "pH"));
    }

    @Test
    void nanValue_isRejected() {
        assertThrows(BadRequestException.class,
                () -> validator.validateValue("HUMIDITY", Double.NaN, "%"));
    }

    @Test
    void wrongUnit_isRejected() {
        assertThrows(BadRequestException.class,
                () -> validator.validateValue("TEMPERATURE", 30.0, "%"));
    }

    @Test
    void missingUnit_isAccepted() {
        assertDoesNotThrow(() -> validator.validateValue("HUMIDITY", 70.0, null));
    }

    @Test
    void futureTime_isRejected() {
        Instant now = Instant.now();
        assertThrows(BadRequestException.class,
                () -> validator.validateTime(now.plus(1, ChronoUnit.HOURS), now));
    }

    @Test
    void tooOldTime_isRejected() {
        Instant now = Instant.now();
        assertThrows(BadRequestException.class,
                () -> validator.validateTime(now.minus(31, ChronoUnit.DAYS), now));
    }

    @Test
    void recentTime_isAccepted() {
        Instant now = Instant.now();
        assertDoesNotThrow(() -> validator.validateTime(now.minus(1, ChronoUnit.HOURS), now));
    }
}