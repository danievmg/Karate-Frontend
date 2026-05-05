import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function PerformanceChart({ data, title, dataKey1, dataKey2, label1, label2 }) {
  return (
    <div className="bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="bg-black text-white p-2 font-black uppercase text-center text-xs tracking-widest border-b-[3px] border-black">
        {title}
      </div>
      <div className="p-4 bg-[#F3F0E6]">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#000" vertical={false} />
              <XAxis dataKey="data" tick={{ fontSize: 10, fontWeight: 'bold', fill: '#000' }} axisLine={{ stroke: '#000', strokeWidth: 2 }} />
              <YAxis domain={[5, 10]} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#000' }} axisLine={{ stroke: '#000', strokeWidth: 2 }} />
              <Tooltip contentStyle={{ border: '2px solid black', borderRadius: '0', fontWeight: 'bold' }} />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
              <Line type="stepAfter" dataKey={dataKey1} name={label1} stroke="#D32F2F" strokeWidth={4} dot={{ r: 6, fill: '#000', strokeWidth: 2 }} />
              {dataKey2 && (
                <Line type="stepAfter" dataKey={dataKey2} name={label2} stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#000', strokeWidth: 2 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}