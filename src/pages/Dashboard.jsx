import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import StatsCard from '@/components/dashboard/StatsCard';
import AtletaCard from '@/components/dashboard/AtletaCard';
import ResultadosPieChart from '@/components/dashboard/ResultadosPieChart';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import KumiteStatsChart from '@/components/dashboard/KumiteStatsChart';
import RadarPerfilChart from '@/components/dashboard/RadarPerfilChart';
import { Users, Trophy, Target, Activity, Calendar, Zap, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  // ESTADO PARA O FILTRO DE ALUNO
  const [atletaId, setAtletaId] = useState('todos');

  const { data: atletas = [] } = useQuery({ queryKey: ['atletas'], queryFn: () => base44.atleta.findMany() });
  const { data: todosPontosKata = [] } = useQuery({ queryKey: ['pontosKata'], queryFn: () => base44.pontuacaoKata.findMany() });
  const { data: todosPontosKumite = [] } = useQuery({ queryKey: ['pontosKumite'], queryFn: () => base44.pontuacaoKumite.findMany() });
  const { data: eventos = [] } = useQuery({ queryKey: ['eventos'], queryFn: () => base44.evento.findMany() });

  // FILTRAGEM DINÂMICA DOS DADOS
  const pontosKata = useMemo(() => 
    atletaId === 'todos' ? todosPontosKata : todosPontosKata.filter(p => String(p.atleta_id) === String(atletaId))
  , [atletaId, todosPontosKata]);

  const pontosKumite = useMemo(() => 
    atletaId === 'todos' ? todosPontosKumite : todosPontosKumite.filter(p => String(p.atleta_id) === String(atletaId))
  , [atletaId, todosPontosKumite]);

  // === ESTATÍSTICAS RECALCULADAS ===
  const vitoriasKumite = pontosKumite.filter(p => p.resultado === 'vitoria').length;
  const derrotasKumite = pontosKumite.filter(p => p.resultado === 'derrota').length;
  const empatesKumite = pontosKumite.filter(p => p.resultado === 'empate').length;

  const mediaKata = pontosKata.length > 0 
    ? (pontosKata.reduce((acc, p) => acc + (parseFloat(p.nota_final) || 0), 0) / pontosKata.length).toFixed(1)
    : '0.0';

  // === DADOS PARA DNA (RADAR) ===
  const radarData = [
    { subject: 'IPPON', A: pontosKumite.reduce((acc, p) => acc + (p.ippon || 0), 0) },
    { subject: 'WAZA-ARI', A: pontosKumite.reduce((acc, p) => acc + (p.waza_ari || 0), 0) },
    { subject: 'YUKO', A: pontosKumite.reduce((acc, p) => acc + (p.yuko || 0), 0) },
    { subject: 'VOL. ATAQUE', A: pontosKumite.length },
    { subject: 'DEFESA', A: pontosKumite.length > 0 ? Math.max(0, 10 - (pontosKumite.reduce((acc, p) => acc + (p.pontos_sofridos || 0), 0) / pontosKumite.length)) : 0 },
  ];

  // === DADOS PARA HISTÓRICO ===
  const kataChartData = [...pontosKata].sort((a, b) => new Date(a.data) - new Date(b.data)).slice(-15).map(p => ({
    data: p.data ? format(new Date(p.data), 'dd/MM') : '',
    nota_tecnica: parseFloat(p.nota_tecnica) || 0,
    nota_atletica: parseFloat(p.nota_atletica) || 0
  }));

  const kumiteChartData = [...pontosKumite].sort((a, b) => new Date(a.data) - new Date(b.data)).slice(-15).map(p => ({
    data: p.data ? format(new Date(p.data), 'dd/MM') : '',
    ippon: parseInt(p.ippon) || 0,
    waza_ari: parseInt(p.waza_ari) || 0,
    yuko: parseInt(p.yuko) || 0
  }));

  return (
    <div className="min-h-screen bg-[#F3F0E6] p-4 md:p-6 lg:p-8 font-sans text-black overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header Responsivo */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b-4 border-black pb-6">
          <div className="text-center lg:text-left space-y-4 flex-1">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none">Dojo Performance Hub</h1>
              <p className="font-bold text-slate-600 uppercase text-[10px] md:text-xs mt-2">Análise Técnica IFTM - ODS 9: Indústria e Inovação</p>
            </div>
            
            {/* SELETOR DE ALUNO RESPONSIVO */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 bg-black p-2 shadow-[4px_4px_0px_0px_rgba(211,47,47,1)] w-full sm:w-auto">
              <div className="flex items-center gap-2 text-white px-2">
                <Search className="w-4 h-4 shrink-0" />
                <span className="font-black uppercase text-[10px] tracking-widest whitespace-nowrap">Atleta:</span>
              </div>
              <select 
                className="bg-white border-2 border-black font-bold text-xs p-1.5 uppercase focus:outline-none w-full sm:w-64 cursor-pointer"
                value={atletaId}
                onChange={(e) => setAtletaId(e.target.value)}
              >
                <option value="todos">Todos os Alunos (Média Geral)</option>
                {atletas.map(a => (
                  <option key={a.id} value={a.id}>{a.nome?.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <Link to={createPageUrl('Atletas')} className="flex-1 lg:flex-none">
              <button className="w-full border-[3px] border-black bg-white px-6 py-3 font-black uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">Atletas</button>
            </Link>
            <Link to={createPageUrl('Pontuacoes')} className="flex-1 lg:flex-none">
              <button className="w-full border-[3px] border-black bg-[#D32F2F] text-white px-6 py-3 font-black uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">Registrar Ação</button>
            </Link>
          </div>
        </div>

        {/* Stats Grid - 1 col (mobile), 2 cols (tablet), 4 cols (desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatsCard title="Atletas no Filtro" value={atletaId === 'todos' ? atletas.length : 1} icon={Users} />
          <StatsCard title="Taxa de Vitória" value={pontosKumite.length > 0 ? `${((vitoriasKumite / pontosKumite.length) * 100).toFixed(0)}%` : '0%'} subtitle={`${vitoriasKumite} vitórias confirmadas`} icon={Zap} />
          <StatsCard title="Qualidade Kata" value={mediaKata} subtitle="Média Técnica" icon={Target} />
          <StatsCard title="Ciclo Eventos" value={eventos.length} icon={Calendar} />
        </div>

        {/* Evolução Grid - Stack em mobile/tablet, 2 cols em desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="w-full overflow-hidden">
            <PerformanceChart 
              data={kataChartData} 
              title={atletaId === 'todos' ? "Média de Evolução do Dojo" : "Evolução Individual (Kata)"} 
              dataKey1="nota_tecnica" 
              dataKey2="nota_atletica" 
              label1="Técnica" 
              label2="Atlética" 
            />
          </div>
          <div className="w-full overflow-hidden">
            <KumiteStatsChart 
              data={kumiteChartData} 
              title="Volume de Golpes por Luta" 
            />
          </div>
        </div>

        {/* Perfil e Mural Grid - Stack em mobile, 3 cols em desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="w-full overflow-hidden md:col-span-1">
            <RadarPerfilChart data={radarData} title="DNA Técnico (Equilíbrio)" />
          </div>
          <div className="w-full overflow-hidden md:col-span-1">
            <ResultadosPieChart vitorias={vitoriasKumite} derrotas={derrotasKumite} empates={empatesKumite} title="Eficácia de Combate" />
          </div>

          <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full md:col-span-2 lg:col-span-1">
            <div className="bg-black text-white p-2 font-black uppercase text-center text-xs tracking-widest border-b-[3px] border-black">Mural de Atividades</div>
            <div className="p-4 space-y-4 overflow-y-auto flex-1 max-h-[300px] lg:max-h-none">
              {eventos.length > 0 ? eventos.slice(0, 5).map(ev => (
                <div key={ev.id} className="border-l-4 border-[#D32F2F] pl-3 py-1 bg-slate-50 transition-transform hover:translate-x-1">
                  <div className="font-black uppercase text-[11px] leading-tight truncate">{ev.nome}</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase">{ev.data ? format(new Date(ev.data), 'dd/MM/yyyy') : 'Sem data'}</div>
                </div>
              )) : (
                <div className="text-center py-10 italic text-slate-400 font-bold uppercase text-[10px]">Nenhuma atividade recente</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}