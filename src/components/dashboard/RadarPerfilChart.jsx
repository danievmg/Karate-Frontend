import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function RadarPerfilChart({ data, title }) {
  return (
    <div className="bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden h-full">
      <div className="bg-black text-white p-2 font-black uppercase text-center text-xs tracking-widest border-b-[3px] border-black">
        {title}
      </div>
      <div className="p-4 bg-[#F3F0E6] h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#000" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#000', fontWeight: 'bold', fontSize: 10 }} />
            <Radar
              name="Performance"
              dataKey="A"
              stroke="#D32F2F"
              fill="#D32F2F"
              fillOpacity={0.6}
              strokeWidth={3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}