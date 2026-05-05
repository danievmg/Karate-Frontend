import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import KataForm from '@/components/forms/KataForm';
import KumiteForm from '@/components/forms/KumiteForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Target, Swords, Calendar, Edit, Trash2, CheckCircle, XCircle, MinusCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from "sonner";

export default function Pontuacoes() {
  const [showKataForm, setShowKataForm] = useState(false);
  const [showKumiteForm, setShowKumiteForm] = useState(false);
  const [editingKata, setEditingKata] = useState(null);
  const [editingKumite, setEditingKumite] = useState(null);
  const [filtroAtleta, setFiltroAtleta] = useState('todos');

  const queryClient = useQueryClient();

  // BUSCAS (Mantemos o base44Client aqui porque o GET está funcionando bem)
  const { data: atletas = [] } = useQuery({ queryKey: ['atletas'], queryFn: () => base44.atleta.findMany() });
  const { data: eventos = [] } = useQuery({ queryKey: ['eventos'], queryFn: () => base44.evento.findMany() });
  const { data: pontosKata = [] } = useQuery({ queryKey: ['pontosKata'], queryFn: () => base44.pontuacaoKata.findMany() });
  const { data: pontosKumite = [] } = useQuery({ queryKey: ['pontosKumite'], queryFn: () => base44.pontuacaoKumite.findMany() });

  // ==========================================
  // --- MUTAÇÕES (SALVAR / EDITAR) VIA FETCH DIRETO ---
  // ==========================================
  
  const saveKataMutation = useMutation({
    mutationFn: async (data) => {
      const url = data.id 
        ? `http://localhost:3000/api/pontuacoes/kata/${data.id}` 
        : 'http://localhost:3000/api/pontuacoes/kata';
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
      queryClient.invalidateQueries({ queryKey: ['pontosKata'] });
      toast.success(editingKata ? "Avaliação atualizada!" : "Nova avaliação salva!");
      setShowKataForm(false);
      setEditingKata(null);
    },
    onError: (err) => toast.error("Erro ao salvar Kata: " + err.message)
  });

  const saveKumiteMutation = useMutation({
    mutationFn: async (data) => {
      const url = data.id 
        ? `http://localhost:3000/api/pontuacoes/kumite/${data.id}` 
        : 'http://localhost:3000/api/pontuacoes/kumite';
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
      queryClient.invalidateQueries({ queryKey: ['pontosKumite'] });
      toast.success(editingKumite ? "Combate atualizado!" : "Combate registrado!");
      setShowKumiteForm(false);
      setEditingKumite(null);
    },
    onError: (err) => toast.error("Erro ao salvar Kumite: " + err.message)
  });

  // ==========================================
  // --- MUTAÇÕES DE EXCLUSÃO VIA FETCH DIRETO ---
  // ==========================================
  
  const deleteKataMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`http://localhost:3000/api/pontuacoes/kata/${id}`, { 
        method: 'DELETE' 
      });
      if (!response.ok) throw new Error("Erro ao apagar");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pontosKata'] });
      toast.success("Avaliação excluída!");
    }
  });

  const deleteKumiteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`http://localhost:3000/api/pontuacoes/kumite/${id}`, { 
        method: 'DELETE' 
      });
      if (!response.ok) throw new Error("Erro ao apagar");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pontosKumite'] });
      toast.success("Combate removido!");
    }
  });

  // FILTROS
  const filteredKata = pontosKata.filter(p => filtroAtleta === 'todos' || String(p.atleta_id) === String(filtroAtleta));
  const filteredKumite = pontosKumite.filter(p => filtroAtleta === 'todos' || String(p.atleta_id) === String(filtroAtleta));

  // HANDLERS
  const handleDeleteKata = (id) => { if (window.confirm("Apagar avaliação de Kata?")) deleteKataMutation.mutate(id); };
  const handleDeleteKumite = (id) => { if (window.confirm("Apagar registro de Kumite?")) deleteKumiteMutation.mutate(id); };

  // ESTILOS
  const neoCard = "bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-4 md:p-5 transition-all flex flex-col gap-4";
  const neoButton = "border-[3px] border-black px-4 py-3 md:py-2 font-black uppercase text-xs tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all w-full md:w-auto text-center flex justify-center items-center gap-2";

  const renderResultado = (resultado) => {
    if (resultado === 'vitoria') return <span className="bg-emerald-500 text-white px-2 py-1 border-2 border-black text-[10px] font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><CheckCircle className="w-3 h-3"/> Vitória</span>;
    if (resultado === 'derrota') return <span className="bg-red-500 text-white px-2 py-1 border-2 border-black text-[10px] font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><XCircle className="w-3 h-3"/> Derrota</span>;
    if (resultado === 'empate') return <span className="bg-amber-400 text-black px-2 py-1 border-2 border-black text-[10px] font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><MinusCircle className="w-3 h-3"/> Empate</span>;
    return <span className="bg-slate-200 text-black px-2 py-1 border-2 border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Sem Definição</span>;
  };

  return (
    <div className="min-h-screen bg-[#F3F0E6] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-[4px] border-black pb-6">
          <div className="flex items-start md:items-center gap-4">
            <Link to={createPageUrl('Dashboard')} className="shrink-0">
              <button className={`${neoButton} bg-white !w-auto !px-3 !shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-tight">Histórico de Performance</h1>
              <p className="font-bold text-slate-600 uppercase text-[10px] mt-1">Gestão Técnica Karatê IFTM</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-2 md:mt-0">
            <button onClick={() => { setEditingKata(null); setShowKataForm(true); }} className={`${neoButton} bg-white`}>
              + Add Kata
            </button>
            <button onClick={() => { setEditingKumite(null); setShowKumiteForm(true); }} className={`${neoButton} bg-[#D32F2F] text-white`}>
              + Add Kumite
            </button>
          </div>
        </div>

        {/* Filtro */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-black p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(211,47,47,1)]">
           <span className="text-white font-black uppercase text-[10px] tracking-widest px-1">Atleta:</span>
           <select 
             className="bg-white border-2 border-black font-bold text-xs p-2 uppercase w-full sm:w-auto flex-1"
             value={filtroAtleta} 
             onChange={(e) => setFiltroAtleta(e.target.value)}
           >
             <option value="todos">TODOS OS ATLETAS</option>
             {atletas.map(a => <option key={a.id} value={a.id}>{a.nome?.toUpperCase()}</option>)}
           </select>
        </div>

        <Tabs defaultValue="kata" className="w-full">
          <TabsList className="bg-transparent h-auto p-0 gap-2 md:gap-4 mb-6 flex-wrap">
            <TabsTrigger value="kata" className="flex-1 md:flex-none data-[state=active]:bg-black data-[state=active]:text-white border-[3px] border-black px-4 py-3 md:py-2 font-black uppercase text-xs">
              Katas ({filteredKata.length})
            </TabsTrigger>
            <TabsTrigger value="kumite" className="flex-1 md:flex-none data-[state=active]:bg-black data-[state=active]:text-white border-[3px] border-black px-4 py-3 md:py-2 font-black uppercase text-xs">
              Kumites ({filteredKumite.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kata" className="space-y-4">
            {filteredKata.map(p => (
              <div key={p.id} className={neoCard}>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#F3F0E6] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                      <Target className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <div className="font-black uppercase text-sm">{p.atleta?.nome || p.atleta_nome || 'Atleta'}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3" /> {format(new Date(p.data), "dd/MM/yyyy")} 
                        <span>|</span> {p.nome_kata || 'KATA GERAL'}
                      </div>
                      <div className="mt-2">{renderResultado(p.resultado)}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 md:gap-8 bg-slate-50 md:bg-transparent p-3 md:p-0 border-2 border-black md:border-0 md:border-l-2 pl-0 md:pl-8 justify-center">
                    <div className="text-center">
                      <p className="text-[9px] font-black uppercase text-slate-500">Técnica</p>
                      <p className="text-xl font-black">{p.nota_tecnica}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black uppercase text-slate-500">Atlética</p>
                      <p className="text-xl font-black">{p.nota_atletica}</p>
                    </div>
                    <div className="text-center bg-black text-white px-4 py-2 shadow-[3px_3px_0px_0px_rgba(211,47,47,1)]">
                      <p className="text-[9px] font-black uppercase text-slate-300">Final</p>
                      <p className="text-2xl font-black">{p.nota_final}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-t-2 border-black pt-4 mt-2">
                  <div className="text-xs font-bold uppercase text-slate-600 flex-1">
                    {p.observacoes && <span className="flex gap-2"><MessageSquare className="w-4 h-4"/> {p.observacoes}</span>}
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => { setEditingKata(p); setShowKataForm(true); }} className="flex-1 p-2 border-2 border-black bg-white hover:bg-slate-200"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteKata(p.id)} className="flex-1 p-2 border-2 border-black bg-red-100 hover:bg-red-500 hover:text-white text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="kumite" className="space-y-4">
            {filteredKumite.map(p => (
              <div key={p.id} className={neoCard}>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                      <Swords className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-black uppercase text-sm">
                        {p.atleta?.nome || p.atleta_nome} <span className="text-slate-400">VS</span> {p.adversario_nome?.toUpperCase() || 'ADVERSÁRIO'}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3" /> {format(new Date(p.data), "dd/MM/yyyy")}
                      </div>
                      <div className="mt-2">{renderResultado(p.resultado)}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center sm:items-end gap-2">
                    <div className="flex gap-2">
                       <span className="px-2 py-1 border-2 border-black text-[9px] font-black bg-blue-100">{p.ippon} IPPON</span>
                       <span className="px-2 py-1 border-2 border-black text-[9px] font-black bg-green-100">{p.waza_ari} WAZA</span>
                    </div>
                    <div className="flex gap-2">
                       <div className="bg-slate-200 p-2 border-2 border-black text-center min-w-[60px]">
                         <p className="text-[8px] font-black uppercase text-slate-500">Sofridos</p>
                         <p className="text-xl font-black text-red-600">{p.pontos_sofridos}</p>
                       </div>
                       <div className="bg-[#D32F2F] text-white p-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center min-w-[80px]">
                         <p className="text-[9px] font-black uppercase text-red-200">Total</p>
                         <p className="text-3xl font-black">{p.pontos_totais}</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-t-2 border-black pt-4 mt-2">
                  <div className="text-xs font-bold uppercase text-slate-600 flex-1">
                    {p.observacoes && <span className="flex gap-2"><MessageSquare className="w-4 h-4"/> {p.observacoes}</span>}
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => { setEditingKumite(p); setShowKumiteForm(true); }} className="flex-1 p-2 border-2 border-black bg-white hover:bg-slate-200"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteKumite(p.id)} className="flex-1 p-2 border-2 border-black bg-red-100 hover:bg-red-500 hover:text-white text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/* MODAIS DE FORMULÁRIO */}
        <KataForm 
          atletas={atletas} 
          eventos={eventos} 
          open={showKataForm} 
          initialData={editingKata} 
          onSave={(d) => saveKataMutation.mutate(d)} 
          onCancel={() => { setShowKataForm(false); setEditingKata(null); }} 
        />
        <KumiteForm 
          atletas={atletas} 
          eventos={eventos} 
          open={showKumiteForm} 
          initialData={editingKumite} 
          onSave={(d) => saveKumiteMutation.mutate(d)} 
          onCancel={() => { setShowKumiteForm(false); setEditingKumite(null); }} 
        />
      </div>
    </div>
  );
}