IoT Platform for UAV-Assisted Farm Monitoring and Sensor Data Collection

1. Purpose

This document defines the quality attributes and operational constraints of the system, encompassing performance, security, reliability, data synchronization capability, scalability, compatibility, and usability.

These non-functional requirements complement the functional requirements by establishing the quality baseline under which the system must operate.

2. Non-Functional Requirements

NFR01 — UI and API Performance

Standard Web interactions must respond within 3 seconds under agreed test loads and environments.

APIs querying sensor data and device status must meet response time thresholds specified in the Master Test Plan.

Response times shall be measured under clearly documented network, data volume, and test load conditions.

Evaluation Criteria: Execute representative transactions repeatedly, record response times, and report results mapped to test environment parameters.

NFR02 — Data Timeliness & Freshness

After the central server successfully receives and stores new data, the monitoring interface must reflect the updated data within 10 seconds under standard operating conditions.

The user interface must explicitly distinguish between the sensor measurement timestamp and the server receipt timestamp.

Data exceeding permissible update intervals must be flagged as stale or out-of-date.

Evaluation Criteria: Record and compare the timestamp of server database insertion against the timestamp when the new data renders on the UI within the test environment.

NFR03 — Security and Access Control

The system must enforce authentication for all protected endpoints and features.

Access permissions must be validated at the Backend layer according to user roles and data scopes.

Passwords must never be stored in plain text.

Sensitive credentials such as API keys and database connection strings must not be hardcoded in public source code repositories.

Network communication between system components must use protocols suited to the deployment environment; HTTPS is mandatory for public network deployments.

Authentication failures and unauthorized access attempts must be handled gracefully without disclosing sensitive internal system details.

Evaluation Criteria: Conduct security testing covering unauthorized access, privilege escalation/incorrect roles, credential configuration audits, and authentication error handling.

NFR04 — Reliability and Data Integrity

Data confirmed as successfully stored must be preserved in compliance with system storage and backup policies.

The synchronization process must minimize data loss and prevent duplicate database records when identical data packets are retransmitted.

Erroneous records must be processed according to predefined validation rules and never silently ingested as valid data.

Synchronization failures must capture sufficient log detail to enable diagnosis and retry attempts where appropriate.

Evaluation Criteria: Simulate network disconnections, data retransmissions, and corrupted payload submissions; verify record counts and content accuracy post-synchronization.

NFR05 — Offline Operation Capability

The Gateway must persist collected data locally during internet outages, subject to physical storage capacity limits.

The Gateway must implement an automatic retry mechanism to resynchronize data once connectivity is restored.

Unsynchronized local data must be clearly distinguished from synchronized records.

Storage management policies (e.g., memory threshold handling) must be defined prior to production deployment.

Evaluation Criteria: Disconnect network connectivity, continue data collection, restore connectivity, and verify complete data synchronization within test environment limits.

NFR06 — Availability and Recovery

The system targets an operational uptime of 99% under normal operating conditions, provided the target deployment environment permits such measurement and SLAs.

The database layer must implement appropriate backup and disaster recovery strategies.

Data recovery procedures must be tested and verified prior to system handover.

Service errors and system faults must be logged to support root-cause diagnosis.

Evaluation Criteria: Record system uptime, service disruption durations, and document the outcomes of simulated data recovery exercises.

NFR07 — Scalability and Maintainability

The architecture must support the addition of farms, sub-zones, sensors, Gateways, and collection tasks without requiring a full system redesign.

Core software modules—such as user management, sensor registry, measurement telemetry, task management, and alerts—must maintain clean separation of concerns.

APIs and data structures must be fully documented.

The codebase must adhere to consistent structural standards, facilitating testability and long-term maintenance.

Evaluation Criteria: Successfully register a new sensor and assign it to a sub-zone using established system workflows without modifying the core system architecture.

NFR08 — Compatibility

The Web user interface must operate correctly across agreed test browser versions of Google Chrome, Microsoft Edge, and Mozilla Firefox.

Backend components, database instances, and Gateways must communicate using agreed protocols and structured data formats.

Runtime environments and critical software dependencies must be documented in the deployment guide.

Evaluation Criteria: Perform core system workflows across designated web browsers and target execution environments within the test scope.

NFR09 — Usability

The UI must clearly convey sensor statuses, task progress, and alert severity levels.

Historical data must offer intuitive filtering mechanisms and accessible visual representations.

Error notifications should inform users of the underlying issue and suggest corrective actions where applicable.

Maps, charts, and data tables must feature clear labels, measurement units, and legends.

Evaluation Criteria: Test users independently execute key operational workflows (e.g., viewing sensor data, querying alerts, inspecting task outcomes) based on provided user documentation.

3. Acceptance Principles

Every non-functional requirement must correspond to a measurable metric or formal test case.

Quantitative performance metrics must be evaluated under explicitly documented test conditions.

Requirements contingent upon physical hardware, network infrastructure, or external APIs shall be evaluated based on the actual testbed environment available to the team.

Test results must be formally recorded to serve as the baseline for system acceptance verification.