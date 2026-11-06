import { MOCK_SENSORS } from '../F39-Implement-Sensor-Data-Reading/mockSensorData';
import { DATA_MODE, getJson } from '../../api/httpClient';
import type { SensorNode } from '../../types';

// Reads the backend's sensor directory for the dashboard.
// This is not network-level sensor discovery or node registration.
export async function listDashboardSensors(): Promise<SensorNode[]> {
  if (DATA_MODE === 'mock') return MOCK_SENSORS;
  return getJson<SensorNode[]>('/sensors/latest');
}
