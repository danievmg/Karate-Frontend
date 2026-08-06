import React, { useState, useEffect } from 'react';

export default function Dojos() {
  const [abaAtiva, setAbaAtiva] = useState('explorar'); // explorar | gerenciar | criar
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  // Estados de Dados
  const [listaDojos, setListaDojos] = useState([]);
  const [meusDojosGerenciados, setMeusDojosGerenciados] = useState([]);
  
  // Estados do Formulário de Criação
  const [nomeDojo, setNomeDojo] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const token = localStorage.getItem('karate_token');
  const API_URL = 'http://localhost:3000/api'; // Mude para a URL da Vercel em produção

  // ----------------------------------------------------
  // FUNÇÕES DE BUSCA (GET)
  // ----------------------------------------------------
  const buscarDojos = async () => {
    try {
      const res = await fetch(`${API_URL}/dojos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setListaDojos(await res.json());
    } catch (error) {
      console.error("Erro ao buscar dojos", error);
    }
  };

  const buscarDojosGerenciados = async () => {
    try {
      const res = await fetch(`${API_URL}/dojos/gerenciar`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setMeusDojosGerenciados(await res.json());
    } catch (error) {
      console.error("Erro ao buscar gerenciamento", error);
    }
  };

  // Atualiza os dados sempre que a aba mudar
  useEffect(() => {
    setMensagem(null);
    if (abaAtiva === 'explorar') buscarDojos();
    if (abaAtiva === 'gerenciar') buscarDojosGerenciados();
  }, [abaAtiva]);

  // ----------------------------------------------------
  // AÇÕES (POST / PUT)
  // ----------------------------------------------------
  const handleCriarDojo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/dojos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ nome: nomeDojo, logo_url: logoUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar Dojo');
      
      setMensagem({ tipo: 'sucesso', texto: 'Dojo criado! Você agora é o Admin.' });
      setNomeDojo(''); setLogoUrl('');
      setAbaAtiva('gerenciar'); // Redireciona para gerenciar
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSolicitarEntrada = async (dojoId) => {
    if (!window.confirm("Deseja enviar uma solicitação para entrar neste Dojo?")) return;
    try {
      const res = await fetch(`${API_URL}/dojos/${dojoId}/solicitar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert("Solicitação enviada com sucesso! Aguarde a aprovação.");
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleAvaliarSolicitacao = async (solicitacaoId, status) => {
    try {
      const res = await fetch(`${API_URL}/dojos/solicitacoes/${solicitacaoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status }) // 'ACEITO' ou 'RECUSADO'
      });
      if (!res.ok) throw new Error("Erro ao avaliar solicitação");
      // Atualiza a lista da tela
      buscarDojosGerenciados();
    } catch (error) {
      alert(error.message);
    }
  };

  // ----------------------------------------------------
  // RENDERIZAÇÃO
  // ----------------------------------------------------
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-black uppercase text-[#D32F2F] tracking-tighter mb-8">
        Sistema de Dojos
      </h1>

      {/* Menu de Abas */}
      <div className="flex flex-wrap gap-2 mb-8 border-b-[4px] border-black pb-4">
        <button 
          onClick={() => setAbaAtiva('explorar')}
          className={`px-6 py-2 font-bold uppercase text-sm border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all ${abaAtiva === 'explorar' ? 'bg-black text-white' : 'bg-white text-black hover:bg-slate-100'}`}
        >
          Explorar Dojos
        </button>
        <button 
          onClick={() => setAbaAtiva('gerenciar')}
          className={`px-6 py-2 font-bold uppercase text-sm border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all ${abaAtiva === 'gerenciar' ? 'bg-[#D32F2F] text-white' : 'bg-white text-black hover:bg-slate-100'}`}
        >
          Painel do Admin
        </button>
        <button 
          onClick={() => setAbaAtiva('criar')}
          className={`px-6 py-2 font-bold uppercase text-sm border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all ${abaAtiva === 'criar' ? 'bg-black text-white' : 'bg-white text-black hover:bg-slate-100'}`}
        >
          + Criar Meu Dojo
        </button>
      </div>

      {mensagem && (
        <div className={`p-4 mb-6 border-[3px] border-black font-bold uppercase text-sm ${mensagem.tipo === 'sucesso' ? 'bg-green-300' : 'bg-red-300'}`}>
          {mensagem.texto}
        </div>
      )}

      {/* CONTEÚDO: EXPLORAR */}
      {abaAtiva === 'explorar' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listaDojos.length === 0 ? <p className="font-bold">Nenhum Dojo cadastrado no sistema ainda.</p> : null}
          {listaDojos.map(dojo => (
            <div key={dojo.id} className="bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              {dojo.logo_url && <img src={dojo.logo_url} alt="Logo" className="h-16 w-16 object-cover border-[2px] border-black mb-4" />}
              <h3 className="text-xl font-black uppercase mb-1">{dojo.nome}</h3>
              <p className="text-xs font-bold text-slate-500 uppercase mb-4">Mestre Fundador: {dojo.criador.nome}</p>
              <button 
                onClick={() => handleSolicitarEntrada(dojo.id)}
                className="w-full bg-black text-white py-2 font-bold uppercase text-sm hover:bg-slate-800 transition-colors"
              >
                Solicitar Entrada
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CONTEÚDO: GERENCIAR (ADMIN) */}
      {abaAtiva === 'gerenciar' && (
        <div className="space-y-8">
          {meusDojosGerenciados.length === 0 ? (
            <p className="font-bold border-[3px] border-black p-6 bg-[#F3F0E6]">Você ainda não administra nenhum Dojo.</p>
          ) : (
            meusDojosGerenciados.map(dojo => (
              <div key={dojo.id} className="bg-white border-[4px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-black uppercase text-[#D32F2F] mb-4">{dojo.nome} - Solicitações</h2>
                
                {dojo.membros.length === 0 ? (
                  <p className="text-sm font-bold text-slate-500">Nenhuma solicitação pendente no momento.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border-[2px] border-black">
                      <thead>
                        <tr className="bg-black text-white uppercase text-xs">
                          <th className="p-3 border-[2px] border-black">Nome do Aluno</th>
                          <th className="p-3 border-[2px] border-black">E-mail</th>
                          <th className="p-3 border-[2px] border-black text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dojo.membros.map(solicitacao => (
                          <tr key={solicitacao.id} className="font-bold text-sm bg-[#F3F0E6]">
                            <td className="p-3 border-[2px] border-black">{solicitacao.usuario.nome}</td>
                            <td className="p-3 border-[2px] border-black">{solicitacao.usuario.email}</td>
                            <td className="p-3 border-[2px] border-black flex justify-center gap-2">
                              <button 
                                onClick={() => handleAvaliarSolicitacao(solicitacao.id, 'ACEITO')}
                                className="bg-green-500 text-black px-4 py-1 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-green-400"
                              >
                                ACEITAR
                              </button>
                              <button 
                                onClick={() => handleAvaliarSolicitacao(solicitacao.id, 'RECUSADO')}
                                className="bg-red-500 text-white px-4 py-1 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-red-400"
                              >
                                RECUSAR
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* CONTEÚDO: CRIAR DOJO */}
      {abaAtiva === 'criar' && (
        <div className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-lg">
          <h2 className="text-2xl font-black uppercase text-black mb-6">Fundar Novo Dojo</h2>
          <form onSubmit={handleCriarDojo} className="space-y-5">
            <div>
              <label className="block text-sm font-black uppercase text-black mb-1">Nome do Dojo</label>
              <input type="text" required className="w-full p-3 border-[3px] border-black bg-[#F3F0E6] focus:bg-white focus:outline-none" value={nomeDojo} onChange={(e) => setNomeDojo(e.target.value)} placeholder="Ex: Karate Shotokan Ituiutaba" />
            </div>
            <div>
              <label className="block text-sm font-black uppercase text-black mb-1">URL da Logo (Opcional)</label>
              <input type="url" className="w-full p-3 border-[3px] border-black bg-[#F3F0E6] focus:bg-white focus:outline-none" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://link-da-imagem.com/logo.png" />
            </div>
            <button type="submit" disabled={loading} className="w-full mt-4 bg-[#D32F2F] text-white py-4 font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50">
              {loading ? 'Criando...' : 'Registrar Dojo'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}