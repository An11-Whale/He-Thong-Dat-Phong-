

UAV-Assisted IoT Platform for Farm Monitoring and Sensor Data Collection

Project Type: Internet of Things (IoT), UAV-Assisted Data Collection, Web-Based Monitoring System

1. Project Objectives

The objective of this project is to develop an IoT platform that uses Unmanned Aerial Vehicles (UAVs) equipped with Mobile Gateways to collect environmental data from distributed sensor nodes across different farm zones.

The system provides a centralized platform for receiving, validating, storing, synchronizing, and visualizing sensor data. It is designed to operate even when Internet connectivity is unstable through offline data storage and automatic synchronization.

Final Goal:

Enable farm managers to monitor farm conditions, detect abnormal environmental values, and make data-driven decisions without manually visiting and checking individual sensor devices.

2. Problems to Be Solved

Problem

Cause

Proposed Solution

Time-consuming data collection

Sensor nodes are distributed across large farm areas

UAV-mounted Mobile Gateways collect data from distributed Sensor Nodes

High infrastructure costs

Installing fixed gateways in every farm zone can be expensive

Use UAV Mobile Gateways to access multiple sensor locations

Unstable Internet connectivity

Remote farm areas may experience network interruptions

Store data locally and synchronize it when connectivity is restored

Distributed sensor data

Measurements come from multiple sensors and farm zones

Centralize sensor data through the Backend and Database

Difficult data monitoring

Lack o centralized monitoring and historical records

Provide dashboards, historical charts, and zone comparisons

Difficult anomaly detection

Environmental conditions are not continuously monitored

Compare measurements against configured thresholds and generate alerts

3. Main System Components

3.1. Sensor and Monitoring Layer

Purpose: Measure environmental conditions at different locations within the farm.

The system collects the following measurements:

Soil Moisture

Air Temperature

Air Humidity

Light Intensity

Soil pH

Water Level

Operating Process:

Sensor Nodes periodically measure environmental parameters.

Measurements are temporarily stored on the sensor devices.

When a UAV Gateway approaches, the Sensor Node receives a data collection request.

The Sensor Node authenticates the request and sends the stored measurements to the Gateway.

3.2. UAV Mobile Gateway

Purpose: Act as an intermediate communication and data collection unit between Sensor Nodes and the Central Backend.

The Gateway is mounted on a UAV and performs the following responsibilities:

Discover registered Sensor Nodes.

Authenticate devices before collecting data.

Request and receive sensor measurements.

Record collection timestamps and location information.

Store collected data locally when Internet connectivity is unavailable.

Automatically synchronize stored data with the Backend when connectivity is restored.

Scope Limitation: The Gateway handles data collection and communication. Direct UAV flight control is outside the scope of the initial implementation.

3.3. Backend and Mission Management

Purpose: Process system operations, manage centralized data, and coordinate data collection missions.

Backend responsibilities:

Authenticate users and manage access permissions.

Manage farms, zones, and sensor devices.

Receive data from UAV Gateways.

Validate incoming measurements.

Detect duplicate records.

Store sensor measurements in the central database.

Evaluate sensor measurements against configured thresholds.

Generate alerts.

Provide REST APIs for frontend applications.

Mission Management responsibilities:

Manage UAVs and Mobile Gateways.

Create data collection missions.

Select farms and Sensor Nodes for each mission.

Configure mission waypoints.

Track mission status when telemetry is available.

Record successful and failed collection points and their failure reasons.

Mission Management handles mission information and operational status. It does not directly control UAV flight operations.

3.4. Web Dashboard

Purpose: Provide web interfaces for administrators and operators to manage and monitor the system.

Admin functions:

Manage users, farms, and farm zones.

Monitor sensor locations and device status.

View current and historical sensor measurements.

Compare environmental data between farm zones.

Configure alert thresholds.

Manage alerts and view reports.

Operator functions:

Manage Sensor Nodes and UAV Gateways.

Create data collection missions.

Select sensors and configure waypoints.

Monitor mission progress.

Update mission status and operational notes.

Review mission collection results.

4. Main Functional Groups

Functional Group

Description

User Management

User login, logout, account management, and role-based access control

Farm Management

Manage farms, zones, and sensor locations

Sensor Management

Register, update, assign, and monitor Sensor Nodes

Data Collection

Discover, authenticate, and collect sensor measurements

