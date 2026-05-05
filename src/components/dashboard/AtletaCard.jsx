import React from 'react';
import { User, Edit2, Trash2 } from 'lucide-react';

export default function AtletaCard({ atleta, onEdit, onDelete }) {
  // Cores das faixas baseadas na tradição Shotokan
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

  return (
    <div className="bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col sm:flex-row items-center gap-4 transition-all mb-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
      
      {/* Avatar em bloco Neobrutalista */}
      <div className="w-14 h-14 bg-[#F3F0E6] border-[3px] border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <User className="w-8 h-8 text-black" />
      </div>

      <div className="flex-1 w-full min-w-0 text-center sm:text-left">
        {/* Nome em destaque */}
        <div className="font-black uppercase text-base tracking-tight truncate text-black">
          {atleta.nome}
        </div>
        
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
          {/* Badge da Faixa */}
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black leading-none ${faixaColors[atleta.faixa?.toLowerCase()] || 'bg-slate-200'}`}>
            {atleta.faixa}
          </span>
          
          {/* Info secundária técnica */}
          <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">
            {atleta.sexo} {atleta.peso ? `| ${atleta.peso} KG` : ''}
          </span>
        </div>
      </div>

      {/* Botões de Ação (Editar / Apagar) */}
      <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto shrink-0 justify-end mt-3 sm:mt-0 border-t-2 border-black sm:border-0 pt-3 sm:pt-0">
        <button 
          onClick={() => onEdit && onEdit(atleta)}
          className="flex-1 sm:flex-none p-2 border-2 border-black bg-white hover:bg-slate-200 transition-colors flex justify-center items-center"
          title="Editar Atleta"
        >
          <Edit2 className="w-4 h-4 text-black" />
        </button>
        <button 
          onClick={() => onDelete && onDelete(atleta.id)}
          className="flex-1 sm:flex-none p-2 border-2 border-black bg-red-100 hover:bg-red-600 hover:text-white transition-colors flex justify-center items-center text-red-600"
          title="Apagar Atleta"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
    </div>
  );
}