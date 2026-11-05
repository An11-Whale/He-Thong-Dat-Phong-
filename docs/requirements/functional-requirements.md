IoT Platform for UAV-Assisted Farm Monitoring and Sensor Data Collection

1. Purpose

This document specifies the functional requirements that the system must provide, as well as the scope of features excluded from the initial version.

It serves as the baseline for the architecture design, database modeling, API specification, user interface (UI) design, task allocation, and system testing.

2. System Objectives

The system is built to collect data from sensors distributed across multiple farm areas, utilizing UAVs equipped with mobile Gateways to gather and store data when internet connectivity is unavailable.

Once network connectivity is restored, the Gateway synchronizes the data to the central server. Farm managers can monitor sensor data, device statuses, collection tasks, and system alerts via a Web interface.

3. Functional Scope

3.1. In-Scope Requirements (MUST-HAVE)

3.1.1. Account & Access Management

F01 — User Authentication: The system shall allow users to log in and log out. Users must be authenticated before accessing protected system functions.

F02 — User Management: Administrators can create, view, update, and disable user accounts, as well as assign role-based permissions accordingly.

3.1.2. Farm & Zone Management

F03 — Farm & Zone Management: Authorized users can create, view, update, and manage information regarding farms and their constituent sub-zones.

3.1.3. Sensor & Device Management & Monitoring

F12 — Sensor Management: Technicians can register, update information for, and assign sensor nodes to their respective sub-zones.

F13 — UAV & Gateway Management: The system shall manage the inventory of UAVs and mobile Gateways, including identification details and device statuses.

F05 — Sensor Position & Status Display: The system shall display sensor locations and statuses on a map or corresponding positional interface whenever valid geolocation data is available.

3.1.4. Data Monitoring & Dashboard

F04 — Overview Dashboard: The system shall present an overview dashboard displaying summary metrics for sensors, devices, alerts, and UAV tasks.

F06 — Sensor Data Monitoring: The system shall display the latest sensor readings received by the server alongside historical measurement trends. Supported metrics include temperature, humidity, soil moisture, pH, light intensity, and water level, depending on the deployed sensors.

F07 — Cross-Zone Data Comparison: Users can select and compare sensor metrics across multiple sub-zones within their granted access permissions.

3.1.5. Alert Configuration & Handling

F09 — Alert Threshold Configuration: Authorized users can configure sensor threshold values, data timeout thresholds (stale data duration), and low battery warnings.

F10 — Alert Generation & Notification: The system shall trigger alerts when configured conditions are met, display alerts on the Web interface, and send email notifications if an email service is configured.

F08 — Alert Management: Authorized users can view alert lists, log processing notes, and resolve/close alerts. An audit trail of the processing history must be retained.

3.1.6. Data Collection Task Management

F14 — Task Creation: Operators can create data collection tasks by selecting the target farm, target sensors, and a list of planned waypoints.

F15 — Task Monitoring: The system shall display task progress and current status. Real-time UAV position, battery level, and waypoint progress will only be displayed when a compatible telemetry source feeds data into the system.

F16 — Manual Status Update: Operators can manually update task statuses and log operational notes.

F17 — Task Result Inspection: The system shall display collection outcomes, including successful collection points, failed points, and failure reasons if data is available.

3.1.7. Reports & Analytics

F11 — Reporting: The system shall generate reports on sensor data, device status, alert history, and task results. Users can filter data by supported criteria and export reports in standardized formats.

3.1.8. Data Collection & Synchronization

F18 — Sensor Discovery & Authentication: The Gateway shall discover registered sensor nodes and execute authentication based on the selected communication protocol.

F19 — Data Validation: The system shall validate mandatory fields, data types, timestamps, and out-of-range values. The system shall detect duplicate records using predefined unique identifiers or deduplication keys.

F20 — Offline Storage & Synchronization: During internet outages, the Gateway stores unsynchronized data in local storage. Once connectivity is restored, the Gateway automatically attempts to sync the data to the central server. Re-sending identical records must not result in duplicate entries on the server.

3.2. Out-of-Scope Requirements

The initial version specifically excludes the following capabilities:

Direct real-time control of UAV flight direction, motors, altitude, or maneuvers via the Web interface.

Automated flight path optimization, autonomous navigation, or UAV obstacle avoidance.

Agricultural image analysis or computer vision processing from UAV camera feeds.

Advanced AI/ML models for weather forecasting, crop health prediction, or automated farming decision-making.

Native mobile applications (iOS/Android); the management interface for Version 1 is strictly a Web application.

Integration with unapproved external sensors, proprietary protocols, or third-party platforms.

3.3. Scope Principles

The system manages tasks and collected data; it does not replace specialized flight controllers.

Creating a task and saving waypoints does not imply transmitting direct flight commands to the UAV.

Data shown reflects what has been received by the central server; real-time updates are not guaranteed while the Gateway is offline.

Hardware-dependent features will only be accepted/validated when the corresponding physical hardware or simulation environment is established.

4. Test Acceptance Criteria Baseline

Each feature from F01 to F20 must be validated using corresponding test scenarios.

Example for F20 (Offline Storage & Synchronization):

Network Disruption: When internet access is disconnected, the Gateway successfully stores all incoming collected data into local storage.

Re-connection & Sync: Upon restoration of internet connectivity, unsynchronized local records are transmitted to the central server automatically.

Deduplication: When the same data record is transmitted multiple times, the server ignores duplicates and creates no duplicate database entries.

Sync Status Verification: Synchronization success or failure states must be clearly verifiable and logged.
