import { useState, useMemo, useEffect } from 'react';
import { sensorService } from './services/sensorService';
import type { SensorNode } from './types/sensor';
import { 
  Plane, 
  Search, 
  MapPin, 
  BatteryLow, 
  Battery, 
  AlertTriangle, 
  WifiOff,
  Droplets,
  Thermometer,
  Sun,
  Activity,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  RefreshCw
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

// Cấu hình 6 thông số cảm biến nông nghiệp
const METRIC_CONFIGS = {
  soilMoisture: { label: 'Độ ẩm đất', unit: '%', icon: Droplets, color: '#059669', min: 30, max: 70, domain: [0, 100] },
  airTemperature: { label: 'Nhiệt độ không khí', unit: '°C', icon: Thermometer, color: '#d97706', min: 18, max: 32, domain: [10, 45] },
  airHumidity: { label: 'Độ ẩm không khí', unit: '%', icon: Droplets, color: '#0284c7', min: 50, max: 85, domain: [20, 100] },
  lightIntensity: { label: 'Cường độ ánh sáng', unit: 'Lux', icon: Sun, color: '#ca8a04', min: 10000, max: 45000, domain: [0, 60000] },
  ph: { label: 'Độ pH', unit: 'pH', icon: Activity, color: '#9333ea', min: 5.5, max: 7.0, domain: [3, 9] },
  waterLevel: { label: 'Mực nước', unit: 'cm', icon: TrendingUp, color: '#0f766e', min: 8, max: 25, domain: [0, 35] }
};

type MetricKey = keyof typeof METRIC_CONFIGS;

export default function App() {
  const [sensors, setSensors] = useState<SensorNode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedSensor, setSelectedSensor] = useState<SensorNode | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('soilMoisture');
  const [timeRange, setTimeRange] = useState<'24h' | '7d'>('24h');

  // Hàm tải dữ liệu cảm biến từ Service (Ngày 8-9)
  const fetchSensorsData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await sensorService.getLatestSensors();
      setSensors(data);
      if (data.length > 0 && !selectedSensor) {
        setSelectedSensor(data[0]);
      }
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động tải khi mở ứng dụng
  useEffect(() => {
    fetchSensorsData();
  }, []);

  // Thống kê nhanh
  const total = sensors.length;
  const normal = sensors.filter(s => s.status === 'NORMAL').length;
  const warning = sensors.filter(s => s.status === 'WARNING').length;
  const offline = sensors.filter(s => s.status === 'OFFLINE' || s.status === 'NO_DATA').length;

  // Lọc cảm biến
  const filteredSensors = sensors.filter(s => {
    const matchName = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchZone = selectedZone === 'ALL' || s.zoneId === selectedZone;
    const matchStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
    return matchName && matchZone && matchStatus;
  });

  const currentMetric = METRIC_CONFIGS[selectedMetric];

  // Dữ liệu biểu đồ theo thời gian
  const chartData = useMemo(() => {
    if (timeRange === '24h') {
      const hours = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00', '03:00', '07:15'];
      return hours.map(h => {
        let base = selectedMetric === 'soilMoisture' ? 58 : selectedMetric === 'airTemperature' ? 26 : selectedMetric === 'airHumidity' ? 75 : selectedMetric === 'lightIntensity' ? 28000 : selectedMetric === 'ph' ? 6.3 : 16.5;
        const jitter = (Math.random() - 0.5) * (base * 0.2);
        return { timestamp: h, value: Number((base + jitter).toFixed(1)) };
      });
    }
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Hôm nay'];
    return days.map(d => {
      let base = selectedMetric === 'soilMoisture' ? 60 : selectedMetric === 'airTemperature' ? 25 : 70;
      const jitter = (Math.random() - 0.5) * (base * 0.15);
      return { timestamp: d, value: Number((base + jitter).toFixed(1)) };
    });
  }, [selectedMetric, timeRange]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans flex flex-col">
      
      {/* 1. THANH TIÊU ĐỀ & KẾT NỐI API */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Plane className="w-4 h-4 -rotate-45" />
            </div>
            <h1 className="font-bold text-base text-slate-900">Hệ thống giám sát cảm biến nông trại qua UAV</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Thu thập và đồng bộ dữ liệu môi trường từ các trạm cảm biến phân tán</p>
        </div>

        {/* Các nút trạng thái & Làm mới dữ liệu */}
        <div className="flex items-center gap-2.5 text-xs">
          <button 
            onClick={fetchSensorsData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg border border-slate-200 transition cursor-pointer"
            title="Tải lại dữ liệu mới nhất"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Làm mới</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Khu nông nghiệp CNC #01</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-lg text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>UAV đồng bộ gần nhất: <b>07:45</b></span>
          </div>
        </div>
      </header>

      {/* 2. KHÔNG GIAN LÀM VIỆC CHÍNH */}
      <div className="flex-1 p-5 space-y-4 max-w-7xl w-full mx-auto">
        
        {/* BANNER THÔNG BÁO NẾU GẶP LỖI MÁY CHỦ */}
        {isError && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Không thể kết nối trực tiếp đến máy chủ backend. Hệ thống đang sử dụng dữ liệu bộ nhớ đệm an toàn.</span>
            </div>
            <button 
              onClick={fetchSensorsData}
              className="px-2.5 py-1 bg-rose-600 text-white rounded-md text-[11px] font-medium hover:bg-rose-700 transition"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* HÀNG 4 THẺ THỐNG KÊ NHANH */}
        <div className="grid grid-cols-4 gap-3.5">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Tổng số cảm biến</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5 font-mono">{total} <span className="text-xs font-normal text-slate-400">node</span></p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
              {total}
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Hoạt động bình thường</p>
              <p className="text-xl font-bold text-emerald-600 mt-0.5 font-mono">{normal} <span className="text-xs font-normal text-slate-400">node</span></p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Cảnh báo vượt ngưỡng</p>
              <p className="text-xl font-bold text-amber-600 mt-0.5 font-mono">{warning} <span className="text-xs font-normal text-slate-400">node</span></p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Chờ UAV hoặc quá hạn</p>
              <p className="text-xl font-bold text-rose-600 mt-0.5 font-mono">{offline} <span className="text-xs font-normal text-slate-400">node</span></p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <WifiOff className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* BỐ CỤC 2 CỘT */}
        <div className="grid grid-cols-12 gap-4 items-start">
          
          {/* CỘT TRÁI (7 CỘT): BẢNG DANH SÁCH CẢM BIẾN */}
          <div className="col-span-12 lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            
            {/* Thanh tìm kiếm & lọc */}
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Danh sách node cảm biến thực địa ({filteredSensors.length})
                </h2>
                <span className="text-[11px] text-slate-400">Nhấp vào hàng để xem dữ liệu</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo mã node hoặc tên vị trí..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <select
                  value={selectedZone}
                  onChange={e => setSelectedZone(e.target.value)}
                  className="border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs bg-white text-slate-700 focus:outline-none"
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
                  className="border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs bg-white text-slate-700 focus:outline-none"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="NORMAL">Bình thường</option>
                  <option value="WARNING">Cảnh báo ngưỡng</option>
                  <option value="OFFLINE">Quá hạn sync</option>
                  <option value="NO_DATA">Chưa có dữ liệu</option>
                </select>
              </div>
            </div>

            {/* DANH SÁCH: HIỂN THỊ KHUNG XƯƠNG (SKELETON) HOẶC DỮ LIỆU THẬT */}
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="space-y-2 flex-1">
                      <div className="h-3.5 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-2.5 bg-slate-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-5 bg-slate-200 rounded-full w-16"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredSensors.map(sensor => {
                  const isSelected = selectedSensor?.id === sensor.id;
                  return (
                    <div
                      key={sensor.id}
                      onClick={() => setSelectedSensor(sensor)}
                      className={`p-3.5 cursor-pointer transition flex items-center justify-between ${
                        isSelected 
                          ? 'bg-emerald-50/70 border-l-4 border-emerald-600' 
                          : 'hover:bg-slate-50 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0">
                            {sensor.id}
                          </span>
                          <span className="font-semibold text-xs text-slate-900 truncate">
                            {sensor.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" /> {sensor.zoneName}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            {sensor.batteryPct < 20 ? (
                              <BatteryLow className="w-3.5 h-3.5 text-rose-500" />
                            ) : (
                              <Battery className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                            {sensor.batteryPct}% pin
                          </span>
                        </div>

                        {sensor.status !== 'NO_DATA' ? (
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-600 pt-1.5 border-t border-slate-100">
                            <span>Độ ẩm đất: <b className="text-slate-900">{sensor.metrics.soilMoisture?.value ?? '--'}%</b></span>
                            <span>Nhiệt độ: <b className="text-slate-900">{sensor.metrics.airTemperature?.value ?? '--'}°C</b></span>
                            <span>Độ pH: <b className="text-slate-900">{sensor.metrics.ph?.value ?? '--'}</b></span>
                          </div>
                        ) : (
                          <div className="mt-1.5 text-xs text-slate-400 italic flex items-center gap-1">
                            <WifiOff className="w-3 h-3" /> Chưa có chuyến bay UAV thu thập dữ liệu
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 text-right">
                        {sensor.status === 'NORMAL' && (
                          <span className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                            Bình thường
                          </span>
                        )}
                        {sensor.status === 'WARNING' && (
                          <span className="px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Cảnh báo
                          </span>
                        )}
                        {sensor.status === 'OFFLINE' && (
                          <span className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-full">
                            Quá hạn sync
                          </span>
                        )}
                        {sensor.status === 'NO_DATA' && (
                          <span className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-full">
                            Chưa có dữ liệu
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CỘT PHẢI (5 CỘT): CHI TIẾT SENSOR ĐANG CHỌN */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
              
              {/* Header Sensor đang chọn */}
              <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {selectedSensor?.id}
                    </span>
                    <span className="text-xs text-slate-400">• {selectedSensor?.zoneName}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">{selectedSensor?.name}</h3>
                </div>
                <div className="text-xs font-mono font-medium text-slate-500 flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-slate-400" /> {selectedSensor?.batteryPct}% pin
                </div>
              </div>

              {/* Xử lý trường hợp chưa có dữ liệu từ UAV */}
              {selectedSensor?.status === 'NO_DATA' ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto text-slate-400 border border-slate-200">
                    <WifiOff className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">Chưa có dữ liệu thu thập</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-[260px] mx-auto leading-relaxed">
                      Cảm biến đã lắp đặt ở phân khu nhưng UAV chưa thực hiện bay qua nạp dữ liệu.
                    </p>
                  </div>
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      Sẽ thu thập trong chuyến bay kế tiếp
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Cảnh báo quá hạn (Timeout) */}
                  {selectedSensor?.status === 'OFFLINE' && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-bold">Dữ liệu quá hạn:</span> Đã hơn 48 giờ UAV chưa thu thập được dữ liệu từ node này. Vui lòng kiểm tra lại thiết bị hoặc lộ trình bay.
                      </div>
                    </div>
                  )}

                  {/* 6 Ô THÔNG SỐ ĐO MỚI NHẤT */}
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Thông số đo mới nhất
                    </h4>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Droplets className="w-3.5 h-3.5 text-blue-500" /> Độ ẩm đất
                        </div>
                        <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                          {selectedSensor?.metrics.soilMoisture?.value ?? '--'}
                          <span className="text-xs font-normal text-slate-400 ml-1">%</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Nhiệt độ không khí
                        </div>
                        <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                          {selectedSensor?.metrics.airTemperature?.value ?? '--'}
                          <span className="text-xs font-normal text-slate-400 ml-1">°C</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Droplets className="w-3.5 h-3.5 text-cyan-500" /> Độ ẩm không khí
                        </div>
                        <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                          {selectedSensor?.metrics.airHumidity?.value ?? '--'}
                          <span className="text-xs font-normal text-slate-400 ml-1">%</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Sun className="w-3.5 h-3.5 text-yellow-500" /> Cường độ sáng
                        </div>
                        <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                          {selectedSensor?.metrics.lightIntensity?.value ?? '--'}
                          <span className="text-xs font-normal text-slate-400 ml-1">Lux</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Activity className="w-3.5 h-3.5 text-purple-500" /> Độ pH
                        </div>
                        <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                          {selectedSensor?.metrics.ph?.value ?? '--'}
                          <span className="text-xs font-normal text-slate-400 ml-1">pH</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <TrendingUp className="w-3.5 h-3.5 text-teal-500" /> Mực nước
                        </div>
                        <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">
                          {selectedSensor?.metrics.waterLevel?.value ?? '--'}
                          <span className="text-xs font-normal text-slate-400 ml-1">cm</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BIỂU ĐỒ CHUỖI THỜI GIAN LỊCH SỬ */}
                  <div className="border-t border-slate-100 pt-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Biến thiên lịch sử
                      </h4>

                      <div className="inline-flex p-0.5 bg-slate-100 rounded-md text-[11px] border border-slate-200">
                        <button
                          onClick={() => setTimeRange('24h')}
                          className={`px-2 py-0.5 rounded transition ${timeRange === '24h' ? 'bg-white text-emerald-700 font-semibold shadow-xs' : 'text-slate-600'}`}
                        >
                          24 giờ
                        </button>
                        <button
                          onClick={() => setTimeRange('7d')}
                          className={`px-2 py-0.5 rounded transition ${timeRange === '7d' ? 'bg-white text-emerald-700 font-semibold shadow-xs' : 'text-slate-600'}`}
                        >
                          7 ngày
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-1 bg-slate-100 p-1 rounded-lg">
                      {(Object.keys(METRIC_CONFIGS) as MetricKey[]).map(key => {
                        const cfg = METRIC_CONFIGS[key];
                        const Icon = cfg.icon;
                        const isActive = selectedMetric === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setSelectedMetric(key)}
                            className={`flex flex-col items-center py-1 rounded text-[10px] transition ${
                              isActive ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <Icon className="w-3 h-3 mb-0.5" style={{ color: isActive ? cfg.color : '#94a3b8' }} />
                            <span className="truncate w-full text-center">{cfg.label.split(' ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="h-40 w-full bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.35}/>
                              <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="timestamp" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <YAxis domain={currentMetric.domain} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', border: 'none', color: '#fff', fontSize: '11px' }}
                            formatter={(val: any) => [`${val} ${currentMetric.unit}`, currentMetric.label]}
                          />
                          <ReferenceLine y={currentMetric.max} stroke="#ef4444" strokeDasharray="3 3" label={{ value: `Max: ${currentMetric.max}`, fill: '#ef4444', fontSize: 8, position: 'insideTopRight' }} />
                          <ReferenceLine y={currentMetric.min} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: `Min: ${currentMetric.min}`, fill: '#f59e0b', fontSize: 8, position: 'insideBottomRight' }} />
                          <Area type="monotone" dataKey="value" stroke={currentMetric.color} strokeWidth={2} fillOpacity={1} fill="url(#chartGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* THỜI ĐIỂM CẢM BIẾN ĐO & UAV ĐỒNG BỘ */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" /> Cảm biến ghi nhận lúc:
                      </span>
                      <span className="font-semibold text-slate-700 font-mono">
                        {selectedSensor?.lastMeasurementAt ? new Date(selectedSensor.lastMeasurementAt).toLocaleTimeString() : '--'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Plane className="w-3 h-3" /> UAV đồng bộ lên hệ thống lúc:
                      </span>
                      <span className="font-semibold text-slate-700 font-mono">
                        {selectedSensor?.lastSyncAt ? new Date(selectedSensor.lastSyncAt).toLocaleTimeString() : '--'}
                      </span>
                    </div>
                  </div>
                </>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}