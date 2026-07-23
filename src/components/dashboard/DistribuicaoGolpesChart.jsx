import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DistribuicaoGolpesChart({ ippon, wazaAri, yuko, title }) {
  const data = [
    { name: 'Ippon (3pts)', value: ippon },
    { name: 'Waza-ari (2pts)', value: wazaAri },
    { name: 'Yuko (1pt)', value: yuko },
  ];

  // Cores fortes para combinar com o layout
  const COLORS = ['#D32F2F', '#2563EB', '#F59E0B']; 

  const total = ippon + wazaAri + yuko;

  return (
    <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
      <div className="bg-black text-white p-2 font-black uppercase text-center text-xs tracking-widest border-b-[3px] border-black">
        {title}
      </div>
      <div className="flex-1 p-4 min-h-[250px]">
        {total > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="#000"
                strokeWidth={3}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ border: '3px solid black', borderRadius: 0, boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontWeight: 'black', fontSize: '10px', textTransform: 'uppercase' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center italic text-slate-400 font-bold uppercase text-[10px]">
            Sem dados de golpes
          </div>
        )}
      </div>
    </div>
  );
}