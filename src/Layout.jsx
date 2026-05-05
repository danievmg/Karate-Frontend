import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Calendar,
  Radio, // Ícone do Placar Ao Vivo
  Menu,
  X,
  LogOut 
} from 'lucide-react';
import { cn } from "@/lib/utils";
import LogoKarate from './LogoKarateFinal.svg';


const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard' },
  { name: 'Atletas', icon: Users, page: 'Atletas' },
  { name: 'Pontuações', icon: Target, page: 'Pontuacoes' },
  { name: 'Placar Ao Vivo', icon: Radio, page: 'LiveKumite' },
  { name: 'Eventos', icon: Calendar, page: 'Eventos' },
  { name: 'Usuários', icon: Users, page: 'Usuarios' },
];

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  // Função para limpar o acesso e sair do sistema
  const handleLogout = () => {
    localStorage.removeItem('karate_token');
    localStorage.removeItem('karate_user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F3F0E6] font-sans">
      
      {/* Mobile Header - Estilo Barra Técnica */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b-[3px] border-black z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span className="font-black uppercase tracking-tighter text-lg">
            <h1 className="flex items-center">
              <img 
                src={LogoKarate} 
                alt="Logo Karatê Pro" 
                className="h-10 w-auto object-contain" // Ajustado h-10 para caber no header mobile
              />
            </h1>
          </span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="border-2 border-black p-1 active:bg-slate-200"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Visual Neobrutalista IFTM */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-white border-r-[4px] border-black z-50 transition-transform duration-300 flex flex-col",
        "lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        
        <div className="p-8 border-b-[3px] border-black bg-[#F3F0E6]">
          <div className="flex items-center justify-center">
            <h1 className="flex items-center">
              <img 
                src={LogoKarate} 
                alt="Logo Karatê Pro" 
                className="h-25 w-auto object-contain"
              />
            </h1>
          </div>
        </div>

        {/* Links de Navegação */}
        <nav className="p-4 space-y-3 flex-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 font-black uppercase text-xs tracking-widest transition-all border-[3px] border-transparent",
                  isActive 
                    ? "bg-[#D32F2F] text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]" 
                    : "text-black hover:bg-slate-100 hover:border-black"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-black")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Botão de Logout Fixo na Base */}
        <div className="p-4 border-t-[3px] border-black bg-[#F3F0E6]">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full bg-black text-white px-4 py-3 font-black uppercase text-xs tracking-widest border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(211,47,47,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(211,47,47,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sair do Sistema
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="max-w-screen-2xl mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}