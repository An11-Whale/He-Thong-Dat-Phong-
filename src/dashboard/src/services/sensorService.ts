import type { SensorNode } from '../types/sensor';
import { MOCK_SENSORS } from '../mocks/mockSensors';

// Cổng mặc định của Spring Boot Backend
const API_BASE_URL = 'http://localhost:8080/api/v1';

export interface BackendReading {
  id: number;
  measurementId: string;
  deviceCode: string;
  metricType: string;
  value: number;
  unit: string;
  measuredAt: string;
  receivedAt: string;
}

export const sensorService = {
  // 1. Gọi API GET /api/v1/readings từ Backend của Hoàng Hiếu
  async getLatestSensors(): Promise<SensorNode[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/readings?limit=50`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000) // Tự ngắt sau 3 giây theo yêu cầu phi chức năng
      });

      if (!response.ok) {
        throw new Error(`Máy chủ trả về mã lỗi: ${response.status}`);
      }

      const readings: BackendReading[] = await response.json();

      // Nếu Backend có dữ liệu, ánh xạ (map) vào cấu trúc danh sách cảm biến của Dashboard
      if (readings && readings.length > 0) {
        return MOCK_SENSORS.map(sensor => {
          const matchedReading = readings.find(r => r.deviceCode === sensor.id);
          if (matchedReading) {
            return {
              ...sensor,
              lastMeasurementAt: matchedReading.measuredAt,
              lastSyncAt: matchedReading.receivedAt,
              metrics: {
                ...sensor.metrics,
                soilMoisture: matchedReading.metricType === 'soil_moisture' 
                  ? { value: matchedReading.value, unit: matchedReading.unit, status: 'NORMAL' }
                  : sensor.metrics.soilMoisture
              }
            };
          }
          return sensor;
        });
      }

      return MOCK_SENSORS;
    } catch (error) {
      console.warn("Chưa kết nối được Backend Spring Boot, sử dụng dữ liệu dự phòng:", error);
      throw error; // Ném lỗi để App.tsx kích hoạt giao diện cảnh báo lỗi và nút Thử lại
    }
  }
};