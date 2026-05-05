import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

const FAIXAS = ['branca', 'amarela', 'vermelha', 'laranja', 'verde', 'roxa', 'marrom', 'preta'];

export default function AtletaForm({ atleta, onSave, onCancel, open }) {
  const [formData, setFormData] = useState({
    id: null,
    nome: '',
    data_nascimento: '',
    sexo: '',
    peso: '',
    faixa: ''
  });

  useEffect(() => {
    if (atleta) {
      setFormData({
        id: atleta.id, // GARANTE O ID PARA A EDIÇÃO
        nome: atleta.nome || '',
        // Corta a data do formato do banco para encaixar certinho no input HTML
        data_nascimento: atleta.data_nascimento ? new Date(atleta.data_nascimento).toISOString().split('T')[0] : '',
        sexo: atleta.sexo || '',
        peso: atleta.peso || '',
        faixa: atleta.faixa || ''
      });
    } else {
      setFormData({ id: null, nome: '', data_nascimento: '', sexo: '', peso: '', faixa: '' });
    }
  }, [atleta, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      peso: formData.peso ? parseFloat(formData.peso) : null
    });
  };

  const labelStyle = "block uppercase font-black text-[10px] mb-1 tracking-tight text-black";
  const inputStyle = "w-full border-[3px] border-black p-2 font-bold text-sm focus:outline-none bg-white shadow-inner";

  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-md border-[4px] border-black bg-[#F3F0E6] p-0 rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader className="bg-black text-white p-4 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="uppercase font-black text-sm tracking-widest">
            {atleta ? 'Editar Atleta' : 'Adicionar Novo Atleta'}
          </DialogTitle>
          <button onClick={onCancel} className="hover:text-red-500"><X className="w-5 h-5" /></button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelStyle}>Nome Completo</label>
            <input
              required
              className={inputStyle}
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value.toUpperCase()})}
              placeholder="EX: PEDRO"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Gênero</label>
              <select 
                className={inputStyle}
                value={formData.sexo}
                onChange={(e) => setFormData({...formData, sexo: e.target.value})}
              >
                <option value="">SELECIONE</option>
                <option value="masculino">MASCULINO</option>
                <option value="feminino">FEMININO</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Faixa</label>
              <select 
                className={inputStyle}
                value={formData.faixa}
                onChange={(e) => setFormData({...formData, faixa: e.target.value})}
              >
                <option value="">SELECIONE</option>
                {FAIXAS.map(f => (
                  <option key={f} value={f}>{f.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Peso (KG)</label>
              <input
                type="number"
                step="0.1"
                className={inputStyle}
                value={formData.peso}
                onChange={(e) => setFormData({...formData, peso: e.target.value})}
                placeholder="90"
              />
            </div>
            <div>
              <label className={labelStyle}>Data Nasc.</label>
              <input
                type="date"
                className={inputStyle}
                value={formData.data_nascimento}
                onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#D32F2F] text-white border-[3px] border-black py-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            {atleta ? 'Salvar Alterações' : 'Salvar Atleta'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}