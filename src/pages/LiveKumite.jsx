import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Play, Pause, RotateCcw, Save, Swords, User, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function LiveKumite() {
  const queryClient = useQueryClient();

  // === DADOS DO BANCO ===
  const { data: atletas = [] } = useQuery({ queryKey: ['atletas'], queryFn: () => base44.atleta.findMany() });
  const { data: eventos = [] } = useQuery({ queryKey: ['eventos'], queryFn: () => base44.evento.findMany() });

  // === ESTADOS DO SETUP DA LUTA ===
  const [isLive, setIsLive] = useState(false);
  const [atletaId, setAtletaId] = useState('');
  const [eventoId, setEventoId] = useState('');
  const [adversarioNome, setAdversarioNome] = useState('');

  // === ESTADOS DA PONTUAÇÃO (NOSSO ATLETA) ===
  const [ippon, setIppon] = useState(0); 
  const [wazaAri, setWazaAri] = useState(0); 
  const [yuko, setYuko] = useState(0); 

  // === ESTADO DA PONTUAÇÃO (ADVERSÁRIO) ===
  // O banco só pede o total, então somamos direto aqui
  const [pontosSofridos, setPontosSofridos] = useState(0);

  // === ESTADOS DO CRONÔMETRO ===
  const [tempoSegundos, setTempoSegundos] = useState(180); 
  const [cronometroRodando, setCronometroRodando] = useState(false);

  // Efeito do Cronômetro
  useEffect(() => {
    let intervalo = null;
    if (cronometroRodando && tempoSegundos > 0) {
      intervalo = setInterval(() => setTempoSegundos(t => t - 1), 1000);
    } else if (tempoSegundos === 0) {
      setCronometroRodando(false);
      if (isLive) toast.info("TEMPO ESGOTADO!");
    }
    return () => clearInterval(intervalo);
  }, [cronometroRodando, tempoSegundos, isLive]);

  // === CÁLCULOS AUTOMÁTICOS ===
  const pontosNossos = (ippon * 3) + (wazaAri * 2) + (yuko * 1);
  const resultadoLuta = pontosNossos > pontosSofridos ? 'vitoria' : pontosNossos < pontosSofridos ? 'derrota' : 'empate';

  // === MUTAÇÃO PARA SALVAR ===
  const saveMutation = useMutation({
    mutationFn: async (dadosLuta) => {
      const response = await fetch('https://karate-backend.vercel.app/api/pontuacoes/kumite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosLuta)
      });
      if (!response.ok) throw new Error("Erro ao salvar luta ao vivo");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pontosKumite'] });
      toast.success("LUTA REGISTRADA COM SUCESSO!");
      resetarLuta();
    },
    onError: (err) => toast.error(err.message)
  });

  // === HANDLERS ===
  const iniciarLuta = (e) => {
    e.preventDefault();
    if (!atletaId || !adversarioNome) {
      return toast.error("Preencha nosso atleta e o adversário!");
    }
    setIsLive(true);
  };

  const finalizarLuta = () => {
    if (window.confirm(`Finalizar luta? Resultado: ${resultadoLuta.toUpperCase()}`)) {
      setCronometroRodando(false);
      saveMutation.mutate({
        atleta_id: atletaId,
        evento_id: eventoId || null,
        data: new Date().toISOString(),
        adversario_nome: adversarioNome,
        ippon,
        waza_ari: wazaAri,
        yuko,
        pontos_sofridos: pontosSofridos,
        pontos_totais: pontosNossos,
        resultado: resultadoLuta,
        observacoes: "Registrado via Modo Ao Vivo"
      });
    }
  };

  const resetarLuta = () => {
    setIsLive(false);
    setIppon(0); setWazaAri(0); setYuko(0); setPontosSofridos(0);
    setTempoSegundos(180); setCronometroRodando(false);
    setAtletaId(''); setAdversarioNome(''); setEventoId('');
  };

  const formatTime = (segundos) => {
    const min = Math.floor(segundos / 60).toString().padStart(2, '0');
    const seg = (segundos % 60).toString().padStart(2, '0');
    return `${min}:${seg}`;
  };

  // === TELA DE SETUP (ANTES DA LUTA) ===
  if (!isLive) {
    return (
      <div className="min-h-screen bg-[#F3F0E6] p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="flex flex-col items-center mb-6 border-b-4 border-black pb-4">
            <Swords className="w-12 h-12 text-[#D32F2F] mb-2" />
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Kumite Ao Vivo</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Configurar Placar Eletrônico</p>
          </div>

          <form onSubmit={iniciarLuta} className="space-y-4">
            <div>
              <label className="block uppercase font-black text-xs mb-1">Nosso Atleta (AO)</label>
              <select 
                required
                className="w-full border-[3px] border-black p-3 font-bold text-sm bg-white uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                value={atletaId} onChange={(e) => setAtletaId(e.target.value)}
              >
                <option value="">Selecione o Atleta</option>
                {atletas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
              </select>
            </div>

            <div>
              <label className="block uppercase font-black text-xs mb-1">Adversário (AKA)</label>
              <input 
                required
                className="w-full border-[3px] border-black p-3 font-bold text-sm bg-white uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                placeholder="NOME OU DOJO DO ADVERSÁRIO"
                value={adversarioNome} onChange={(e) => setAdversarioNome(e.target.value.toUpperCase())}
              />
            </div>

            <div>
              <label className="block uppercase font-black text-xs mb-1">Evento (Opcional)</label>
              <select 
                className="w-full border-[3px] border-black p-3 font-bold text-sm bg-white uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                value={eventoId} onChange={(e) => setEventoId(e.target.value)}
              >
                <option value="">Nenhum Evento</option>
                {eventos.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </select>
            </div>

            <button type="submit" className="w-full bg-[#D32F2F] text-white border-[3px] border-black py-4 mt-4 font-black uppercase text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2">
              <Play className="w-6 h-6 fill-current" /> INICIAR COMBATE
            </button>
          </form>
        </div>
      </div>
    );
  }

  // === TELA DA LUTA (PLACAR AO VIVO) ===
  const atletaNome = atletas.find(a => String(a.id) === String(atletaId))?.nome || 'Atleta';

  return (
    <div className="min-h-screen bg-[#F3F0E6] flex flex-col font-sans">
      
      {/* BARRA SUPERIOR: CRONÔMETRO */}
      <div className="bg-black text-white p-4 border-b-[4px] border-black flex items-center justify-between shadow-[0px_4px_0px_0px_rgba(211,47,47,1)] z-10">
        <div className="flex gap-2">
          <button onClick={() => setCronometroRodando(!cronometroRodando)} className="w-12 h-12 bg-white text-black border-2 border-white flex items-center justify-center hover:bg-slate-200">
            {cronometroRodando ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
          </button>
          <button onClick={() => { setTempoSegundos(180); setCronometroRodando(false); }} className="w-12 h-12 border-2 border-white flex items-center justify-center hover:bg-slate-800">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
        <div className={`text-5xl md:text-6xl font-black tracking-tighter ${tempoSegundos <= 30 ? 'text-[#D32F2F] animate-pulse' : 'text-white'}`}>
          {formatTime(tempoSegundos)}
        </div>
      </div>

      {/* ÁREA CENTRAL: PLACAR DIVIDIDO */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* LADO AZUL (NOSSO ATLETA) */}
        <div className="flex-1 bg-blue-600 border-b-[4px] md:border-b-0 md:border-r-[4px] border-black p-4 flex flex-col relative">
          <div className="bg-white border-[3px] border-black p-2 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-black uppercase text-sm md:text-xl truncate">{atletaNome}</h2>
            <p className="text-[10px] font-bold text-blue-600 uppercase">Nosso Atleta (AO)</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center py-6">
            <span className="text-[120px] md:text-[180px] font-black leading-none text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              {pontosNossos}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => setIppon(i => i + 1)} className="bg-white border-[3px] border-black p-2 md:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex flex-col items-center">
              <span className="font-black text-xl md:text-2xl text-blue-600">+3</span>
              <span className="text-[9px] md:text-xs font-black uppercase">Ippon</span>
            </button>
            <button onClick={() => setWazaAri(w => w + 1)} className="bg-white border-[3px] border-black p-2 md:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex flex-col items-center">
              <span className="font-black text-xl md:text-2xl text-blue-600">+2</span>
              <span className="text-[9px] md:text-xs font-black uppercase">Waza</span>
            </button>
            <button onClick={() => setYuko(y => y + 1)} className="bg-white border-[3px] border-black p-2 md:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex flex-col items-center">
              <span className="font-black text-xl md:text-2xl text-blue-600">+1</span>
              <span className="text-[9px] md:text-xs font-black uppercase">Yuko</span>
            </button>
          </div>
          
          <div className="flex gap-2 mt-2">
            <button onClick={() => setIppon(i => Math.max(0, i - 1))} className="flex-1 bg-black text-white border-2 border-black text-xs font-bold py-1">- Ippon</button>
            <button onClick={() => setWazaAri(w => Math.max(0, w - 1))} className="flex-1 bg-black text-white border-2 border-black text-xs font-bold py-1">- Waza</button>
            <button onClick={() => setYuko(y => Math.max(0, y - 1))} className="flex-1 bg-black text-white border-2 border-black text-xs font-bold py-1">- Yuko</button>
          </div>
        </div>

        {/* LADO VERMELHO (ADVERSÁRIO) */}
        <div className="flex-1 bg-[#D32F2F] p-4 flex flex-col relative">
          <div className="bg-white border-[3px] border-black p-2 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-black uppercase text-sm md:text-xl truncate">{adversarioNome}</h2>
            <p className="text-[10px] font-bold text-[#D32F2F] uppercase">Adversário (AKA)</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center py-6">
            <span className="text-[120px] md:text-[180px] font-black leading-none text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              {pontosSofridos}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => setPontosSofridos(p => p + 3)} className="bg-white border-[3px] border-black p-2 md:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex flex-col items-center">
              <span className="font-black text-xl md:text-2xl text-[#D32F2F]">+3</span>
              <span className="text-[9px] md:text-xs font-black uppercase">Ippon</span>
            </button>
            <button onClick={() => setPontosSofridos(p => p + 2)} className="bg-white border-[3px] border-black p-2 md:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex flex-col items-center">
              <span className="font-black text-xl md:text-2xl text-[#D32F2F]">+2</span>
              <span className="text-[9px] md:text-xs font-black uppercase">Waza</span>
            </button>
            <button onClick={() => setPontosSofridos(p => p + 1)} className="bg-white border-[3px] border-black p-2 md:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex flex-col items-center">
              <span className="font-black text-xl md:text-2xl text-[#D32F2F]">+1</span>
              <span className="text-[9px] md:text-xs font-black uppercase">Yuko</span>
            </button>
          </div>
          
          <div className="flex gap-2 mt-2">
            <button onClick={() => setPontosSofridos(p => Math.max(0, p - 3))} className="flex-1 bg-black text-white border-2 border-black text-xs font-bold py-1">- Ippon</button>
            <button onClick={() => setPontosSofridos(p => Math.max(0, p - 2))} className="flex-1 bg-black text-white border-2 border-black text-xs font-bold py-1">- Waza</button>
            <button onClick={() => setPontosSofridos(p => Math.max(0, p - 1))} className="flex-1 bg-black text-white border-2 border-black text-xs font-bold py-1">- Yuko</button>
          </div>
        </div>

      </div>

      {/* RODAPÉ: AÇÕES FINAIS */}
      <div className="bg-white border-t-[4px] border-black p-4 flex gap-4 shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)] z-10">
        <button onClick={resetarLuta} className="flex-1 border-[3px] border-black bg-slate-200 text-black font-black uppercase text-sm py-4 active:bg-slate-300">
          Cancelar
        </button>
        <button 
          onClick={finalizarLuta} 
          className="flex-[2] border-[3px] border-black bg-[#D32F2F] text-white font-black uppercase text-sm py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> FINALIZAR LUTA
        </button>
      </div>

    </div>
  );
}