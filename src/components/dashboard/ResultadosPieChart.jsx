import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = { vitoria: '#10b981', derrota: '#ef4444', empate: '#f59e0b' };

export default function ResultadosPieChart({ vitorias, derrotas, empates, title }) {
  const data = [
    { name: 'Vitórias', value: vitorias, color: COLORS.vitoria },
    { name: 'Derrotas', value: derrotas, color: COLORS.derrota },
    { name: 'Empates', value: empates, color: COLORS.empate }
  ].filter(d => d.value > 0);

  const total = vitorias + derrotas + empates;

  return (
    <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
      <div className="bg-black text-white p-3 border-b-[3px] border-black">
        <h3 className="font-black uppercase text-sm tracking-widest text-center">{title}</h3>
      </div>
      <div className="p-4 flex-1">
        {total > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="#000" strokeWidth={2}>
                  {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ border: '3px solid black', borderRadius: '0', fontWeight: 'bold' }} />
                <Legend wrapperStyle={{ fontWeight: 'bold', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center font-bold text-slate-400 uppercase text-xs">Sem dados</div>
        )}
        <div className="flex justify-center gap-6 mt-4 pt-4 border-t-2 border-black">
          <div className="text-center"><p className="text-2xl font-black text-emerald-600">{vitorias}</p><p className="text-[10px] font-bold uppercase">Vitórias</p></div>
          <div className="text-center"><p className="text-2xl font-black text-red-500">{derrotas}</p><p className="text-[10px] font-bold uppercase">Derrotas</p></div>
          <div className="text-center"><p className="text-2xl font-black text-amber-500">{empates}</p><p className="text-[10px] font-bold uppercase">Empates</p></div>
        </div>
      </div>
    </div>
  );
}