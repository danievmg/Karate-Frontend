import React, { useState } from 'react';

export default function Vinculos() {
  const [atletaId, setAtletaId] = useState('');
  const [emailResponsavel, setEmailResponsavel] = useState('');
  const [parentesco, setParentesco] = useState('Pai/Mãe');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const handleVincular = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    try {
      const token = localStorage.getItem('karate_token');
      
      // Mude para a URL da sua API na Vercel quando for testar em produção
      const response = await fetch('http://localhost:3000/api/vinculos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          atleta_id: atletaId, 
          responsavel_email: emailResponsavel, 
          parentesco 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar vínculo.');
      }

      setMensagem({ tipo: 'sucesso', texto: 'Responsável vinculado com sucesso!' });
      setAtletaId('');
      setEmailResponsavel('');
      
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl font-black uppercase text-[#D32F2F] tracking-tighter mb-2">
          Vincular Responsável
        </h1>
        <p className="font-bold uppercase text-slate-600 text-xs mb-6">
          Autorize um familiar a visualizar seu desempenho.
        </p>

        {mensagem && (
          <div className={`p-4 mb-6 border-[3px] border-black font-bold uppercase text-sm ${
            mensagem.tipo === 'sucesso' ? 'bg-green-300 text-black' : 'bg-red-300 text-black'
          }`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleVincular} className="space-y-5">
          <div>
            <label className="block text-sm font-black uppercase text-black mb-1">ID do Atleta</label>
            <input
              type="number"
              required
              className="w-full p-3 border-[3px] border-black bg-[#F3F0E6] focus:outline-none focus:ring-0 focus:bg-white transition-colors"
              value={atletaId}
              onChange={(e) => setAtletaId(e.target.value)}
              placeholder="Ex: 15"
            />
          </div>

          <div>
            <label className="block text-sm font-black uppercase text-black mb-1">E-mail do Responsável</label>
            <input
              type="email"
              required
              className="w-full p-3 border-[3px] border-black bg-[#F3F0E6] focus:outline-none focus:ring-0 focus:bg-white transition-colors"
              value={emailResponsavel}
              onChange={(e) => setEmailResponsavel(e.target.value)}
              placeholder="responsavel@email.com"
            />
            <span className="text-[10px] font-bold uppercase text-slate-500 mt-1 block">
              O responsável já deve ter uma conta criada no sistema.
            </span>
          </div>

          <div>
            <label className="block text-sm font-black uppercase text-black mb-1">Grau de Parentesco</label>
            <select
              className="w-full p-3 border-[3px] border-black bg-[#F3F0E6] font-bold uppercase text-sm focus:outline-none focus:ring-0 focus:bg-white transition-colors"
              value={parentesco}
              onChange={(e) => setParentesco(e.target.value)}
            >
              <option value="Pai/Mãe">Pai / Mãe</option>
              <option value="Irmão/Irmã">Irmão / Irmã</option>
              <option value="Tio/Tia">Tio / Tia</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#D32F2F] text-white py-4 font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Adicionar Vínculo'}
          </button>
        </form>
      </div>
    </div>
  );
}