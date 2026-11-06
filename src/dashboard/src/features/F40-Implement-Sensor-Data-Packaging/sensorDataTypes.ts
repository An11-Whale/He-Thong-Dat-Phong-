export type SensorStatus = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'NO_DATA' | 'OFFLINE';
export type MetricKey = 'soilMoisture' | 'airTemperature' | 'airHumidity' | 'lightIntensity' | 'ph' | 'waterLevel';

export interface SensorMetric {
  value: number | null;
  unit: string;
  status?: 'NORMAL' | 'ABNORMAL';
}

export interface SensorNode {
  id: string;
  name: string;
  farmId: string;
  zoneId: string;
  zoneName: string;
  batteryPct: number | null;
  lastMeasurementAt: string | null;
  lastSyncAt: string | null;
  status: SensorStatus;
  metrics: Partial<Record<MetricKey, SensorMetric>>;
}

export interface HistoryPoint {
  timestamp: string;
  value: number;
}
