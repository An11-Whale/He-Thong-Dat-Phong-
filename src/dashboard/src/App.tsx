import { useState } from 'react';
import { MOCK_SENSORS, MOCK_HISTORY_SOIL } from './mocks/mockSensors';
import type { SensorNode } from './types/sensor';
import { Sidebar } from './components/Sidebar';
import { KpiCards } from './components/KpiCards';
import { SensorTable } from './components/SensorTable';
import { SensorDetail } from './components/SensorDetail';
import { MapPin } from 'lucide-react';

export default function App() {
  const [selectedSensor, setSelectedSensor] = useState<SensorNode | null>(MOCK_SENSORS[0]);

  // Thống kê nhanh cho các thẻ KPI
  const total = MOCK_SENSORS.length;
  const normal = MOCK_SENSORS.filter(s => s.status === 'NORMAL').length;
  const warning = MOCK_SENSORS.filter(s => s.status === 'WARNING').length;
  const offline = MOCK_SENSORS.filter(s => s.status === 'OFFLINE' || s.status === 'NO_DATA').length;

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
      {/* 1. Sidebar điều hướng bên trái */}
      <Sidebar />

      {/* 2. Không gian làm việc chính */}
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

        {/* Khu vực nội dung cuộn */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Hàng 4 thẻ KPI tổng quan (F04) */}
          <KpiCards total={total} normal={normal} warning={warning} offline={offline} />

          {/* Bố cục chính 2 cột */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Cột trái: Bảng danh sách cảm biến, bộ lọc & sắp xếp (7 cột) */}
            <div className="col-span-7">
              <SensorTable 
                sensors={MOCK_SENSORS} 
                selectedSensorId={selectedSensor?.id ?? null} 
                onSelectSensor={setSelectedSensor} 
              />
            </div>

            {/* Cột phải: Khối chi tiết cảm biến & biểu đồ lịch sử (5 cột) */}
            <div className="col-span-5">
              <SensorDetail 
                sensor={selectedSensor} 
                historyData={MOCK_HISTORY_SOIL} 
              />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}