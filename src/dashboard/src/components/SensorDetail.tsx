import type { SensorNode, MetricHistoryPoint } from '../types/sensor';
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
  Plane 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';

interface SensorDetailProps {
  sensor: SensorNode | null;
  historyData: MetricHistoryPoint[];
}

export function SensorDetail({ sensor, historyData }: SensorDetailProps) {
  if (!sensor) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-8 text-center text-slate-400">
        Vui lòng chọn một cảm biến từ danh sách bên trái để xem chi tiết.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      
      {/* Tiêu đề Sensor */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
            {sensor.id}
          </span>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500 font-mono">
            <Battery className="w-4 h-4 text-slate-400" /> {sensor.batteryPct}% Pin
          </div>
        </div>
        <h3 className="font-bold text-base text-slate-900 mt-2">{sensor.name}</h3>
        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {sensor.zoneName}
        </p>
      </div>

      {/* XỬ LÝ TRẠNG THÁI RỖNG (EMPTY STATE BẮT BUỘC THEO ĐỀ BÀI) */}
      {sensor.status === 'NO_DATA' ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-slate-400 shadow-sm border border-slate-200">
            <WifiOff className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Chưa Có Dữ Liệu Thu Thập</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
              Cảm biến đã được đăng ký trên bản đồ nhưng UAV chưa thực hiện bay qua nạp dữ liệu.
            </p>
          </div>
          <div className="pt-2">
            <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
              Sẽ đồng bộ trong chuyến bay kế tiếp
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* Cảnh báo timeout nếu có */}
          {sensor.status === 'OFFLINE' && (
            <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Dữ liệu quá hạn (Timeout):</span> Đã hơn 48 giờ UAV chưa thu thập được dữ liệu từ node này. Vui lòng kiểm tra lại thiết bị hoặc lộ trình bay.
              </div>
            </div>
          )}

          {/* LƯỚI 6 THÔNG SỐ ĐO MÔI TRƯỜNG */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Thông Số Môi Trường Mới Nhất
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {/* 1. Độ ẩm đất */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" /> Độ ẩm đất
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {sensor.metrics.soilMoisture?.value ?? '--'}
                  <span className="text-xs font-normal text-slate-400 ml-1">%</span>
                </div>
              </div>

              {/* 2. Nhiệt độ KK */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Nhiệt độ KK
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {sensor.metrics.airTemperature?.value ?? '--'}
                  <span className="text-xs font-normal text-slate-400 ml-1">°C</span>
                </div>
              </div>

              {/* 3. Độ ẩm KK */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500" /> Độ ẩm KK
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {sensor.metrics.airHumidity?.value ?? '--'}
                  <span className="text-xs font-normal text-slate-400 ml-1">%</span>
                </div>
              </div>

              {/* 4. Cường độ sáng */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Sun className="w-3.5 h-3.5 text-yellow-500" /> Ánh sáng
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {sensor.metrics.lightIntensity?.value ?? '--'}
                  <span className="text-xs font-normal text-slate-400 ml-1">Lux</span>
                </div>
              </div>

              {/* 5. Độ pH */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Activity className="w-3.5 h-3.5 text-purple-500" /> Độ pH
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {sensor.metrics.ph?.value ?? '--'}
                  <span className="text-xs font-normal text-slate-400 ml-1">pH</span>
                </div>
              </div>

              {/* 6. Mực nước */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-500" /> Mực nước
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {sensor.metrics.waterLevel?.value ?? '--'}
                  <span className="text-xs font-normal text-slate-400 ml-1">cm</span>
                </div>
              </div>
            </div>
          </div>

          {/* BIỂU ĐỒ VÙNG CHUỖI THỜI GIAN (F06) */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Biến Thiên Độ Ẩm Đất (24 Giờ Qua)
              </h4>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded">
                Ngưỡng: 30% - 70%
              </span>
            </div>

            <div className="h-44 w-full bg-slate-50/50 p-2 rounded-xl border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`${value} %`, 'Độ ẩm đất']}
                  />
                  <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Max (70%)', fill: '#ef4444', fontSize: 9, position: 'insideTopRight' }} />
                  <ReferenceLine y={30} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Min (30%)', fill: '#f59e0b', fontSize: 9, position: 'insideBottomRight' }} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#059669" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorMoisture)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHI TIẾT THỜI GIAN ĐỒNG BỘ */}
          <div className="bg-slate-50/70 p-3.5 rounded-xl text-xs text-slate-500 space-y-2 border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Cảm biến đo lúc:
              </span>
              <span className="font-semibold text-slate-700 font-mono">
                {sensor.lastMeasurementAt 
                  ? new Date(sensor.lastMeasurementAt).toLocaleTimeString() 
                  : '--'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-slate-400" /> UAV đồng bộ lúc:
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