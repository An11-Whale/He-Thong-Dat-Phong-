import { useState, useMemo } from 'react';
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
import { 
  Droplets, 
  Thermometer, 
  Sun, 
  Activity, 
  TrendingUp, 
  Calendar 
} from 'lucide-react';

const METRIC_CONFIGS = {
  soilMoisture: {
    label: 'Độ ẩm đất',
    unit: '%',
    icon: Droplets,
    color: '#059669',
    minThresh: 30,
    maxThresh: 70,
    domain: [0, 100]
  },
  airTemperature: {
    label: 'Nhiệt độ không khí',
    unit: '°C',
    icon: Thermometer,
    color: '#f59e0b',
    minThresh: 18,
    maxThresh: 32,
    domain: [10, 45]
  },
  airHumidity: {
    label: 'Độ ẩm không khí',
    unit: '%',
    icon: Droplets,
    color: '#06b6d4',
    minThresh: 50,
    maxThresh: 85,
    domain: [20, 100]
  },
  lightIntensity: {
    label: 'Cường độ ánh sáng',
    unit: 'Lux',
    icon: Sun,
    color: '#eab308',
    minThresh: 10000,
    maxThresh: 45000,
    domain: [0, 60000]
  },
  ph: {
    label: 'Độ pH',
    unit: 'pH',
    icon: Activity,
    color: '#a855f7',
    minThresh: 5.5,
    maxThresh: 7.0,
    domain: [3, 9]
  },
  waterLevel: {
    label: 'Mực nước',
    unit: 'cm',
    icon: TrendingUp,
    color: '#0d9488',
    minThresh: 8,
    maxThresh: 25,
    domain: [0, 35]
  }
};

type MetricKey = keyof typeof METRIC_CONFIGS;
type TimeRange = '24h' | '7d' | '30d';

interface HistoryChartProps {
  sensorName: string;
}

