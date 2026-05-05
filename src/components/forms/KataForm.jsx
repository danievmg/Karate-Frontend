import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function KataForm({ atletas, eventos, onSave, onCancel, open, initialData }) {
  const [formData, setFormData] = useState({
    id: null,
    atleta_id: '',
    atleta_nome: '',
    evento_id: '',
    evento_nome: '',
    tipo_evento: 'treino',
    data: new Date().toISOString().split('T')[0],
    nome_kata: '',
    nota_tecnica: '',
    nota_atletica: '',
    resultado: 'sem_resultado',
    observacoes: ''
  });

  // O PULO DO GATO: Carrega os dados se for edição, ou limpa se for novo
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id, // VITAL PARA EDITAR
        atleta_id: initialData.atleta_id || '',
        atleta_nome: initialData.atleta?.nome || '',
        evento_id: initialData.evento_id || '',
        evento_nome: initialData.evento?.nome || '',
        tipo_evento: initialData.evento?.tipo || 'treino',
        // Formata a data para o input date (YYYY-MM-DD)
        data: initialData.data ? new Date(initialData.data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        nome_kata: initialData.nome_kata || '',
        nota_tecnica: initialData.nota_tecnica || '',
        nota_atletica: initialData.nota_atletica || '',
        resultado: initialData.resultado || 'sem_resultado',
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
        nome_kata: '',
        nota_tecnica: '',
        nota_atletica: '',
        resultado: 'sem_resultado',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const notaTecnica = parseFloat(formData.nota_tecnica);
    const notaAtletica = parseFloat(formData.nota_atletica);
    onSave({
      ...formData,
      nota_tecnica: notaTecnica,
      nota_atletica: notaAtletica,
      nota_final: ((notaTecnica + notaAtletica) / 2).toFixed(2)
    });
  };

  const labelStyle = "block uppercase font-black text-[10px] mb-1 tracking-tight text-black";
  const inputStyle = "w-full border-[3px] border-black p-2 font-bold text-sm focus:outline-none bg-white shadow-inner rounded-none";

  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-lg border-[4px] border-black bg-[#F3F0E6] p-0 rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-black text-white p-4 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="uppercase font-black text-sm tracking-widest">
            {initialData ? 'Editar Avaliação de Kata' : 'Nova Avaliação de Kata'}
          </DialogTitle>
          <button onClick={onCancel} className="hover:text-red-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelStyle}>Atleta</label>
            <select 
              required
              className={inputStyle}
              value={formData.atleta_id} 
              onChange={(e) => handleAtletaChange(e.target.value)}
            >
              <option value="">SELECIONE O ATLETA</option>
              {atletas.map(a => (
                <option key={a.id} value={a.id}>{a.nome?.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Evento</label>
              <select 
                className={inputStyle}
                value={formData.evento_id} 
                onChange={(e) => handleEventoChange(e.target.value)}
              >
                <option value="">EVENTO TREINO (SEM VÍNCULO)</option>
                {eventos.map(e => (
                  <option key={e.id} value={e.id}>{e.nome?.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelStyle}>Data *</label>
              <input
                type="date"
                required
                className={inputStyle}
                value={formData.data}
                onChange={(e) => setFormData({...formData, data: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Tipo</label>
              <select className={inputStyle} value={formData.tipo_evento} onChange={(v) => setFormData({...formData, tipo_evento: v.target.value})}>
                <option value="treino">TREINO</option>
                <option value="competicao">COMPETIÇÃO</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Nome do Kata</label>
              <input
                className={inputStyle}
                value={formData.nome_kata}
                onChange={(e) => setFormData({...formData, nome_kata: e.target.value.toUpperCase()})}
                placeholder="EX: BASSAI DAI"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <label className={labelStyle}>Nota Técnica (5.0-10.0)</label>
              <input
                type="number"
                required
                min="5"
                max="10"
                step="0.1"
                className={inputStyle}
                value={formData.nota_tecnica}
                onChange={(e) => setFormData({...formData, nota_tecnica: e.target.value})}
                placeholder="0.0"
              />
            </div>
            <div>
              <label className={labelStyle}>Nota Atlética (5.0-10.0)</label>
              <input
                type="number"
                required
                min="5"
                max="10"
                step="0.1"
                className={inputStyle}
                value={formData.nota_atletica}
                onChange={(e) => setFormData({...formData, nota_atletica: e.target.value})}
                placeholder="0.0"
              />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Resultado</label>
            <select className={inputStyle} value={formData.resultado} onChange={(e) => setFormData({...formData, resultado: e.target.value})}>
              <option value="sem_resultado">SEM RESULTADO DEFINIDO</option>
              <option value="vitoria">VITÓRIA</option>
              <option value="derrota">DERROTA</option>
              <option value="empate">EMPATE</option>
            </select>
          </div>

          <div>
            <label className={labelStyle}>Observações</label>
            <textarea
              className={`${inputStyle} h-20 resize-none`}
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              placeholder="PONTOS TÉCNICOS A MELHORAR..."
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#D32F2F] text-white border-[3px] border-black py-4 font-black uppercase text-sm shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            {initialData ? 'Salvar Alterações' : 'Registrar Avaliação'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}