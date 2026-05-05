import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import KumiteStatsChart from '../components/dashboard/KumiteStatsChart';
import ResultadosPieChart from '../components/dashboard/ResultadosPieChart';
import StatsCard from '../components/dashboard/StatsCard';
import RadarPerfilChart from '../components/dashboard/RadarPerfilChart'; // Importe o novo gráfico
import { ArrowLeft, User, Swords, Target, Trophy, TrendingUp, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';

const faixaColors = {
  branca: "bg-white text-black",
  amarela: "bg-yellow-400 text-black",
  vermelha: "bg-red-600 text-white",
  laranja: "bg-orange-500 text-white",
  verde: "bg-green-600 text-white",
  roxa: "bg-purple-600 text-white",
  marrom: "bg-amber-900 text-white",
  preta: "bg-black text-white"
};

export default function AtletaDetalhes() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const atletaId = urlParams.get('id');

  const { data: atleta, isLoading: loadingAtleta } = useQuery({
    queryKey: ['atleta', atletaId],
    queryFn: () => base44.atleta.findOne(atletaId),
    enabled: !!atletaId
  });

  const { data: todosPontosKata = [] } = useQuery({
    queryKey: ['pontosKata'],
    queryFn: () => base44.pontuacaoKata.findMany()
  });

  const { data: todosPontosKumite = [] } = useQuery({
    queryKey: ['pontosKumite'],
    queryFn: () => base44.pontuacaoKumite.findMany()
  });

  const pontosKata = todosPontosKata.filter(p => String(p.atleta_id) === String(atletaId));
  const pontosKumite = todosPontosKumite.filter(p => String(p.atleta_id) === String(atletaId));

  if (loadingAtleta || !atleta) {
    return (
      <div className="min-h-screen bg-[#F3F0E6] flex items-center justify-center">
        <div className="font-black uppercase italic animate-pulse">Carregando Perfil Técnico...</div>
      </div>
    );
  }

  // --- CÁLCULOS PARA OS NOVOS GRÁFICOS ---

  // 1. Dados para o Radar (Média de performance por categoria)
  const radarData = [
    { subject: 'IPPON', A: pontosKumite.reduce((acc, p) => acc + (p.ippon || 0), 0) },
    { subject: 'WAZA-ARI', A: pontosKumite.reduce((acc, p) => acc + (p.waza_ari || 0), 0) },
    { subject: 'YUKO', A: pontosKumite.reduce((acc, p) => acc + (p.yuko || 0), 0) },
    { subject: 'DEFESA', A: pontosKumite.length > 0 ? Math.max(0, 10 - (pontosKumite.reduce((acc, p) => acc + (p.pontos_sofridos || 0), 0) / pontosKumite.length)) : 0 },
  ];

  // 2. Ranking de Katas (Agrupamento por nome)
  const kataPorNome = pontosKata.reduce((acc, item) => {
    const nome = item.nome_kata || 'GERAL';
    if (!acc[nome]) acc[nome] = { nome, total: 0, qtd: 0 };
    acc[nome].total += (parseFloat(item.nota_final) || 0);
    acc[nome].qtd += 1;
    return acc;
  }, {});

  const kataRankData = Object.values(kataPorNome).map(k => ({
    nome: k.nome,
    media: (k.total / k.qtd).toFixed(2)
  })).sort((a, b) => b.media - a.media);

  // --- RESTO DOS DADOS EXISTENTES ---
  const vitoriasKumite = pontosKumite.filter(p => p.resultado === 'vitoria').length;
  const derrotasKumite = pontosKumite.filter(p => p.resultado === 'derrota').length;
  const empatesKumite = pontosKumite.filter(p => p.resultado === 'empate').length;

  const mediaKata = pontosKata.length > 0 
    ? (pontosKata.reduce((acc, p) => acc + (parseFloat(p.nota_final) || 0), 0) / pontosKata.length).toFixed(2)
    : '0.00';

  const totalPontosKumite = pontosKumite.reduce((acc, p) => acc + (p.pontos_totais || 0), 0);

  const kataChartData = pontosKata.slice(-10).map(p => ({
    data: format(new Date(p.data), 'dd/MM'),
    nota_tecnica: p.nota_tecnica || 0,
    nota_atletica: p.nota_atletica || 0
  }));

  const kumiteChartData = pontosKumite.slice(-10).map(p => ({
    data: format(new Date(p.data), 'dd/MM'),
    ippon: p.ippon || 0,
    waza_ari: p.waza_ari || 0,
    yuko: p.yuko || 0
  }));

  const neoButton = "border-[3px] border-black px-4 py-2 font-black uppercase text-xs tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all bg-white hover:bg-slate-50";

  return (
    <div className="min-h-screen bg-[#F3F0E6] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Profissional */}
        <div className="flex items-center gap-6 border-b-[4px] border-black pb-6">
          <Link to={createPageUrl('/Atletas')}>
            <button className={neoButton}>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Ficha Técnica do Atleta</h1>
            <p className="font-bold text-slate-600 uppercase text-[10px]">Análise detalhada de performance [ODS 9]</p>
          </div>
        </div>

        {/* Card de Identidade */}
        <div className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-28 h-28 bg-[#F3F0E6] border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
              <User className="w-16 h-16 text-black" />
            </div>
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-4xl font-black uppercase tracking-tight">{atleta.nome}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className={`text-xs font-black uppercase px-3 py-1 border-[3px] border-black ${faixaColors[atleta.faixa?.toLowerCase()] || 'bg-slate-500'}`}>
                  FAIXA {atleta.faixa}
                </span>
                <span className="font-black uppercase text-xs text-slate-600 italic">GÊNERO: {atleta.sexo}</span>
                {atleta.peso && <span className="font-black uppercase text-xs text-slate-600">PESO: {atleta.peso} KG</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Stats em Blocos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Combates" value={pontosKumite.length} subtitle={`${vitoriasKumite} vitórias`} icon={Swords} />
          <StatsCard title="Avaliações Kata" value={pontosKata.length} subtitle={`Média: ${mediaKata}`} icon={Target} />
          <StatsCard title="Pontos Marcados" value={totalPontosKumite} icon={TrendingUp} />
          <StatsCard title="Eficácia" value={pontosKumite.length > 0 ? `${((vitoriasKumite / pontosKumite.length) * 100).toFixed(0)}%` : '0%'} icon={Trophy} />
        </div>

        {/* SEÇÃO DE ANÁLISE PROFUNDA (NOVOS GRÁFICOS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RadarPerfilChart data={radarData} title="DNA do Lutador (Equilíbrio Técnico)" />

            <div className="bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                <div className="bg-black text-white p-2 font-black uppercase text-center text-xs tracking-widest border-b-[3px] border-black">
                    Ranking por Kata (Média de Notas)
                </div>
                <div className="p-6 bg-[#F3F0E6] space-y-5 flex-1 overflow-y-auto max-h-[350px]">
                    {kataRankData.length > 0 ? kataRankData.map(k => (
                        <div key={k.nome} className="flex flex-col gap-1">
                            <div className="flex justify-between font-black text-[10px] uppercase text-black">
                                <span>{k.nome}</span>
                                <span>{k.media} / 10.0</span>
                            </div>
                            <div className="h-4 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <div 
                                    className="h-full bg-[#D32F2F] transition-all duration-500" 
                                    style={{ width: `${(parseFloat(k.media) / 10) * 100}%` }}
                                />
                            </div>
                        </div>
                    )) : (
                        <div className="h-full flex items-center justify-center italic text-slate-400 font-bold uppercase text-xs">Sem dados de Ranking</div>
                    )}
                </div>
            </div>
        </div>

        {/* Área de Gráficos Analíticos de Histórico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResultadosPieChart vitorias={vitoriasKumite} derrotas={derrotasKumite} empates={empatesKumite} title="Distribuição de Resultados (Kumite)" />
          {kataChartData.length > 0 ? (
            <PerformanceChart data={kataChartData} title="Evolução Técnica (Kata)" dataKey1="nota_tecnica" dataKey2="nota_atletica" label1="Técnica" label2="Atlética" />
          ) : (
            <div className="bg-white border-[3px] border-black p-8 flex flex-col items-center justify-center opacity-50 italic uppercase font-bold text-slate-400">
               <Target className="w-12 h-12 mb-2" />
               Sem histórico de Kata para este atleta
            </div>
          )}
        </div>

        {kumiteChartData.length > 0 && (
          <div className="mt-8">
            <KumiteStatsChart data={kumiteChartData} title="Histórico de Pontuação (Ippon/Waza/Yuko)" />
          </div>
        )}
      </div>
    </div>
  );
}