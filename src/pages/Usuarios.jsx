import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Shield, Trash2, UserCog } from 'lucide-react';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Vai buscar o Token ao navegador
  const token = localStorage.getItem('karate_token');

  // Busca a lista ao carregar a página
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('https://karate-backend.vercel.app/api/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        toast.error('Sem permissão para ver utilizadores.');
      }
    } catch (error) {
      toast.error('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const mudarCargo = async (id, novoCargo) => {
    try {
      const response = await fetch(`https://karate-backend.vercel.app/api/usuarios/${id}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ role: novoCargo })
      });

      if (response.ok) {
        toast.success(`Cargo atualizado para ${novoCargo.toUpperCase()}!`);
        fetchUsuarios(); // Atualiza a lista
      } else {
        toast.error('Erro ao atualizar cargo.');
      }
    } catch (error) {
      toast.error('Erro de conexão.');
    }
  };

  const apagarUsuario = async (id, nome) => {
    if (!window.confirm(`Tem a certeza que quer banir o utilizador ${nome}?`)) return;

    try {
      const response = await fetch(`https://karate-backend.vercel.app/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Utilizador removido!');
        setUsuarios(usuarios.filter(u => u.id !== id));
      } else {
        toast.error('Erro ao remover utilizador.');
      }
    } catch (error) {
      toast.error('Erro de conexão.');
    }
  };

  if (loading) return <div className="p-8 font-black uppercase">A carregar registos...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      
      <div className="flex items-center gap-4 border-b-[4px] border-black pb-4 mb-8">
        <div className="w-12 h-12 bg-[#D32F2F] border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <UserCog className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Gestão de Acessos</h1>
          <p className="font-bold text-slate-600 uppercase text-xs">Controlo de Permissões do Dojo</p>
        </div>
      </div>

      <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-white uppercase text-sm font-black">
              <th className="p-4 border-r-[3px] border-white/20">Nome / Email</th>
              <th className="p-4 border-r-[3px] border-white/20">Nível de Acesso</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id} className="border-b-[3px] border-black last:border-b-0 hover:bg-[#F3F0E6] transition-colors">
                
                <td className="p-4 border-r-[3px] border-black">
                  <div className="font-black uppercase">{user.nome}</div>
                  <div className="text-xs font-bold text-slate-500">{user.email}</div>
                </td>

                <td className="p-4 border-r-[3px] border-black">
                  <select 
                    value={user.role}
                    onChange={(e) => mudarCargo(user.id, e.target.value)}
                    className={`p-2 border-[2px] border-black font-bold text-xs uppercase cursor-pointer outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all
                      ${user.role === 'admin' ? 'bg-[#D32F2F] text-white' : 'bg-white text-black'}`}
                  >
                    <option value="aluno">Aluno (Apenas vê notas)</option>
                    <option value="mesario">Mesário / Pais (Lança Notas)</option>
                    <option value="sensei">Sensei (Gere Atletas)</option>
                    <option value="admin">Administrador (Total)</option>
                  </select>
                </td>

                <td className="p-4 flex justify-center">
                  <button 
                    onClick={() => apagarUsuario(user.id, user.nome)}
                    disabled={user.role === 'admin'}
                    className="p-2 bg-white border-[2px] border-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
                    title={user.role === 'admin' ? "Não pode apagar um Admin" : "Banir utilizador"}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}