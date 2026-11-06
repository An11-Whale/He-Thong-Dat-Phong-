import { Radio } from 'lucide-react';
import type { SensorNode } from '../F40-Implement-Sensor-Data-Packaging/sensorDataTypes';


interface SensorIdentityProps {
  sensor: SensorNode;
  variant: 'row' | 'detail';
  showStatus?: boolean;
}

// Displays the sensor ID supplied by the API/mock data.
// Node provisioning and hardware identification are outside the dashboard.
export function SensorIdentity({
  sensor,
  variant,
  showStatus = false,
}: SensorIdentityProps) {
  if (variant === 'row') {
    return (
      <div className="sensor-cell">
        <span className="sensor-icon"><Radio size={16} /></span>
        <span><b>{sensor.name}</b><small>{sensor.id}</small></span>
      </div>
    );
  }

  return (
    <div className="selected-sensor">
      <span className="sensor-icon large"><Radio size={19} /></span>
      <div><b>{sensor.name}</b><small>{sensor.id} · {sensor.zoneName}</small></div>
      {showStatus && <span>{sensor.status}</span>}
    </div>
  );
}

