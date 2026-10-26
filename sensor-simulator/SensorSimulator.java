import java.io.FileInputStream;
import java.io.InputStream;
import java.time.Instant;
import java.util.Properties;
import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * ============================================================================
 * PROJECT: UAV-Assisted IoT Platform for Farm Monitoring
 * MODULE: Sensor Simulator Engine (Person 4 Core Task)
 * AUTHOR: Huỳnh Thanh Sa
 * ============================================================================
 */
public class SensorSimulator {

    private static final Properties config = new Properties();
    private static final AtomicInteger globalSequenceId = new AtomicInteger(1);

    public static void main(String[] args) {
        loadConfiguration();

        String[] devices = config.getProperty("SIMULATION_ACTIVE_DEVICES", "SENSOR_01,SENSOR_02").split(",");
        int duration = Integer.parseInt(config.getProperty("SIMULATION_DURATION_SECONDS", "60"));
        double anomalyRate = Double.parseDouble(config.getProperty("SIMULATION_ANOMALY_RATE", "0.08"));
        String topic = config.getProperty("BROKER_TARGET_TOPIC", "farm/sensors/data");

        System.out.println("======================================================================");
        System.out.println("   IOT SENSOR SIMULATION ENGINE - UAV FARM MONITORING PLATFORM       ");
        System.out.println("======================================================================");
        System.out.printf("[CONFIG] Target Topic: %s | Active Nodes: %d | Duration: %ds\n", topic, devices.length, duration);
        System.out.printf("[CONFIG] Anomaly Injection Rate: %.1f%%\n", anomalyRate * 100);
        System.out.println("----------------------------------------------------------------------");

        ExecutorService threadPool = Executors.newFixedThreadPool(devices.length);

        for (String deviceId : devices) {
            threadPool.submit(new SensorNodeWorker(deviceId.trim(), anomalyRate, topic));
        }

        threadPool.shutdown();
        try {
            if (!threadPool.awaitTermination(duration, TimeUnit.SECONDS)) {
                System.out.println("\n[ENGINE WARN] Execution timeout reached. Terminating worker threads...");
                threadPool.shutdownNow();
            }
        } catch (InterruptedException e) {
            System.err.println("[ENGINE ERROR] Engine execution interrupted: " + e.getMessage());
            threadPool.shutdownNow();
            Thread.currentThread().interrupt();
        }

        System.out.println("======================================================================");
        System.out.println("[ENGINE INFO] All sensor nodes deactivated. Simulation finished.");
        System.out.println("======================================================================");
    }

    private static void loadConfiguration() {
        try (InputStream input = new FileInputStream(".env")) {
            config.load(input);
            System.out.println("[SYS INFO] Custom '.env' loaded successfully.");
        } catch (Exception e) {
            System.out.println("[SYS WARN] Could not load '.env'. Falling back to default values.");
        }
    }

    static class SensorNodeWorker implements Runnable {
        private final String deviceId;
        private final double anomalyRate;
        private final String topic;
        private final Random random = new Random();
        private final String[] SENSOR_TYPES = {"TEMPERATURE", "HUMIDITY", "SOIL_MOISTURE", "LIGHT_INTENSITY"};

        public SensorNodeWorker(String deviceId, double anomalyRate, String topic) {
            this.deviceId = deviceId;
            this.anomalyRate = anomalyRate;
            this.topic = topic;
        }

        @Override
        public void run() {
            System.out.printf("[NODE READY] Worker started for Node: %s\n", deviceId);

            while (!Thread.currentThread().isInterrupted()) {
                try {
                    int seq = globalSequenceId.getAndIncrement();
                    String type = SENSOR_TYPES[random.nextInt(SENSOR_TYPES.length)];
                    boolean isAnomaly = random.nextDouble() < anomalyRate;
                    double value = generateValue(type, isAnomaly);
                    String timestamp = Instant.now().toString();

                    SensorPayload payload = new SensorPayload(seq, deviceId, type, value, isAnomaly ? "WARNING_ANOMALY" : "NORMAL", timestamp);

                    System.out.printf("[PUB -> %s] %s\n", topic, payload.toJson());

                    int delay = 1500 + random.nextInt(1500);
                    Thread.sleep(delay);

                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
            System.out.printf("[NODE OFFLINE] Node %s disconnected.\n", deviceId);
        }

        private double generateValue(String type, boolean isAnomaly) {
            double val;
            switch (type) {
                case "TEMPERATURE":
                    val = 22.0 + (36.0 - 22.0) * random.nextDouble();
                    if (isAnomaly) val += 18.5;
                    break;
                case "HUMIDITY":
                    val = 45.0 + (90.0 - 45.0) * random.nextDouble();
                    if (isAnomaly) val -= 35.0;
                    break;
                case "SOIL_MOISTURE":
                    val = 20.0 + (80.0 - 20.0) * random.nextDouble();
                    if (isAnomaly) val = 4.2;
                    break;
                case "LIGHT_INTENSITY":
                    val = 2000.0 + (50000.0 - 2000.0) * random.nextDouble();
                    if (isAnomaly) val = 85000.0;
                    break;
                default:
                    val = 0.0;
            }
            return Math.round(val * 100.0) / 100.0;
        }
    }

    static class SensorPayload {
        private final int seq;
        private final String deviceId;
        private final String sensorType;
        private final double value;
        private final String status;
        private final String timestamp;

        public SensorPayload(int seq, String deviceId, String sensorType, double value, String status, String timestamp) {
            this.seq = seq;
            this.deviceId = deviceId;
            this.sensorType = sensorType;
            this.value = value;
            this.status = status;
            this.timestamp = timestamp;
        }

        public String toJson() {
            return String.format(
                "{\"seq\": %d, \"device_id\": \"%s\", \"sensor_type\": \"%s\", \"value\": %.2f, \"status\": \"%s\", \"timestamp\": \"%s\"}",
                seq, deviceId, sensorType, value, status, timestamp
            );
        }
    }
}