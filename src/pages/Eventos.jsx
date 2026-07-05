import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import EventoForm from '@/components/forms/EventoForm';
import { ArrowLeft, Calendar, Trophy, MapPin, Edit2, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";

export default function Eventos() {
  const [showForm, setShowForm] = useState(false);
  const [editingEvento, setEditingEvento] = useState(null);

  const queryClient = useQueryClient();

  // BUSCA REAL (O GET costuma funcionar bem no base44Client)
  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => base44.evento.findMany()
  });

  // MUTAÇÃO: CRIAR / EDITAR COM FETCH DIRETO NA API
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const url = data.id 
        ? `https://karate-backend.vercel.app/api/eventos/${data.id}` 
        : 'https://karate-backend.vercel.app/api/eventos';
      const method = data.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detalhe || err.error || "Falha na requisição");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      toast.success(editingEvento ? "Evento atualizado com sucesso!" : "Evento registrado com sucesso!");
      setShowForm(false);
      setEditingEvento(null);
    },
    onError: (err) => toast.error("Erro ao salvar Evento: " + err.message)
  });

  // MUTAÇÃO: APAGAR COM FETCH DIRETO NA API
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`https://karate-backend.vercel.app/api/eventos/${id}`, { 
        method: 'DELETE' 
      });
      if (!response.ok) throw new Error("Erro ao apagar o evento");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      toast.success("Evento apagado com sucesso!");
    },
    onError: (err) => toast.error(err.message)
  });

  const handleSave = (data) => {
    saveMutation.mutate(data);
  };

  const handleEdit = (evento) => {
    setEditingEvento(evento);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Atenção: Deseja realmente apagar este evento? Todos os dados vinculados podem ser afetados.")) {
      deleteMutation.mutate(id);
    }
  };

  // Estilos Neobrutalistas
  const neoCard = "bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-4 md:p-5 transition-all flex flex-col gap-4";
  const neoButton = "border-[3px] border-black px-4 py-3 md:py-2 font-black uppercase text-xs tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all w-full md:w-auto text-center flex justify-center items-center gap-2";

  return (
    <div className="min-h-screen bg-[#F3F0E6] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header Responsivo */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-[4px] border-black pb-6">
          <div className="flex items-start md:items-center gap-4">
            <Link to={createPageUrl('/')} className="shrink-0">
              <button className={`${neoButton} bg-white !w-auto !px-3 !shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-tight">Eventos</h1>
              <p className="font-bold text-slate-600 uppercase text-[10px] mt-1">Gestão de treinos e competições</p>
            </div>
          </div>
          <button 
            onClick={() => { setEditingEvento(null); setShowForm(true); }} 
            className={`${neoButton} bg-[#D32F2F] text-white mt-2 md:mt-0`}
          >
            <Plus className="w-4 h-4" /> Novo Evento
          </button>
        </div>

        {/* Lista de Eventos */}
        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-24 bg-white border-2 border-black animate-pulse" />
            ))}
          </div>
        ) : eventos.length > 0 ? (
          <div className="space-y-6">
            {eventos.map(evento => (
              <div key={evento.id} className={neoCard}>
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  
                  {/* Dados do Evento */}
                  <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-5 w-full">
                    {/* Ícone */}
                    <div className={`w-14 h-14 md:w-16 md:h-16 border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0 ${
                      evento.tipo === 'competicao' ? 'bg-amber-400' : 'bg-blue-400'
                    }`}>
                      {evento.tipo === 'competicao' ? (
                        <Trophy className="w-6 h-6 md:w-8 md:h-8 text-black" />
                      ) : (
                        <Calendar className="w-6 h-6 md:w-8 md:h-8 text-black" />
                      )}
                    </div>
                    
                    {/* Informações */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <h3 className="font-black uppercase text-lg md:text-xl tracking-tight text-black break-words">{evento.nome}</h3>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 border-2 border-black whitespace-nowrap ${
                          evento.tipo === 'competicao' ? 'bg-amber-100' : 'bg-blue-100'
                        }`}>
                          {evento.tipo === 'competicao' ? 'Competição' : 'Treino'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 md:mt-3 text-[10px] md:text-[11px] font-bold uppercase text-slate-600">
                        <span className="flex items-center gap-1.5 shrink-0">
                          <Calendar className="w-3.5 h-3.5" />
                          {evento.data ? format(new Date(evento.data), "dd 'DE' MMMM 'DE' yyyy", { locale: ptBR }) : 'DATA INDEFINIDA'}
                        </span>
                        {evento.local && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{evento.local.toUpperCase()}</span>
                          </span>
                        )}
                      </div>
                      
                      {evento.observacoes && (
                        <div className="mt-3 p-2 bg-[#F3F0E6] border-l-4 border-black text-xs font-medium italic text-slate-700 w-full">
                          "{evento.observacoes}"
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Botões de Ação */}
                  <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 justify-end mt-2 md:mt-0 border-t-2 border-black md:border-0 pt-3 md:pt-0">
                    <button 
                      onClick={() => handleEdit(evento)}
                      className="flex-1 md:flex-none p-2 md:p-3 border-2 border-black bg-white hover:bg-slate-200 transition-colors flex justify-center items-center"
                      title="Editar Evento"
                    >
                      <Edit2 className="w-4 h-4 md:w-5 md:h-5 text-black" />
                    </button>
                    <button 
                      onClick={() => handleDelete(evento.id)}
                      className="flex-1 md:flex-none p-2 md:p-3 border-2 border-black bg-red-100 hover:bg-red-600 hover:text-white transition-colors flex justify-center items-center text-red-600"
                      title="Apagar Evento"
                    >
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 md:py-20 border-[3px] border-dashed border-black bg-white/50 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)] px-4">
            <Calendar className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-20 text-black" />
            <p className="font-black uppercase text-base md:text-lg text-black">Nenhum evento registrado</p>
            <button onClick={() => setShowForm(true)} className="mt-4 font-bold text-red-600 uppercase text-xs hover:underline p-2">
              Cadastrar primeiro evento agora
            </button>
          </div>
        )}

        <EventoForm
          open={showForm}
          evento={editingEvento}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingEvento(null); }}
        />
      </div>
    </div>
  );
}