UAV and Gateway Management

Manage UAV devices, Gateways, and their operational status

Mission Management

Create missions, select sensors, configure waypoints, and record collection results

Offline Storage and Synchronization

Store data locally, retry failed transmissions, and synchronize when connectivity is restored

Data Monitoring

Display maps, current measurements, historical charts, and zone comparisons

Alert Management

Detect abnormal values and device conditions based on configured thresholds

Reporting

Generate sensor, device, alert, and UAV mission reports

5. Proposed Technology Stack

The following technologies are proposed based on the system requirements and the responsibilities of each architectural layer.

5.1. Frontend Technologies

Technology

Purpose

Why It Is Used

React.js

Frontend framework

Build reusable and interactive web interfaces

JavaScript

Programming language

Implement frontend application logic

HTML5 / CSS3

User interface structure and styling

Build responsive web pages

Axios

HTTP client

Communicate with Backend REST APIs

Leaflet.js

Interactive mapping

Display farms, zones, and sensor locations

OpenStreetMap

Map data provider

Provide geographical map information

Chart.js

Data visualization

Display current and historical sensor measurements

5.2. Backend Technologies

Technology

Purpose

Why It Is Used

Java

Backend programming language

Implement system business logic

Spring Boot

Backend framework

Build REST APIs and backend services

Spring Security

Authentication and authorization

Protect APIs and enforce role-based access

Spring Data JPA

Database access

Simplify relational data operations

Hibernate

ORM framework

Map Java objects to database tables

Maven

Build and dependency management

Manage libraries and build the application

JWT

Authentication token format

Support authenticated API requests

5.3. Database Technologies

Technology

Purpose

Why It Is Used

PostgreSQL

Central relational database

Store users, farms, sensors, measurements, missions, and alerts

SQLite

Gateway local database

Store collected measurements when Internet connectivity is unavailable

Main database entities:

Users

Farms

Zones

Sensors

Measurements

UAVs

Gateways

Missions

Waypoints

Collection Results

Alerts

5.4. Sensor Node Technologies

Technology

Purpose

Why It Is Used

ESP32

Microcontroller

Control sensors and communicate with the Gateway

C/C++

Firmware programming

Implement sensor measurement and communication logic

GPIO / ADC / I2C

Hardware interfaces

Connect environmental sensors to ESP32

ESP32 Flash Storage

Temporary data storage

Preserve measurements until the Gateway requests them

Wi-Fi or LoRa

Wireless communication

Exchange collection requests and sensor measurements with the Gateway

The communication technology will be selected based on the required communication range, hardware availability, and farm conditions.

5.5. UAV Mobile Gateway Technologies

Technology

Purpose

Why It Is Used

Raspberry Pi 4

Gateway hardware prototype

Host the mobile data collection software

Raspberry Pi OS

Gateway operating system

Provide the execution environment

Python

Gateway programming language

Implement sensor discovery, data collection, and synchronization

SQLite

Local data storage

Maintain an offline collection queue

Eclipse Paho MQTT

MQTT client library

Support MQTT-based communication with Sensor Nodes

Python HTTP Client

Backend communication

Send collected data to Backend REST APIs

A laptop-based Gateway simulator may be used during development if physical UAV hardware is unavailable.

5.6. Communication Technologies

Communication Path

Proposed Technology

Purpose

Sensor Node ↔ Gateway

MQTT over Wi-Fi or LoRa-based communication

Discover devices and exchange collection requests and measurement responses

Gateway ↔ Backend

HTTPS REST API with JSON

Upload collected measurements and synchronization status

Frontend ↔ Backend

HTTPS REST API with JSON

Retrieve and manage system information

Backend ↔ Database

Spring Data JPA / Hibernate

Store and retrieve centralized data

Proposed MQTT request-response model:

Gateway publishes a collection request to the Sensor Node.

Sensor Node receives the request and prepares stored measurements.

Sensor Node publishes the measurement response.

Gateway receives the response and stores it locally if necessary.

Example topic structure:

farm/{farmId}/sensor/{sensorId}/request

farm/{farmId}/sensor/{sensorId}/data

The MQTT broker can be hosted on the Gateway using Mosquitto for a local communication prototype.

The communication protocol must define device authentication, message identification, delivery handling, and timeout behavior.

5.7. Deployment and Development Tools

Technology

Purpose

Ubuntu Server 24.04 LTS

