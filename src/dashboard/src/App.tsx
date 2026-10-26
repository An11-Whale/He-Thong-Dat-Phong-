import { useState } from 'react';
import { MOCK_SENSORS, MOCK_HISTORY_SOIL } from './mocks/mockSensors';
import type { SensorNode } from './types/sensor';
import { 
  Activity, 
  Battery, 
  BatteryLow, 
  Clock, 
  Droplets, 
  Search, 
  Sun, 
  Thermometer, 
  WifiOff, 
  AlertTriangle, 
  Plane, 
  TrendingUp, 
  MapPin, 
  CheckCircle2, 
  Radio, 
  SlidersHorizontal, 
  ChevronRight 
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

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedSensor, setSelectedSensor] = useState<SensorNode | null>(MOCK_SENSORS[0]);

  // Bộ lọc dữ liệu
  const filteredSensors = MOCK_SENSORS.filter(s => {
    const matchName = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchZone = selectedZone === 'ALL' || s.zoneId === selectedZone;
    const matchStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
    return matchName && matchZone && matchStatus;
  });

  // Thống kê nhanh cho KPI Cards
  const totalSensors = MOCK_SENSORS.length;
  const normalSensors = MOCK_SENSORS.filter(s => s.status === 'NORMAL').length;
  const warningSensors = MOCK_SENSORS.filter(s => s.status === 'WARNING').length;
  const offlineSensors = MOCK_SENSORS.filter(s => s.status === 'OFFLINE' || s.status === 'NO_DATA').length;

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
      
      {/* 1. SIDEBAR TRÁI: Thanh mảnh, tinh tế (w-52) */}
      <aside className="w-52 bg-[#0f172a] text-slate-300 flex flex-col justify-between p-3.5 border-r border-slate-800 shadow-lg shrink-0">
        <div className="space-y-5">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 px-1 pt-1">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Plane className="w-4 h-4 -rotate-45" />
            </div>
            <div>
              <div className="font-bold text-white text-sm tracking-tight leading-none">AeroFarm</div>
              <div className="text-[10px] text-slate-400 mt-1 font-medium">UAV IoT Platform</div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 text-xs font-medium">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 mb-1.5">
              Menu Quản Trị
            </div>
            
            <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-emerald-600 text-white font-medium shadow-sm transition">
              <Radio className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
              <span className="truncate">Giám Sát Cảm Biến</span>
            </button>

            <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
              <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Bảng Tổng Quan</span>
            </button>

            <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">
              <Plane className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Chuyến Bay UAV</span>
            </button>
          </nav>
        </div>

        {/* Trạng thái UAV Gateway */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              UAV Gateway
            </span>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1 py-0.5 rounded">
              READY
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Sync: <b>07:45 AM</b> (100% OK)
          </p>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Hệ Thống Thu Thập & Giám Sát Cảm Biến</h1>
            <p className="text-xs text-slate-500">Giám sát tự động các thông số vi khí hậu qua trạm thu di động UAV</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Trang Trại Công Nghệ Cao #01
            </span>
          </div>
        </header>

        {/* Nội dung cuộn */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {/* HÀNG 4 THẺ KPI TỔNG QUAN */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Tổng Cảm Biến</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalSensors}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Radio className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Hoạt Động Tốt</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{normalSensors}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Cảnh Báo Ngưỡng</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{warningSensors}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Cần Kiểm Tra / Chưa Sync</p>
                <p className="text-2xl font-bold text-rose-600 mt-1">{offlineSensors}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <WifiOff className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* THANH TÌM KIẾM & BỘ LỌC */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm mã cảm biến (VD: SN-A101) hoặc tên thiết bị..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Lọc theo:
              </div>
              <select
                value={selectedZone}
                onChange={e => setSelectedZone(e.target.value)}
                className="border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="ALL">Tất cả Khu Vực</option>
                <option value="zone-01">Khu Trồng Dâu Tây A</option>
                <option value="zone-02">Khu Cà Phê Sườn Đồi</option>
                <option value="zone-03">Khu Ươm Giống Mới</option>
                <option value="zone-04">Khu Hồ Chứa & Thủy Canh</option>
              </select>

              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="ALL">Tất cả Trạng Thái</option>
                <option value="NORMAL">Hoạt động bình thường</option>
                <option value="WARNING">Cảnh báo vượt ngưỡng</option>
                <option value="OFFLINE">Quá hạn đồng bộ</option>
                <option value="NO_DATA">Chưa có dữ liệu đo</option>
              </select>
            </div>
          </div>

          {/* BỐ CỤC CHÍNH (TABLE BÊN TRÁI - CHI TIẾT BÊN PHẢI) */}
          <div className="grid grid-cols-12 gap-6 items-start">
            
            {/* BẢNG DANH SÁCH (7 CỘT) */}
            <div className="col-span-7 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Danh Sách Node Cảm Biến Thực Địa</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Hiển thị {filteredSensors.length} thiết bị phù hợp</p>
                </div>
                <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-1 rounded">Click chọn hàng để xem chi tiết</span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredSensors.map(sensor => {
                  const isSelected = selectedSensor?.id === sensor.id;
                  return (
                    <div
                      key={sensor.id}
                      onClick={() => setSelectedSensor(sensor)}
                      className={`p-4 cursor-pointer transition-colors flex items-center justify-between ${
                        isSelected 
                          ? 'bg-emerald-50/50 border-l-4 border-emerald-600' 
                          : 'hover:bg-slate-50/80 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {sensor.id}
                          </span>
                          <span className="font-semibold text-sm text-slate-900 truncate">
                            {sensor.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {sensor.zoneName}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            {sensor.batteryPct < 20 ? (
                              <BatteryLow className="w-3.5 h-3.5 text-rose-500" />
                            ) : (
                              <Battery className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                            {sensor.batteryPct}% Pin
                          </span>
                        </div>

                        {/* Chỉ số nhanh */}
                        {sensor.status !== 'NO_DATA' && (
                          <div className="flex items-center gap-4 mt-2.5 text-[11px] text-slate-600">
                            <span>Độ ẩm đất: <b className="text-slate-800">{sensor.metrics.soilMoisture?.value ?? '--'}%</b></span>
                            <span>Nhiệt độ: <b className="text-slate-800">{sensor.metrics.airTemperature?.value ?? '--'}°C</b></span>
                            <span>pH: <b className="text-slate-800">{sensor.metrics.ph?.value ?? '--'}</b></span>
                          </div>
                        )}
                      </div>

                      {/* Trạng thái bên phải */}
                      <div className="flex items-center gap-3 shrink-0">
                        {sensor.status === 'NORMAL' && (
                          <span className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full">
                            Bình thường
                          </span>
                        )}
                        {sensor.status === 'WARNING' && (
                          <span className="px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/60 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Vượt ngưỡng
                          </span>
                        )}
                        {sensor.status === 'OFFLINE' && (
                          <span className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 rounded-full">
                            Quá hạn sync
                          </span>
                        )}
                        {sensor.status === 'NO_DATA' && (
                          <span className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-full">
                            Chưa có dữ liệu
                          </span>
                        )}

                        <ChevronRight className={`w-4 h-4 transition ${isSelected ? 'text-emerald-600 translate-x-0.5' : 'text-slate-300'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BẢNG CHI TIẾT & BIỂU ĐỒ (5 CỘT) */}
            <div className="col-span-5 space-y-4">
              {selectedSensor ? (
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6">
                  
                  {/* Tiêu đề Sensor */}
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                        {selectedSensor.id}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-500 font-mono">
                        <Battery className="w-4 h-4 text-slate-400" /> {selectedSensor.batteryPct}% Pin
                      </div>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mt-2">{selectedSensor.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedSensor.zoneName}
                    </p>
                  </div>

                  {/* XỬ LÝ EMPTY STATE NẾU CHƯA CÓ DỮ LIỆU */}
                  {selectedSensor.status === 'NO_DATA' ? (
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
                      {selectedSensor.status === 'OFFLINE' && (
                        <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div className="leading-relaxed">
                            <span className="font-bold">Dữ liệu quá hạn (Timeout):</span> Đã hơn 48 giờ UAV chưa thu thập được dữ liệu từ node này. Vui lòng kiểm tra lại thiết bị hoặc lộ trình bay.
                          </div>
                        </div>
                      )}

                      {/* LƯỚI 6 THÔNG SỐ ĐO (3 HÀNG X 2 CỘT) */}
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                          Các Chỉ Số Môi Trường Mới Nhất
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                          {/* 1. Độ ẩm đất */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                              <Droplets className="w-3.5 h-3.5 text-blue-500" /> Độ ẩm đất
                            </div>
                            <div className="text-xl font-bold text-slate-900 mt-1">
                              {selectedSensor.metrics.soilMoisture?.value ?? '--'}
                              <span className="text-xs font-normal text-slate-400 ml-1">%</span>
                            </div>
                          </div>

                          {/* 2. Nhiệt độ KK */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                              <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Nhiệt độ KK
                            </div>
                            <div className="text-xl font-bold text-slate-900 mt-1">
                              {selectedSensor.metrics.airTemperature?.value ?? '--'}
                              <span className="text-xs font-normal text-slate-400 ml-1">°C</span>
                            </div>
                          </div>

                          {/* 3. Độ ẩm KK */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                              <Droplets className="w-3.5 h-3.5 text-cyan-500" /> Độ ẩm KK
                            </div>
                            <div className="text-xl font-bold text-slate-900 mt-1">
                              {selectedSensor.metrics.airHumidity?.value ?? '--'}
                              <span className="text-xs font-normal text-slate-400 ml-1">%</span>
                            </div>
                          </div>

                          {/* 4. Cường độ sáng */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                              <Sun className="w-3.5 h-3.5 text-yellow-500" /> Ánh sáng
                            </div>
                            <div className="text-xl font-bold text-slate-900 mt-1">
                              {selectedSensor.metrics.lightIntensity?.value ?? '--'}
                              <span className="text-xs font-normal text-slate-400 ml-1">Lux</span>
                            </div>
                          </div>

                          {/* 5. Độ pH */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                              <Activity className="w-3.5 h-3.5 text-purple-500" /> Độ pH
                            </div>
                            <div className="text-xl font-bold text-slate-900 mt-1">
                              {selectedSensor.metrics.ph?.value ?? '--'}
                              <span className="text-xs font-normal text-slate-400 ml-1">pH</span>
                            </div>
                          </div>

                          {/* 6. Mực nước */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                              <TrendingUp className="w-3.5 h-3.5 text-teal-500" /> Mực nước
                            </div>
                            <div className="text-xl font-bold text-slate-900 mt-1">
                              {selectedSensor.metrics.waterLevel?.value ?? '--'}
                              <span className="text-xs font-normal text-slate-400 ml-1">cm</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* BIỂU ĐỒ VÙNG CHUỖI THỜI GIAN */}
                      <div className="border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Biến Thiên Độ Ẩm Đất (24h)
                          </h4>
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded">
                            Ngưỡng an toàn: 30% - 70%
                          </span>
                        </div>

                        <div className="h-44 w-full bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_HISTORY_SOIL} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                            {selectedSensor.lastMeasurementAt 
                              ? new Date(selectedSensor.lastMeasurementAt).toLocaleTimeString() 
                              : '--'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Plane className="w-3.5 h-3.5 text-slate-400" /> UAV đồng bộ lúc:
                          </span>
                          <span className="font-semibold text-slate-700 font-mono">
                            {selectedSensor.lastSyncAt 
                              ? new Date(selectedSensor.lastSyncAt).toLocaleTimeString() 
                              : '--'}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                </div>
              ) : null}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}