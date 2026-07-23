import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { pagesConfig } from './pages.config';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from './lib/AuthContext';

// Importe as telas
import Cadastro from './pages/Cadastro';
import Login from './pages/Login'; 

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

// Se for mesário, a gente pode até esconder o Layout (Menu lateral) no futuro, mas por enquanto mantemos o Wrapper
const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

// ==========================================
// SEGURANÇA COM NÍVEL DE ACESSO (CORRIGIDA)
// ==========================================
const RotaProtegida = ({ children, rolesPermitidos }) => {
  const token = localStorage.getItem('karate_token');
  const userString = localStorage.getItem('karate_user');
  
  // 1. Não tem crachá nenhum? Vai pro Login.
  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }
  
  const user = JSON.parse(userString);

  // 2. Tem crachá, mas não tem permissão para essa sala?
  if (rolesPermitidos && !rolesPermitidos.includes(user.role)) {
    // Se for mesário tentando ver página restrita a admin, joga pra pontuações
    if (user.role === 'mesario') {
      return <Navigate to="/pontuacoes" replace />;
    }
    
    // CORREÇÃO DO LOOP: Nunca redirecionar para "/" se "/" também for restrito!
    // Exibe uma tela de "Acesso Negado" para quebrar o ciclo.
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F0E6] p-4">
        <div className="w-full max-w-md bg-white border-[4px] border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl font-black uppercase text-[#D32F2F] tracking-tighter">Acesso Negado</h1>
          <p className="mt-2 font-bold uppercase text-slate-600 text-xs">
            Seu nível atual ({user.role}) não possui permissão para acessar esta área.
          </p>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }} 
            className="mt-6 w-full border-[3px] border-black bg-black py-3 font-black text-white uppercase text-sm shadow-[4px_4px_0px_0px_rgba(211,47,47,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Fazer Login Novamente
          </button>
        </div>
      </div>
    );
  }
  
  // 3. Tudo certo, pode passar!
  return children;
};

const AuthenticatedApp = () => {
  return (
    <Routes>
      {/* 1. ROTAS PÚBLICAS */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* 2. ROTA PRINCIPAL (DASHBOARD) - LIBERADA PARA TODOS */}
      <Route path="/" element={
        <RotaProtegida rolesPermitidos={['admin', 'sensei', 'mesario', 'aluno']}>
          <LayoutWrapper currentPageName={mainPageKey}>
            <MainPage />
          </LayoutWrapper>
        </RotaProtegida>
      } />

      {/* 3. ROTAS DINÂMICAS PROTEGIDAS */}
      {Object.entries(Pages).map(([path, Page]) => {
        const pathLower = path.toLowerCase();
        
        // Ignora login e cadastro automáticos
        if (pathLower === 'login' || pathLower === 'cadastro') return null;

        // DEFINE QUEM PODE ACESSAR O QUE:
        let roles = ['admin'];
        
        if (pathLower === 'pontuacoes' || pathLower === 'livekumite') {
          roles = ['admin', 'mesario', 'sensei'];
        }
        
        // Se a página for Atletas ou Eventos, todos logados podem pelo menos ver as listas
        if (pathLower === 'atletas' || pathLower === 'eventos') {
            roles = ['admin', 'sensei', 'mesario', 'aluno'];
        }

        return (
          <Route
            key={path}
            path={`/${path}`}
            element={
              <RotaProtegida rolesPermitidos={roles}>
                <LayoutWrapper currentPageName={path}>
                  <Page />
                </LayoutWrapper>
              </RotaProtegida>
            }
          />
        );
      })}
      
      {/* 4. ROTA DE ERRO 404 */}
      <Route path="*" element={<PageNotFound />} />
              
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      {/* O AuthProvider abraça as rotas e dá a memória global ao sistema */}
      <AuthProvider> 
        <Router>
          <AuthenticatedApp />
        </Router>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  )
}
export default App;