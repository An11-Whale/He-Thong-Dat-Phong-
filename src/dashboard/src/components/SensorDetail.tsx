import type { SensorNode } from '../types/sensor';
import { HistoryChart } from './HistoryChart';
import { 
  Battery, 
  MapPin, 
  WifiOff, 
  AlertTriangle, 
  Droplets, 
  Thermometer, 
  Sun, 
  Activity, 
  TrendingUp, 
  Clock, 
  Plane,
  Sparkles
} from 'lucide-react';

interface SensorDetailProps {
  sensor: SensorNode | null;
}

export function SensorDetail({ sensor }: SensorDetailProps) {
  if (!sensor) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-8 text-center text-xs text-slate-400">
        Vui lòng chọn một cảm biến từ danh sách bên trái để xem chi tiết.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-5">
      
      {/* 1. Header Tên & Khu Vực của Sensor */}
      <div className="border-b border-slate-100 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
            {sensor.id}
          </span>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500 font-mono">
            <Battery className="w-3.5 h-3.5 text-slate-400" /> {sensor.batteryPct}% Pin
          </div>
        </div>
        <h3 className="font-bold text-sm text-slate-900 mt-1.5 leading-snug">{sensor.name}</h3>
        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400" /> {sensor.zoneName}
        </p>
      </div>

      {/* 2. XỬ LÝ TRẠNG THÁI RỖNG (ĐÃ SỬA GỌN ĐẸP, KHÔNG BAO GIỜ BỊ RỚT DÒNG) */}
      {sensor.status === 'NO_DATA' ? (
        <div className="p-7 text-center bg-slate-50/80 rounded-xl border border-dashed border-slate-200 space-y-3">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center mx-auto text-slate-400 shadow-sm border border-slate-200">
            <WifiOff className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs">Chưa Có Dữ Liệu Thu Thập</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[240px] mx-auto leading-relaxed">
              Cảm biến đã được khai báo trên hệ thống nhưng chưa có chuyến bay UAV nào thực hiện nạp dữ liệu.
            </p>
          </div>
          <div className="pt-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 whitespace-nowrap shadow-xs">
              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
              Sẽ thu thập trong chuyến bay kế tiếp
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* Cảnh báo timeout nếu có */}
          {sensor.status === 'OFFLINE' && (
            <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed text-[11px]">
                <span className="font-bold">Dữ liệu quá hạn:</span> Đã hơn 48 giờ UAV chưa thu thập được dữ liệu từ node này. Vui lòng kiểm tra lại thiết bị hoặc lộ trình bay.
              </div>
            </div>
          )}

          {/* 3. Lưới 6 Thông Số Môi Trường Mới Nhất */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Thông Số Môi Trường Mới Nhất
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Droplets className="w-3 h-3 text-blue-500" /> Độ ẩm đất
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                  {sensor.metrics.soilMoisture?.value ?? '--'}
                  <span className="text-[11px] font-normal text-slate-400 ml-0.5">%</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Thermometer className="w-3 h-3 text-amber-500" /> Nhiệt độ KK
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                  {sensor.metrics.airTemperature?.value ?? '--'}
                  <span className="text-[11px] font-normal text-slate-400 ml-0.5">°C</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Droplets className="w-3 h-3 text-cyan-500" /> Độ ẩm KK
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                  {sensor.metrics.airHumidity?.value ?? '--'}
                  <span className="text-[11px] font-normal text-slate-400 ml-0.5">%</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Sun className="w-3 h-3 text-yellow-500" /> Ánh sáng
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                  {sensor.metrics.lightIntensity?.value ?? '--'}
                  <span className="text-[11px] font-normal text-slate-400 ml-0.5">Lux</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Activity className="w-3 h-3 text-purple-500" /> Độ pH
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                  {sensor.metrics.ph?.value ?? '--'}
                  <span className="text-[11px] font-normal text-slate-400 ml-0.5">pH</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <TrendingUp className="w-3 h-3 text-teal-500" /> Mực nước
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                  {sensor.metrics.waterLevel?.value ?? '--'}
                  <span className="text-[11px] font-normal text-slate-400 ml-0.5">cm</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. BIỂU ĐỒ LỊCH SỬ CHUYÊN SÂU */}
          <div className="border-t border-slate-100 pt-4">
            <HistoryChart sensorName={sensor.name} />
          </div>

          {/* 5. Thông Tin Thời Gian Đo & UAV Đồng Bộ */}
          <div className="bg-slate-50/70 p-3 rounded-xl text-xs text-slate-500 space-y-1.5 border border-slate-100">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3 h-3" /> Cảm biến đo lúc:
              </span>
              <span className="font-semibold text-slate-700 font-mono">
                {sensor.lastMeasurementAt 
                  ? new Date(sensor.lastMeasurementAt).toLocaleTimeString() 
                  : '--'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Plane className="w-3 h-3" /> UAV đồng bộ lúc:
              </span>
              <span className="font-semibold text-slate-700 font-mono">
                {sensor.lastSyncAt 
                  ? new Date(sensor.lastSyncAt).toLocaleTimeString() 
                  : '--'}
              </span>
            </div>
          </div>
        </>
      )}

    </div>
  );
}