// Các trạng thái của cảm biến theo yêu cầu hệ thống
export type SensorStatus = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'NO_DATA' | 'OFFLINE';

// Cấu trúc 1 chỉ số đo (Giá trị, đơn vị, trạng thái an toàn/bất thường)
export interface MetricValue {
  value: number | null;
  unit: string;
  status: 'NORMAL' | 'ABNORMAL';
}

// Cấu trúc một Node cảm biến trong trang trại
export interface SensorNode {
  id: string;               // Mã cảm biến (VD: SN-A101)
  name: string;             // Tên gọi cảm biến
  farmId: string;           // Mã trang trại
  zoneId: string;           // Mã phân khu (Zone)
  zoneName: string;         // Tên khu vực (VD: Khu Dâu Tây A)
  batteryPct: number;       // Dung lượng pin còn lại (%)
  lastMeasurementAt: string | null; // Thời điểm cảm biến ghi nhận giá trị
  lastSyncAt: string | null;        // Thời điểm UAV bay qua thu thập và đồng bộ lên server
  status: SensorStatus;     // Trạng thái (Bình thường, Vượt ngưỡng, Chưa có dữ liệu...)
  metrics: {
    soilMoisture?: MetricValue;   // Độ ẩm đất (%)
    airTemperature?: MetricValue; // Nhiệt độ không khí (°C)
    airHumidity?: MetricValue;    // Độ ẩm không khí (%)
    lightIntensity?: MetricValue; // Cường độ ánh sáng (Lux)
    ph?: MetricValue;             // Độ pH đất/nước
    waterLevel?: MetricValue;     // Mực nước (cm)
  };
}

// Cấu trúc điểm dữ liệu biểu đồ lịch sử (F06)
export interface MetricHistoryPoint {
  timestamp: string;
  value: number;
}