export function HistoryChart({ sensorName }: HistoryChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('soilMoisture');
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');

  const currentConfig = METRIC_CONFIGS[selectedMetric];

  const chartData = useMemo(() => {
    if (timeRange === '24h') {
      const hours = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00', '03:00', '07:15'];
      return hours.map(h => {
        let baseVal = 50;
        if (selectedMetric === 'soilMoisture') baseVal = 58;
        if (selectedMetric === 'airTemperature') baseVal = 26;
        if (selectedMetric === 'airHumidity') baseVal = 75;
        if (selectedMetric === 'lightIntensity') baseVal = 28000;
        if (selectedMetric === 'ph') baseVal = 6.3;
        if (selectedMetric === 'waterLevel') baseVal = 16.5;

        const jitter = (Math.random() - 0.5) * (baseVal * 0.25);
        return {
          timestamp: h,
          value: Number((baseVal + jitter).toFixed(1))
        };
      });
    }

    if (timeRange === '7d') {
      const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Hôm nay'];
      return days.map(d => {
        let baseVal = 55;
        if (selectedMetric === 'soilMoisture') baseVal = 60;
        if (selectedMetric === 'airTemperature') baseVal = 25;
        if (selectedMetric === 'airHumidity') baseVal = 72;
        if (selectedMetric === 'lightIntensity') baseVal = 32000;
        if (selectedMetric === 'ph') baseVal = 6.4;
        if (selectedMetric === 'waterLevel') baseVal = 17.0;

        const jitter = (Math.random() - 0.5) * (baseVal * 0.2);
        return {
          timestamp: d,
          value: Number((baseVal + jitter).toFixed(1))
        };
      });
    }

    const weeks = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
    return weeks.map(w => {
      let baseVal = 52;
      if (selectedMetric === 'soilMoisture') baseVal = 59;
      if (selectedMetric === 'airTemperature') baseVal = 24.5;
      if (selectedMetric === 'airHumidity') baseVal = 70;
      if (selectedMetric === 'lightIntensity') baseVal = 30000;
      if (selectedMetric === 'ph') baseVal = 6.2;
      if (selectedMetric === 'waterLevel') baseVal = 15.5;

      const jitter = (Math.random() - 0.5) * (baseVal * 0.15);
      return {
        timestamp: w,
        value: Number((baseVal + jitter).toFixed(1))
      };
    });
  }, [selectedMetric, timeRange]);

  const stats = useMemo(() => {
    if (!chartData.length) return { min: 0, max: 0, avg: 0 };
    const values = chartData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));
    return { min, max, avg };
  }, [chartData]);

  return (
    <div className="space-y-3">
      {/* Tiêu đề & Chọn thời gian */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div>
          <h4 className="text-[11px] font-semibold text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-slate-400" />
            Biến thiên lịch sử: {currentConfig.label}
          </h4>
          <p className="text-[10px] text-slate-400">{sensorName}</p>
        </div>

        <div className="inline-flex p-0.5 bg-slate-100 rounded-md text-[10px] border border-slate-200/60">
          <button
            onClick={() => setTimeRange('24h')}
            className={`px-2 py-0.5 rounded transition ${
              timeRange === '24h' 
                ? 'bg-white text-emerald-700 shadow-xs font-semibold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            24 giờ
          </button>
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-2 py-0.5 rounded transition ${
              timeRange === '7d' 
                ? 'bg-white text-emerald-700 shadow-xs font-semibold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7 ngày
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-2 py-0.5 rounded transition ${
              timeRange === '30d' 
                ? 'bg-white text-emerald-700 shadow-xs font-semibold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30 ngày
          </button>
        </div>
      </div>

      {/* Tabs chọn 6 chỉ số */}
      <div className="grid grid-cols-6 gap-1 bg-slate-100/70 p-1 rounded-lg border border-slate-200/50">
        {(Object.keys(METRIC_CONFIGS) as MetricKey[]).map(key => {
          const cfg = METRIC_CONFIGS[key];
          const Icon = cfg.icon;
          const isActive = selectedMetric === key;

          return (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`flex flex-col items-center py-1 px-0.5 rounded text-[9px] transition ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200/70'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon 
                className="w-3 h-3 mb-0.5" 
                style={{ color: isActive ? cfg.color : '#94a3b8' }} 
              />
              <span className="truncate w-full text-center">{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* Vùng vẽ biểu đồ */}
      <div className="h-40 w-full bg-slate-50/50 p-1.5 rounded-lg border border-slate-100">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.35}/>
                <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis domain={currentConfig.domain} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', border: 'none', color: '#fff', fontSize: '10px' }}
              formatter={(value: any) => [`${value} ${currentConfig.unit}`, currentConfig.label]}
            />
            <ReferenceLine 
              y={currentConfig.maxThresh} 
              stroke="#ef4444" 
              strokeDasharray="3 3" 
              label={{ value: `Max: ${currentConfig.maxThresh}`, fill: '#ef4444', fontSize: 8, position: 'insideTopRight' }} 
            />
            <ReferenceLine 
              y={currentConfig.minThresh} 
              stroke="#f59e0b" 
              strokeDasharray="3 3" 
              label={{ value: `Min: ${currentConfig.minThresh}`, fill: '#f59e0b', fontSize: 8, position: 'insideBottomRight' }} 
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={currentConfig.color} 
              strokeWidth={1.75} 
              fillOpacity={1} 
              fill="url(#metricGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Thống kê tự động */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-2 rounded-lg border border-slate-100 text-center">
        <div>
          <span className="text-[9px] text-slate-400">Thấp nhất (Min)</span>
          <p className="font-bold text-xs text-slate-800 font-mono">
            {stats.min} <span className="text-[9px] text-slate-400 font-normal">{currentConfig.unit}</span>
          </p>
        </div>
        <div className="border-x border-slate-200">
          <span className="text-[9px] text-slate-400">Trung bình (Avg)</span>
          <p className="font-bold text-xs text-emerald-600 font-mono">
            {stats.avg} <span className="text-[9px] text-slate-400 font-normal">{currentConfig.unit}</span>
          </p>
        </div>
        <div>
          <span className="text-[9px] text-slate-400">Cao nhất (Max)</span>
          <p className="font-bold text-xs text-slate-800 font-mono">
            {stats.max} <span className="text-[9px] text-slate-400 font-normal">{currentConfig.unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
}