import { Plane, Radio, Activity } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-48 bg-[#0f172a] text-slate-300 flex flex-col justify-between p-3 border-r border-slate-800 shadow-md shrink-0">
      <div className="space-y-4">
        {/* Logo */}
        <div className="flex items-center gap-2 px-1 pt-0.5">
          <div className="h-7 w-7 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Plane className="w-3.5 h-3.5 -rotate-45" />
          </div>
          <div>
            <div className="font-bold text-white text-xs tracking-tight leading-none">AeroFarm</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Nền tảng IoT nông trại</div>
          </div>
        </div>

        {/* Menu Điều Hướng */}
        <nav className="space-y-0.5 text-xs font-normal">
          <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
            Menu quản trị
          </div>
          
          <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-emerald-600 text-white font-medium shadow-xs transition text-xs">
            <Radio className="w-3.5 h-3.5 text-emerald-100 shrink-0" />
            <span className="truncate">Giám sát cảm biến</span>
          </button>

          <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-slate-400 hover:bg-slate-800/80 hover:text-white transition text-xs">
            <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Bảng tổng quan</span>
          </button>

          <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-slate-400 hover:bg-slate-800/80 hover:text-white transition text-xs">
            <Plane className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Chuyến bay UAV</span>
          </button>
        </nav>
      </div>

      {/* Thông tin trạm thu UAV Gateway */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-slate-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Trạm UAV Gateway
          </span>
          <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1 rounded">
            SẴN SÀNG
          </span>
        </div>
        <p className="text-[9px] text-slate-400 leading-tight">
          Đồng bộ: <b>07:45</b> (Thành công)
        </p>
      </div>
    </aside>
  );
}