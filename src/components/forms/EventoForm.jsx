import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function EventoForm({ evento, onSave, onCancel, open }) {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'treino',
    data: new Date().toISOString().split('T')[0],
    local: '',
    observacoes: ''
  });

  // Atualiza o form quando for abrir para edição
  useEffect(() => {
    if (evento) setFormData(evento);
    else setFormData({
      nome: '',
      tipo: 'treino',
      data: new Date().toISOString().split('T')[0],
      local: '',
      observacoes: ''
    });
  }, [evento, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Estilos Neobrutalistas baseados no protótipo do IFTM
  const labelStyle = "block uppercase font-black text-[10px] mb-1 tracking-tight text-black";
  const inputStyle = "w-full border-[3px] border-black p-2 font-bold text-sm focus:outline-none bg-white shadow-inner rounded-none";

  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-md border-[4px] border-black bg-[#F3F0E6] p-0 rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        {/* Header no estilo "Barra Preta" do PDF */}
        <DialogHeader className="bg-black text-white p-4 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="uppercase font-black text-sm tracking-widest">
            {evento ? 'Editar Evento' : 'Novo Evento / Treino'}
          </DialogTitle>
          <button onClick={onCancel} className="hover:text-red-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelStyle}>Nome do Evento *</label>
            <input
              required
              className={inputStyle}
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value.toUpperCase()})}
              placeholder="EX: CAMPEONATO ESTADUAL"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Tipo de Evento *</label>
              <select 
                className={inputStyle}
                value={formData.tipo} 
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              >
                <option value="treino">TREINO</option>
                <option value="competicao">COMPETIÇÃO</option>
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

          <div>
            <label className={labelStyle}>Local</label>
            <input
              className={inputStyle}
              value={formData.local}
              onChange={(e) => setFormData({...formData, local: e.target.value.toUpperCase()})}
              placeholder="EX: GINÁSIO MUNICIPAL"
            />
          </div>

          <div>
            <label className={labelStyle}>Observações Adicionais</label>
            <textarea
              className={`${inputStyle} h-24 resize-none`}
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              placeholder="DETALHES SOBRE REQUISITOS OU EQUIPAMENTOS..."
            />
          </div>

          {/* Botão de Ação Vermelho Oficial do Projeto IFTM */}
          <button 
            type="submit" 
            className="w-full bg-[#D32F2F] text-white border-[3px] border-black py-4 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            Gravar Evento no Banco
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}