import type { SensorNode } from '../types/sensor';
import { MOCK_SENSORS } from '../mocks/mockSensors';

// Địa chỉ API Backend của Người 2 (sau này đổi theo IP thực tế của backend)
const API_BASE_URL = 'http://localhost:8080/api/v1';

export const sensorService = {
  // 1. Hàm lấy danh sách cảm biến và thông số mới nhất
  async getLatestSensors(): Promise<SensorNode[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/sensors/latest`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000) // Timeout sau 3 giây theo đúng NFR
      });

      if (!response.ok) {
        throw new Error(`Lỗi máy chủ: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn("Chưa kết nối được Backend thật, đang dùng dữ liệu dự phòng:", error);
      // Chế độ dự phòng: Nếu backend chưa chạy, tự động trả về mock data để giao diện không bị chết
      return MOCK_SENSORS;
    }
  }
};