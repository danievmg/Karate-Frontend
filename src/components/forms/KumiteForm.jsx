import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function KumiteForm({ atletas, eventos, onSave, onCancel, open, initialData }) {
  const [formData, setFormData] = useState({
    id: null,
    atleta_id: '',
    atleta_nome: '',
    evento_id: '',
    evento_nome: '',
    tipo_evento: 'treino',
    data: new Date().toISOString().split('T')[0],
    adversario_nome: '',
    ippon: 0,
    waza_ari: 0,
    yuko: 0,
    pontos_sofridos: 0,
    resultado: 'vitoria',
    observacoes: ''
  });

  // CARREGA OS DADOS SE ESTIVER EDITANDO
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        atleta_id: initialData.atleta_id || '',
        atleta_nome: initialData.atleta?.nome || '',
        evento_id: initialData.evento_id || '',
        evento_nome: initialData.evento?.nome || '',
        tipo_evento: initialData.evento?.tipo || 'treino',
        data: initialData.data ? new Date(initialData.data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        adversario_nome: initialData.adversario_nome || '',
        ippon: initialData.ippon || 0,
        waza_ari: initialData.waza_ari || 0,
        yuko: initialData.yuko || 0,
        pontos_sofridos: initialData.pontos_sofridos || 0,
        resultado: initialData.resultado || 'vitoria',
        observacoes: initialData.observacoes || ''
      });
    } else {
      setFormData({
        id: null,
        atleta_id: '',
        atleta_nome: '',
        evento_id: '',
        evento_nome: '',
        tipo_evento: 'treino',
        data: new Date().toISOString().split('T')[0],
        adversario_nome: '',
        ippon: 0,
        waza_ari: 0,
        yuko: 0,
        pontos_sofridos: 0,
        resultado: 'vitoria',
        observacoes: ''
      });
    }
  }, [initialData, open]);

  const handleAtletaChange = (atletaId) => {
    const atleta = atletas.find(a => String(a.id) === String(atletaId));
    setFormData({...formData, atleta_id: atletaId, atleta_nome: atleta?.nome || ''});
  };

  const handleEventoChange = (eventoId) => {
    const evento = eventos.find(e => String(e.id) === String(eventoId));
    if (evento) {
      setFormData({
        ...formData, 
        evento_id: eventoId, 
        evento_nome: evento.nome,
        tipo_evento: evento.tipo,
        data: evento.data ? new Date(evento.data).toISOString().split('T')[0] : formData.data
      });
    } else {
        setFormData({...formData, evento_id: '', evento_nome: ''});
    }
  };

  const calcularPontos = () => {
    return (formData.ippon * 3) + (formData.waza_ari * 2) + formData.yuko;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      pontos_totais: calcularPontos()
    });
  };

  const labelStyle = "block uppercase font-black text-[10px] mb-1 tracking-tight text-black";
  const inputStyle = "w-full border-[3px] border-black p-2 font-bold text-sm focus:outline-none bg-white shadow-inner rounded-none";

  const Counter = ({ label, value, onChange, points }) => (
    <div className="flex items-center justify-between p-3 border-[3px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-3">
      <div>
        <p className="font-black uppercase text-xs">{label}</p>
        <p className="text-[9px] font-bold text-slate-500">+{points} PONTO{points > 1 ? 'S' : ''}</p>
      </div>
      <div className="flex items-center gap-4">
        <button 
          type="button" 
          onClick={() => onChange(Math.max(0, value - 1))} 
          className="w-10 h-10 border-[3px] border-black font-black bg-[#F3F0E6] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
        >
          -
        </button>
        <span className="font-black text-2xl w-6 text-center">{value}</span>
        <button 
          type="button" 
          onClick={() => onChange(value + 1)} 
          className="w-10 h-10 border-[3px] border-black font-black bg-[#F3F0E6] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-lg border-[4px] border-black bg-[#F3F0E6] p-0 rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-black text-white p-4 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="uppercase font-black text-sm tracking-widest">
            {initialData ? 'Editar Combate' : 'Coleta de Dados - Kumite'}
          </DialogTitle>
          <button onClick={onCancel} className="hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelStyle}>Atleta Selecionado *</label>
            <select className={inputStyle} value={formData.atleta_id} onChange={(e) => handleAtletaChange(e.target.value)} required>
              <option value="">SELECIONE O ATLETA</option>
              {atletas.map(a => <option key={a.id} value={a.id}>{a.nome?.toUpperCase()}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Evento</label>
              <select className={inputStyle} value={formData.evento_id} onChange={(e) => handleEventoChange(e.target.value)}>
                <option value="">EVENTO TREINO (SEM VÍNCULO)</option>
                {eventos.map(e => <option key={e.id} value={e.id}>{e.nome?.toUpperCase()}</option>)}
              </select>
            </div>
            <div>
              <label className={labelStyle}>Data do Combate *</label>
              <input type="date" className={inputStyle} value={formData.data} onChange={(e) => setFormData({...formData, data: e.target.value})} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b-2 border-black pb-4">
            <div>
              <label className={labelStyle}>Tipo</label>
              <select className={inputStyle} value={formData.tipo_evento} onChange={(e) => setFormData({...formData, tipo_evento: e.target.value})}>
                <option value="treino">TREINO</option>
                <option value="competicao">COMPETIÇÃO</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Adversário</label>
              <input className={inputStyle} value={formData.adversario_nome} onChange={(e) => setFormData({...formData, adversario_nome: e.target.value.toUpperCase()})} placeholder="EX: RIVAL" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="uppercase font-black text-xs text-black border-l-4 border-black pl-2 mb-2">Pontos Marcados</label>
            <Counter label="Ippon" value={formData.ippon} onChange={(v) => setFormData({...formData, ippon: v})} points={3} />
            <Counter label="Waza-ari" value={formData.waza_ari} onChange={(v) => setFormData({...formData, waza_ari: v})} points={2} />
            <Counter label="Yuko" value={formData.yuko} onChange={(v) => setFormData({...formData, yuko: v})} points={1} />
            
            <div className="flex justify-between items-center p-4 bg-black text-white shadow-[4px_4px_0px_0px_rgba(211,47,47,1)]">
              <span className="font-black uppercase text-sm italic">Total de Pontos</span>
              <span className="text-3xl font-black">{calcularPontos()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className={labelStyle}>Pontos Sofridos</label>
              <input type="number" className={inputStyle} value={formData.pontos_sofridos} onChange={(e) => setFormData({...formData, pontos_sofridos: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className={labelStyle}>Resultado Final</label>
              <select className={inputStyle} value={formData.resultado} onChange={(e) => setFormData({...formData, resultado: e.target.value})}>
                <option value="vitoria">VITÓRIA</option>
                <option value="derrota">DERROTA</option>
                <option value="empate">EMPATE</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#D32F2F] text-white border-[3px] border-black py-4 font-black uppercase text-sm shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
            {initialData ? 'Salvar Alterações' : 'Finalizar Combate'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}