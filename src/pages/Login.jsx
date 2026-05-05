import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';


export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- Puxamos a função de login que criámos no AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Chama a função login do contexto, que vai ao Backend
    const resultado = await login(email, senha);

    if (resultado.success) {
      toast.success(`Bem-vindo, ${resultado.usuario.nome}!`);
      navigate('/'); // Redireciona para o Dashboard
    } else {
      // Se der erro (ex: senha errada), mostra o erro que veio do backend
      toast.error(resultado.error);
    }

    setLoading(false);
  };

  const inputStyle = "w-full border-[3px] border-black p-3 font-bold text-sm focus:outline-none bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase mb-4";
  const labelStyle = "block uppercase font-black text-xs mb-1 tracking-tight text-black";

  return (
    <div className="min-h-screen bg-[#F3F0E6] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-[4px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-8">
        
        <div className="flex flex-col items-center mb-8 border-b-4 border-black pb-6">
          <div className="w-16 h-16 bg-black flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(211,47,47,1)]">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Acesso Restrito</h1>
          <p className="font-bold text-slate-600 uppercase text-[10px] mt-1">Dojo Performance Hub</p>
        </div>

        <form onSubmit={handleLogin}>
          <div>
            <label className={labelStyle}>E-mail</label>
            <input
              type="email"
              required
              className={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="SENSEI@IFTM.EDU.BR"
            />
          </div>

          <div>
            <label className={labelStyle}>Senha de Acesso</label>
            <input
              type="password"
              required
              className={inputStyle}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#D32F2F] text-white border-[3px] border-black py-4 mt-4 font-black uppercase text-sm shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50"
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>

        {/* --- LINK PARA CADASTRO --- */}
        <div className="mt-6 text-center">
          <Link to="/cadastro" className="text-xs font-bold text-slate-500 hover:text-[#D32F2F] uppercase underline transition-colors">
            Primeiro acesso? Crie sua conta
          </Link>
        </div>

      </div>
    </div>
  );
}