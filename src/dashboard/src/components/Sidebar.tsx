import { Plane, Radio, Activity } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-52 bg-[#0f172a] text-slate-300 flex flex-col justify-between p-3.5 border-r border-slate-800 shadow-lg shrink-0">
      <div className="space-y-5">
        {/* Logo & Tên Nền Tảng */}
        <div className="flex items-center gap-2.5 px-1 pt-1">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Plane className="w-4 h-4 -rotate-45" />
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-tight leading-none">AeroFarm</div>
            <div className="text-[10px] text-slate-400 mt-1 font-medium">UAV IoT Platform</div>
          </div>
        </div>

        {/* Menu Điều Hướng */}
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

      {/* Thông tin trạm thu UAV Gateway */}
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
  );
}