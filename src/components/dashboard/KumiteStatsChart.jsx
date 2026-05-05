import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function KumiteStatsChart({ data, title }) {
  return (
    <div className="bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="bg-black text-white p-2 font-black uppercase text-center text-xs border-b-[3px] border-black">
        {title}
      </div>
      <div className="p-4 bg-[#F3F0E6]">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#000" vertical={false} />
              <XAxis dataKey="data" tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={{ stroke: '#000', strokeWidth: 2 }} />
              <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={{ stroke: '#000', strokeWidth: 2 }} />
              <Tooltip contentStyle={{ border: '2px solid black', borderRadius: '0' }} />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
              <Bar dataKey="ippon" name="IPPON" fill="#D32F2F" stroke="#000" strokeWidth={2} />
              <Bar dataKey="waza_ari" name="WAZA-ARI" fill="#3b82f6" stroke="#000" strokeWidth={2} />
              <Bar dataKey="yuko" name="YUKO" fill="#f59e0b" stroke="#000" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}