Server operating system

Docker

Containerize application services

Docker Compose

Run and manage multiple containers

Nginx

Reverse proxy and web server

Git

Source code version control

GitHub

Source code hosting and team collaboration

GitHub Actions

Automated build and test workflows

Postman

API development and testing

IntelliJ IDEA

Java and Spring Boot development

Visual Studio Code

Frontend, Gateway, and documentation development

5.8. Testing Technologies

Technology

Purpose

JUnit 5

Backend unit testing

Mockito

Mock dependencies during backend testing

Postman

REST API testing

Pytest

Gateway software testing

Browser Developer Tools

Frontend debugging and testing

6. System Operating Process

The system operates through six main stages.

Stage 1 – Sensor Measurement

Sensor Nodes periodically measure environmental parameters and temporarily store measurements on the devices until a Gateway approaches.

Stage 2 – UAV-Based Data Collection

The UAV carries the Mobile Gateway to sensor locations. The Gateway discovers registered devices, authenticates them, and requests stored measurements.

Stage 3 – Gateway Data Storage

The Gateway receives sensor measurements and records collection timestamps and location information. If Internet connectivity is unavailable, the data is stored in SQLite.

Stage 4 – Data Synchronization and Processing

When Internet connectivity is restored, the Gateway automatically uploads stored measurements to the Backend.

The Backend validates incoming data, detects duplicate records, and stores valid measurements in PostgreSQL.

Stage 5 – Data Monitoring

The Web Dashboard retrieves information from the Backend to display device status, current measurements, historical data, and mission results.

Stage 6 – Anomaly Detection and Notifications

The Backend compares sensor measurements against configured thresholds. When abnormal conditions are detected, the system generates alerts and sends notifications through Web or Email.

7. Project Scope

7.1. In Scope

Develop Backend REST APIs and a central database.

Develop Admin and Operator web interfaces.

Develop or simulate environmental Sensor Nodes.

Develop a UAV Mobile Gateway prototype.

Discover, authenticate, and collect sensor measurements.

Store collected data locally when Internet connectivity is unavailable.

Automatically synchronize data when connectivity is restored.

Manage UAV collection missions and mission results.

Monitor current and historical sensor data.

Generate threshold-based alerts.

Generate sensor, device, alert, and mission reports.

7.2. Out of Scope

Direct UAV flight control.

AI-based autonomous flight path planning.

AI-based crop image analysis.

AI-based crop yield prediction.

Automated agricultural decision-making using AI.

8. Project Directory Structure

UAV-Assisted IoT Platform for Farm Monitoring and Sensor Data Collection/
│
├── deployment/
│   └── # Deployment configurations
│
├── docs/
│   ├── api/
│   │   └── # REST API specifications
│   ├── component_diagram/
│   │   └── # Component Diagram
│   ├── requirements/
│   │   └── # Functional and Non-Functional Requirements
│   └── uml/
│       └── # Use Case, Class, Sequence, Activity, Deployment
│
├── src/
│   ├── backend/
│   │   └── # Spring Boot Backend APIs and business logic
│   ├── dashboard/
│   │   └── # React Admin and Operator interfaces
│   ├── gateway/
│   │   └── # UAV Mobile Gateway software
│   ├── mission-management/
│   │   └── # Mission management module, if maintained separately
│   └── sensor-simulator/
│       └── # Sensor Node simulation
│
├── test/
│   └── # Test cases and system testing
│
├── .env.example
├── .gitignore
└── README.md

9. Expected Project Deliverables

At the end of the project, the team is expected to deliver:

Sensor Nodes capable of measuring and temporarily storing environmental data.

A UAV Mobile Gateway capable of discovering, authenticating, and collecting sensor measurements.

An offline storage and automatic synchronization mechanism.

A Spring Boot Backend capable of receiving, validating, deduplicating, and storing measurements.

PostgreSQL database for centralized data management.

Admin and Operator web interfaces.

Mission management and collection result tracking.

Dashboard visualization for current and historical sensor data.

Threshold-based anomaly detection and notifications.

Reports covering sensor data, devices, alerts, and UAV missions.

Source code, deployment package, technical documentation, and user manuals.

Final Product:

A working UAV-assisted IoT prototype that collects environmental data from distributed farm sensors, stores and synchronizes measurements reliably, manages collection missions, and provides a centralized platform for farm monitoring and decision support.
