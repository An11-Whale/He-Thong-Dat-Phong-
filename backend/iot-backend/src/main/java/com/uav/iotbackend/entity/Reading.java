package com.uav.iotbackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "readings")
@Getter @Setter
public class Reading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "measurement_id", nullable = false, unique = true, length = 100)
    private String measurementId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(name = "metric_type", nullable = false, length = 20)
    private String metricType;

    @Column(name = "value", nullable = false)
    private Double value;

    @Column(length = 10)
    private String unit;

    @Column(name = "measured_at", nullable = false)
    private Instant measuredAt;

    @Column(name = "received_at")
    private Instant receivedAt;
}