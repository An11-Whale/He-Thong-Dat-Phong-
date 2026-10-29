CREATE DATABASE IF NOT EXISTS uavdb
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE uavdb;

CREATE TABLE IF NOT EXISTS devices (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_code  VARCHAR(50)  NOT NULL UNIQUE,
    name         VARCHAR(100),
    type         VARCHAR(20)  NOT NULL,
    zone         VARCHAR(50),
    latitude     DOUBLE,
    longitude    DOUBLE,
    status       VARCHAR(20)  DEFAULT 'ACTIVE',
    created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS readings (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    measurement_id  VARCHAR(100) NOT NULL UNIQUE,
    device_id       BIGINT       NOT NULL,
    metric_type     VARCHAR(20)  NOT NULL,
    value           DOUBLE       NOT NULL,
    unit            VARCHAR(10),
    measured_at     TIMESTAMP    NOT NULL,
    received_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id),
    INDEX idx_reading_device_time (device_id, measured_at)
);

CREATE TABLE IF NOT EXISTS missions (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100),
    uav_device_id  BIGINT       NOT NULL,
    status         VARCHAR(20)  DEFAULT 'PLANNED',
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    started_at     TIMESTAMP    NULL,
    finished_at    TIMESTAMP    NULL,
    FOREIGN KEY (uav_device_id) REFERENCES devices(id)
);

CREATE TABLE IF NOT EXISTS mission_sensors (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    mission_id  BIGINT  NOT NULL,
    device_id   BIGINT  NOT NULL,
    collected   BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (mission_id) REFERENCES missions(id),
    FOREIGN KEY (device_id)  REFERENCES devices(id),
    UNIQUE (mission_id, device_id)
);