import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AtletaCard from '@/components/dashboard/AtletaCard';
import AtletaForm from '@/components/forms/AtletaForm';
import { Search, ArrowLeft, Filter, Plus } from 'lucide-react';
import { toast } from "sonner";

const FAIXAS = ['branca', 'amarela', 'vermelha', 'laranja', 'verde', 'roxa', 'marrom', 'preta'];

export default function Atletas() {
  const [showForm, setShowForm] = useState(false);
  const [editingAtleta, setEditingAtleta] = useState(null);
  const [search, setSearch] = useState('');
  const [filtroFaixa, setFiltroFaixa] = useState('todas');
  const [filtroSexo, setFiltroSexo] = useState('todos');

  const queryClient = useQueryClient();

  // PEGANDO O TOKEN DE ACESSO DO NAVEGADOR
  const token = localStorage.getItem('karate_token');

  // BUSCA REAL: Conectado ao PostgreSQL
  const { data: atletas = [], isLoading } = useQuery({
    queryKey: ['atletas'],
    queryFn: () => base44.atleta.findMany()
  });

  // SALVAR (CRIAR E EDITAR) VIA FETCH DIRETO
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const url = data.id 
        ? `https://karate-backend.vercel.app/api/atletas/${data.id}` 
        : `https://karate-backend.vercel.app/api/atletas`;
      const method = data.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // TOKEN INJETADO AQUI
        },
        body: JSON.stringify(data)
      });
      
      // Essa linha faz o erro vir certinho na notificação!
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detalhe || err.error || "Erro desconhecido");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atletas'] });
      toast.success(editingAtleta ? "Atleta atualizado com sucesso!" : "Atleta cadastrado com sucesso!");
      setShowForm(false);
      setEditingAtleta(null);
    },
    onError: (err) => toast.error(err.message)
  });

  // APAGAR VIA FETCH DIRETO
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`https://karate-backend.vercel.app/api/atletas/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // TOKEN INJETADO AQUI
        }
      });
      if (!response.ok) throw new Error("Erro ao apagar atleta");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atletas'] });
      toast.success("Atleta excluído com sucesso!");
    },
    onError: (err) => toast.error(err.message)
  });

  // HANDLERS DE AÇÃO
  const handleSave = (data) => {
    saveMutation.mutate(data);
  };

  const handleEdit = (atleta) => {
    setEditingAtleta(atleta);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Atenção: Deseja realmente apagar este atleta? Todas as notas e pontuações ligadas a ele serão perdidas.")) {
      deleteMutation.mutate(id);
    }
  };

  // LÓGICA DE FILTROS
  const filteredAtletas = atletas.filter(a => {
    const matchSearch = a.nome?.toLowerCase().includes(search.toLowerCase());
    const matchFaixa = filtroFaixa === 'todas' || a.faixa === filtroFaixa;
    const matchSexo = filtroSexo === 'todos' || a.sexo === filtroSexo;
    return matchSearch && matchFaixa && matchSexo;
  });

  // Estilos Neobrutalistas
  const neoButton = "border-[3px] border-black px-4 py-2 font-black uppercase text-xs tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all";
  const neoInput = "w-full border-[3px] border-black bg-white p-2 font-bold text-sm focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase";

  return (
    <div className="min-h-screen bg-[#F3F0E6] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header estilo Barra Técnica */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b-[4px] border-black pb-6">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('/')}>
              <button className={`${neoButton} bg-white !shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter">Gerenciamento de Elenco</h1>
              <p className="font-bold text-slate-600 uppercase text-[10px] tracking-widest">
                {atletas.length} Atletas registrados no sistema
              </p>
            </div>
          </div>
          <button 
            onClick={() => { setEditingAtleta(null); setShowForm(true); }} 
            className={`${neoButton} bg-[#D32F2F] text-white flex items-center gap-2`}
          >
            <Plus className="w-4 h-4" /> Novo Atleta
          </button>
        </div>

        {/* Filtros Neobrutalistas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-black p-4 shadow-[5px_5px_0px_0px_rgba(211,47,47,1)]">
          <div className="md:col-span-2 relative">
            <input
              placeholder="BUSCAR POR NOME..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={neoInput}
            />
          </div>
          <select 
            className={neoInput}
            value={filtroFaixa} 
            onChange={(e) => setFiltroFaixa(e.target.value)}
          >
            <option value="todas">TODAS AS FAIXAS</option>
            {FAIXAS.map(f => (
              <option key={f} value={f}>{f.toUpperCase()}</option>
            ))}
          </select>
          <select 
            className={neoInput}
            value={filtroSexo} 
            onChange={(e) => setFiltroSexo(e.target.value)}
          >
            <option value="todos">TODOS OS GÊNEROS</option>
            <option value="masculino">MASCULINO</option>
            <option value="feminino">FEMININO</option>
          </select>
        </div>

        {/* Grid de Atletas */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-28 bg-white border-4 border-black animate-pulse" />
            ))}
          </div>
        ) : filteredAtletas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAtletas.map(atleta => (
              <AtletaCard 
                key={atleta.id} 
                atleta={atleta}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-[3px] border-dashed border-black bg-white/50">
            <Filter className="w-16 h-16 mx-auto mb-4 opacity-20 text-black" />
            <p className="font-black uppercase text-lg text-black">Nenhum atleta encontrado nos registros</p>
          </div>
        )}

        <AtletaForm
          open={showForm}
          atleta={editingAtleta}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingAtleta(null); }}
        />
      </div>
    </div>
  );
}