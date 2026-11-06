import {
  Activity,
  Droplets,
  Thermometer,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { MetricKey } from '../F40-Implement-Sensor-Data-Packaging/sensorDataTypes';

// Dashboard metric catalog only. This does not read or prototype physical sensors.
export const METRICS: { key: MetricKey; label: string; icon: LucideIcon }[] = [
  { key: 'soilMoisture', label: 'Độ ẩm đất', icon: Droplets },
  { key: 'airTemperature', label: 'Nhiệt độ', icon: Thermometer },
  { key: 'airHumidity', label: 'Độ ẩm không khí', icon: Wind },
  { key: 'lightIntensity', label: 'Ánh sáng', icon: Zap },
  { key: 'ph', label: 'Độ pH', icon: Activity },
  { key: 'waterLevel', label: 'Mực nước', icon: Droplets },
];

