import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }

      toast.success(data.message);
      // Manda o usuário pro login depois de cadastrar
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full border-[3px] border-black p-3 font-bold text-sm focus:outline-none bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase mb-4";
  const labelStyle = "block uppercase font-black text-xs mb-1 tracking-tight text-black";

  return (
    <div className="min-h-screen bg-[#F3F0E6] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-[4px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-8">
        
        <div className="flex flex-col items-center mb-6 border-b-4 border-black pb-6">
          <div className="w-16 h-16 bg-[#D32F2F] flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-center">Nova Conta</h1>
          <p className="font-bold text-slate-600 uppercase text-[10px] mt-1 text-center">Cadastro de Pais e Avaliadores</p>
        </div>

        <form onSubmit={handleCadastro}>
          <div>
            <label className={labelStyle}>Nome Completo</label>
            <input
              type="text"
              required
              className={inputStyle}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="DIGITE SEU NOME"
            />
          </div>

          <div>
            <label className={labelStyle}>E-mail</label>
            <input
              type="email"
              required
              className={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="SEU@EMAIL.COM"
            />
          </div>

          <div>
            <label className={labelStyle}>Crie uma Senha</label>
            <input
              type="password"
              required
              className={inputStyle}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white border-[3px] border-black py-4 mt-2 font-black uppercase text-sm shadow-[5px_5px_0px_0px_rgba(211,47,47,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50"
          >
            {loading ? 'Criando Conta...' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-black uppercase underline">
            Já tem uma conta? Faça Login
          </Link>
        </div>

      </div>
    </div>
  );
}