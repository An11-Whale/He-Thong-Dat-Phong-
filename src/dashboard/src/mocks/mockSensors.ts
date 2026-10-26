import type { SensorNode, MetricHistoryPoint } from '../types/sensor';
export const MOCK_SENSORS: SensorNode[] = [
  {
    id: "SN-A101",
    name: "Cảm biến Đất & Vi Khí Hậu 01",
    farmId: "farm-01",
    zoneId: "zone-01",
    zoneName: "Khu Trồng Dâu Tây A",
    batteryPct: 88,
    lastMeasurementAt: "2026-10-26T07:15:00Z",
    lastSyncAt: "2026-10-26T07:45:00Z",
    status: "NORMAL",
    metrics: {
      soilMoisture: { value: 62.5, unit: "%", status: "NORMAL" },
      airTemperature: { value: 24.2, unit: "°C", status: "NORMAL" },
      airHumidity: { value: 78.0, unit: "%", status: "NORMAL" },
      lightIntensity: { value: 18500, unit: "Lux", status: "NORMAL" },
      ph: { value: 6.4, unit: "pH", status: "NORMAL" },
      waterLevel: { value: 14.5, unit: "cm", status: "NORMAL" }
    }
  },
  {
    id: "SN-A102",
    name: "Cảm biến Đất 02 (Cảnh báo khô hạn)",
    farmId: "farm-01",
    zoneId: "zone-01",
    zoneName: "Khu Trồng Dâu Tây A",
    batteryPct: 18, // Cảnh báo pin yếu (< 20%)
    lastMeasurementAt: "2026-10-26T07:10:00Z",
    lastSyncAt: "2026-10-26T07:45:00Z",
    status: "WARNING",
    metrics: {
      soilMoisture: { value: 21.0, unit: "%", status: "ABNORMAL" }, // Đất quá khô
      airTemperature: { value: 35.2, unit: "°C", status: "ABNORMAL" }, // Nhiệt độ quá cao
      airHumidity: { value: 42.0, unit: "%", status: "NORMAL" },
      lightIntensity: { value: 45000, unit: "Lux", status: "NORMAL" },
      ph: { value: 5.1, unit: "pH", status: "ABNORMAL" },
      waterLevel: { value: 3.5, unit: "cm", status: "ABNORMAL" }
    }
  },
  {
    id: "SN-B201",
    name: "Cảm biến Cà Phê B (Quá hạn timeout)",
    farmId: "farm-01",
    zoneId: "zone-02",
    zoneName: "Khu Cà Phê Sườn Đồi",
    batteryPct: 92,
    lastMeasurementAt: "2026-10-24T10:00:00Z",
    lastSyncAt: "2026-10-24T10:30:00Z",
    status: "OFFLINE", // Dữ liệu cũ hơn 48h
    metrics: {
      soilMoisture: { value: 48.0, unit: "%", status: "NORMAL" },
      airTemperature: { value: 26.5, unit: "°C", status: "NORMAL" },
      airHumidity: { value: 70.0, unit: "%", status: "NORMAL" }
    }
  },
  {
    id: "SN-C301",
    name: "Node Mới Lắp Đặt C1 (Chờ UAV)",
    farmId: "farm-01",
    zoneId: "zone-03",
    zoneName: "Khu Ươm Giống Mới",
    batteryPct: 100,
    lastMeasurementAt: null,
    lastSyncAt: null,
    status: "NO_DATA", // Trạng thái Rỗng bắt buộc cho MVP
    metrics: {}
  },
  {
    id: "SN-W401",
    name: "Cảm biến Hồ Thủy Canh & pH",
    farmId: "farm-01",
    zoneId: "zone-04",
    zoneName: "Khu Hồ Chứa & Thủy Canh",
    batteryPct: 75,
    lastMeasurementAt: "2026-10-26T07:20:00Z",
    lastSyncAt: "2026-10-26T07:45:00Z",
    status: "NORMAL",
    metrics: {
      waterLevel: { value: 18.2, unit: "cm", status: "NORMAL" },
      ph: { value: 6.8, unit: "pH", status: "NORMAL" },
      airTemperature: { value: 25.0, unit: "°C", status: "NORMAL" }
    }
  }
];

// Dữ liệu mẫu chuỗi thời gian để vẽ biểu đồ lịch sử 24h (F06)
export const MOCK_HISTORY_SOIL: MetricHistoryPoint[] = [
  { timestamp: "06:00", value: 58.0 },
  { timestamp: "09:00", value: 54.2 },
  { timestamp: "12:00", value: 48.5 },
  { timestamp: "15:00", value: 44.0 },
  { timestamp: "18:00", value: 60.5 },
  { timestamp: "21:00", value: 63.0 },
  { timestamp: "00:00", value: 64.0 },
  { timestamp: "03:00", value: 63.5 },
  { timestamp: "07:15", value: 62.5 }
];