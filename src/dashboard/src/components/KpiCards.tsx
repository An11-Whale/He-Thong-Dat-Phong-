import { Radio, CheckCircle2, AlertTriangle, WifiOff } from 'lucide-react';

interface KpiCardsProps {
  total: number;
  normal: number;
  warning: number;
  offline: number;
}

export function KpiCards({ total, normal, warning, offline }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* 1. Tổng Cảm Biến */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Tổng Cảm Biến</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{total}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
          <Radio className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Hoạt Động Tốt */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Hoạt Động Tốt</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{normal}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Cảnh Báo Ngưỡng */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Cảnh Báo Ngưỡng</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{warning}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      {/* 4. Cần Kiểm Tra / Chưa Sync */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Cần Kiểm Tra / Chưa Sync</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{offline}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
          <WifiOff className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}