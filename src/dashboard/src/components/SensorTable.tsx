import { useState } from 'react';
import type { SensorNode } from '../types/sensor';
import { 
  Search, 
  MapPin, 
  BatteryLow, 
  Battery, 
  AlertTriangle, 
  ChevronRight, 
  WifiOff
} from 'lucide-react';

interface SensorTableProps {
  sensors: SensorNode[];
  selectedSensorId: string | null;
  onSelectSensor: (sensor: SensorNode) => void;
}

export function SensorTable({ sensors, selectedSensorId, onSelectSensor }: SensorTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState<'DEFAULT' | 'BATTERY_ASC' | 'NAME'>('DEFAULT');

  const filtered = sensors.filter(s => {
    const matchName = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchZone = selectedZone === 'ALL' || s.zoneId === selectedZone;
    const matchStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
    return matchName && matchZone && matchStatus;
  });

  const sortedSensors = [...filtered].sort((a, b) => {
    if (sortBy === 'BATTERY_ASC') return a.batteryPct - b.batteryPct;
    if (sortBy === 'NAME') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="space-y-3">
      {/* Hộp Tìm Kiếm & Bộ Lọc Gọn Gàng */}
      <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 shadow-xs space-y-2">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã node hoặc tên cảm biến..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
          />
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <select
            value={selectedZone}
            onChange={e => setSelectedZone(e.target.value)}
            className="w-full border border-slate-200 px-2 py-1 rounded-md text-[11px] bg-white text-slate-700 hover:border-slate-300 focus:outline-none"
          >
            <option value="ALL">Tất cả khu vực</option>
            <option value="zone-01">Khu dâu tây A</option>
            <option value="zone-02">Khu cà phê đồi</option>
            <option value="zone-03">Khu ươm giống</option>
            <option value="zone-04">Khu thủy canh</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full border border-slate-200 px-2 py-1 rounded-md text-[11px] bg-white text-slate-700 hover:border-slate-300 focus:outline-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="NORMAL">Bình thường</option>
            <option value="WARNING">Cảnh báo ngưỡng</option>
            <option value="OFFLINE">Quá hạn đồng bộ</option>
            <option value="NO_DATA">Chưa có dữ liệu</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="w-full border border-slate-200 px-2 py-1 rounded-md text-[11px] bg-white text-slate-700 hover:border-slate-300 focus:outline-none"
          >
            <option value="DEFAULT">Sắp xếp: Mặc định</option>
            <option value="BATTERY_ASC">Ưu tiên pin yếu</option>
            <option value="NAME">Tên (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Danh Sách Thiết Bị Cảm Biến */}
      <div className="bg-white rounded-lg border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-semibold text-xs text-slate-800">Danh sách node cảm biến</h3>
            <p className="text-[10px] text-slate-400">Hiển thị {sortedSensors.length} thiết bị</p>
          </div>
          <span className="text-[10px] text-slate-400 bg-white border border-slate-200/80 px-1.5 py-0.5 rounded">
            Nhấp chuột để chọn
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {sortedSensors.map(sensor => {
            const isSelected = selectedSensorId === sensor.id;
            return (
              <div
                key={sensor.id}
                onClick={() => onSelectSensor(sensor)}
                className={`p-3 cursor-pointer transition-colors flex items-center justify-between ${
                  isSelected 
                    ? 'bg-emerald-50/60 border-l-3 border-emerald-600' 
                    : 'hover:bg-slate-50/80 border-l-3 border-transparent'
                }`}
              >
                <div className="min-w-0 flex-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200/60 px-1.5 py-0.2 rounded shrink-0 whitespace-nowrap">
                      {sensor.id}
                    </span>
                    <span className="font-medium text-xs text-slate-900 leading-snug">
                      {sensor.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {sensor.zoneName}
                    </span>
                    <span className="flex items-center gap-1 font-mono shrink-0">
                      {sensor.batteryPct < 20 ? (
                        <BatteryLow className="w-3 h-3 text-rose-500" />
                      ) : (
                        <Battery className="w-3 h-3 text-emerald-600" />
                      )}
                      {sensor.batteryPct}% pin
                    </span>
                  </div>

                  {sensor.status !== 'NO_DATA' ? (
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-600 pt-1 border-t border-slate-100/70">
                      <span>Đất: <b className="text-slate-800">{sensor.metrics.soilMoisture?.value ?? '--'}%</b></span>
                      <span>Nhiệt: <b className="text-slate-800">{sensor.metrics.airTemperature?.value ?? '--'}°C</b></span>
                      <span>pH: <b className="text-slate-800">{sensor.metrics.ph?.value ?? '--'}</b></span>
                    </div>
                  ) : (
                    <div className="mt-1 text-[10px] text-slate-400 italic flex items-center gap-1">
                      <WifiOff className="w-3 h-3" /> Chưa có chuyến bay UAV thu thập dữ liệu
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {sensor.status === 'NORMAL' && (
                    <span className="px-2 py-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full whitespace-nowrap">
                      Bình thường
                    </span>
                  )}
                  {sensor.status === 'WARNING' && (
                    <span className="px-2 py-0.5 text-[10px] font-medium text-amber-800 bg-amber-50 border border-amber-200/60 rounded-full flex items-center gap-1 whitespace-nowrap">
                      <AlertTriangle className="w-2.5 h-2.5 text-amber-600" /> Cảnh báo
                    </span>
                  )}
                  {sensor.status === 'OFFLINE' && (
                    <span className="px-2 py-0.5 text-[10px] font-medium text-rose-700 bg-rose-50 border border-rose-200/60 rounded-full whitespace-nowrap">
                      Quá hạn sync
                    </span>
                  )}
                  {sensor.status === 'NO_DATA' && (
                    <span className="px-2 py-0.5 text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-full whitespace-nowrap">
                      Chưa sync
                    </span>
                  )}

                  <ChevronRight className={`w-3.5 h-3.5 transition shrink-0 ${isSelected ? 'text-emerald-600' : 'text-slate-300'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}