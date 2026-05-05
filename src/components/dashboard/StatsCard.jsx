import React from 'react';

export default function StatsCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col justify-between min-h-[120px]">
      <div className="flex items-center justify-between mb-2">
        <span className="uppercase font-black text-[10px] tracking-tighter text-slate-500">{title}</span>
        <Icon className="w-5 h-5 text-black" />
      </div>
      <div>
        <div className="text-4xl font-black uppercase leading-none">{value}</div>
        {subtitle && (
          <div className="text-[10px] font-bold mt-1 text-slate-600 uppercase border-t border-black pt-1">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}