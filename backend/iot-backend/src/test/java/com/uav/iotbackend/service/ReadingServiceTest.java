package com.uav.iotbackend.service;

import com.uav.iotbackend.dto.ReadingRequest;
import com.uav.iotbackend.entity.Device;
import com.uav.iotbackend.entity.Reading;
import com.uav.iotbackend.exception.ConflictException;
import com.uav.iotbackend.exception.NotFoundException;
import com.uav.iotbackend.repository.DeviceRepository;
import com.uav.iotbackend.repository.ReadingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReadingServiceTest {

    @Mock DeviceRepository deviceRepository;
    @Mock ReadingRepository readingRepository;

    ReadingService service;
    Device sensor;
    Instant measuredAt;

    @BeforeEach
    void setUp() {
        service = new ReadingService(deviceRepository, readingRepository, new ReadingValidator());
        sensor = new Device();
        sensor.setId(2L);
        sensor.setDeviceCode("SENSOR-001");
        sensor.setType("SENSOR");
        sensor.setStatus("ACTIVE");
        measuredAt = Instant.now().minus(1, ChronoUnit.HOURS).truncatedTo(ChronoUnit.SECONDS);
    }

    private ReadingRequest request(String id, double value) {
        return new ReadingRequest(id, "SENSOR-001", "TEMPERATURE", value, "C",
                measuredAt.atOffset(ZoneOffset.UTC));
    }

    private Reading storedReading(String id, double value) {
        Reading r = new Reading();
        r.setId(10L);
        r.setMeasurementId(id);
        r.setDevice(sensor);
        r.setMetricType("TEMPERATURE");
        r.setValue(value);
        r.setUnit("C");
        r.setMeasuredAt(measuredAt);
        return r;
    }

    @Test
    void newReading_isSaved() {
        when(readingRepository.findByMeasurementId("T1")).thenReturn(Optional.empty());
        when(deviceRepository.findByDeviceCode("SENSOR-001")).thenReturn(Optional.of(sensor));
        when(readingRepository.save(any(Reading.class))).thenAnswer(inv -> inv.getArgument(0));

        var result = service.save(request("T1", 31.5));

        assertFalse(result.duplicated());
        verify(readingRepository).save(any(Reading.class));
    }

    @Test
    void sameIdSamePayload_isDuplicate_andNotSavedAgain() {
        when(readingRepository.findByMeasurementId("T1"))
                .thenReturn(Optional.of(storedReading("T1", 31.5)));

        var result = service.save(request("T1", 31.5));

        assertTrue(result.duplicated());
        verify(readingRepository, never()).save(any(Reading.class));
    }

    @Test
    void sameIdDifferentValue_isConflict() {
        when(readingRepository.findByMeasurementId("T1"))
                .thenReturn(Optional.of(storedReading("T1", 31.5)));

        assertThrows(ConflictException.class, () -> service.save(request("T1", 40.0)));
        verify(readingRepository, never()).save(any(Reading.class));
    }

    @Test
    void unknownDevice_throwsNotFound() {
        when(readingRepository.findByMeasurementId("T2")).thenReturn(Optional.empty());
        when(deviceRepository.findByDeviceCode("SENSOR-001")).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.save(request("T2", 31.5)));
    }
}