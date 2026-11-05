package com.uav.iotbackend.repository;

import com.uav.iotbackend.entity.Reading;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReadingRepository extends JpaRepository<Reading, Long> {

    Optional<Reading> findByMeasurementId(String measurementId);

    List<Reading> findByDeviceDeviceCodeOrderByMeasuredAtDesc(String deviceCode, Pageable pageable);
}