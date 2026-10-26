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

  // Lọc dữ liệu
  const filtered = sensors.filter(s => {
    const matchName = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchZone = selectedZone === 'ALL' || s.zoneId === selectedZone;
    const matchStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
    return matchName && matchZone && matchStatus;
  });

  // Sắp xếp dữ liệu
  const sortedSensors = [...filtered].sort((a, b) => {
    if (sortBy === 'BATTERY_ASC') return a.batteryPct - b.batteryPct;
    if (sortBy === 'NAME') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* THANH TÌM KIẾM & BỘ LỌC ĐƯỢC CHIA 2 HÀNG THOÁNG MẮT */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm space-y-2.5">
        {/* Hàng 1: Ô Tìm Kiếm Rộng Rãi */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã Node (VD: SN-A101) hoặc tên cảm biến..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>

        {/* Hàng 2: 3 Menu Lọc Chia Đều 3 Cột Cân Xứng (Grid 3 Cột) */}
        <div className="grid grid-cols-3 gap-2">
          {/* 1. Lọc Khu Vực */}
          <select
            value={selectedZone}
            onChange={e => setSelectedZone(e.target.value)}
            className="w-full border border-slate-200 px-2 py-1.5 rounded-lg text-xs bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="ALL">Tất cả Khu Vực</option>
            <option value="zone-01">Khu Dâu Tây A</option>
            <option value="zone-02">Khu Cà Phê Đồi</option>
            <option value="zone-03">Khu Ươm Giống</option>
            <option value="zone-04">Khu Thủy Canh</option>
          </select>

          {/* 2. Lọc Trạng Thái */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full border border-slate-200 px-2 py-1.5 rounded-lg text-xs bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="ALL">Tất cả Trạng Thái</option>
            <option value="NORMAL">Bình thường</option>
            <option value="WARNING">Cảnh báo ngưỡng</option>
            <option value="OFFLINE">Quá hạn sync</option>
            <option value="NO_DATA">Chưa có dữ liệu</option>
          </select>

          {/* 3. Sắp Xếp */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="w-full border border-slate-200 px-2 py-1.5 rounded-lg text-xs bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="DEFAULT">Sắp xếp: Mặc định</option>
            <option value="BATTERY_ASC">Ưu tiên Pin yếu</option>
            <option value="NAME">Tên (A ➔ Z)</option>
          </select>
        </div>
      </div>

      {/* DANH SÁCH THIẾT BỊ CẢM BIẾN */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Danh Sách Node Cảm Biến</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Hiển thị {sortedSensors.length} thiết bị</p>
          </div>
          <span className="text-[10px] text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded">
            Click chọn hàng để xem
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {sortedSensors.map(sensor => {
            const isSelected = selectedSensorId === sensor.id;
            return (
              <div
                key={sensor.id}
                onClick={() => onSelectSensor(sensor)}
                className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between ${
                  isSelected 
                    ? 'bg-emerald-50/60 border-l-4 border-emerald-600' 
                    : 'hover:bg-slate-50/80 border-l-4 border-transparent'
                }`}
              >
                <div className="min-w-0 flex-1 pr-3">
                  {/* Mã ID không bao giờ bị rớt dòng */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded shrink-0 whitespace-nowrap">
                      {sensor.id}
                    </span>
                    <span className="font-semibold text-xs text-slate-900 leading-snug">
                      {sensor.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {sensor.zoneName}
                    </span>
                    <span className="flex items-center gap-1 font-mono shrink-0">
                      {sensor.batteryPct < 20 ? (
                        <BatteryLow className="w-3 h-3 text-rose-500" />
                      ) : (
                        <Battery className="w-3 h-3 text-emerald-600" />
                      )}
                      {sensor.batteryPct}% Pin
                    </span>
                  </div>

                  {/* Giá trị đo tóm tắt */}
                  {sensor.status !== 'NO_DATA' ? (
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600 pt-1.5 border-t border-slate-100/80">
                      <span>Đất: <b className="text-slate-800">{sensor.metrics.soilMoisture?.value ?? '--'}%</b></span>
                      <span>Nhiệt: <b className="text-slate-800">{sensor.metrics.airTemperature?.value ?? '--'}°C</b></span>
                      <span>pH: <b className="text-slate-800">{sensor.metrics.ph?.value ?? '--'}</b></span>
                    </div>
                  ) : (
                    <div className="mt-1.5 text-[10px] text-slate-400 italic flex items-center gap-1">
                      <WifiOff className="w-3 h-3" /> Chưa có chuyến bay UAV thu thập dữ liệu
                    </div>
                  )}
                </div>

                {/* Trạng thái bên phải */}
                <div className="flex items-center gap-2 shrink-0">
                  {sensor.status === 'NORMAL' && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full whitespace-nowrap">
                      Bình thường
                    </span>
                  )}
                  {sensor.status === 'WARNING' && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/60 rounded-full flex items-center gap-1 whitespace-nowrap">
                      <AlertTriangle className="w-2.5 h-2.5 text-amber-600" /> Cảnh báo
                    </span>
                  )}
                  {sensor.status === 'OFFLINE' && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 rounded-full whitespace-nowrap">
                      Quá hạn sync
                    </span>
                  )}
                  {sensor.status === 'NO_DATA' && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-full whitespace-nowrap">
                      Chưa sync
                    </span>
                  )}

                  <ChevronRight className={`w-3.5 h-3.5 transition shrink-0 ${isSelected ? 'text-emerald-600 translate-x-0.5' : 'text-slate-300'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}