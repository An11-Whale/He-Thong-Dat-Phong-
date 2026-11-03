package com.uav.iotbackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "devices")
@Getter @Setter
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "device_code", nullable = false, unique = true, length = 50)
    private String deviceCode;

    private String name;

    @Column(nullable = false)
    private String type;

    private String zone;
    private Double latitude;
    private Double longitude;
    private String status;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Instant createdAt;
}