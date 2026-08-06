import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { pagesConfig } from './pages.config';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from './lib/AuthContext';

// Importe as telas
import Cadastro from './pages/Cadastro';
import Login from './pages/Login'; 

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

// Wrapper do Layout
const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

// ==========================================
// SEGURANÇA COM NÍVEL DE ACESSO (CORRIGIDA)
// ==========================================
const RotaProtegida = ({ children, rolesPermitidos }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('karate_token');
  const userString = localStorage.getItem('karate_user');
  
  // 1. Sem autenticação, redireciona para o login
  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }
  
  const user = JSON.parse(userString);

  // 2. Com autenticação, mas sem nível de acesso suficiente
  if (rolesPermitidos && !rolesPermitidos.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F0E6] p-4">
        <div className="w-full max-w-md bg-white border-[4px] border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl font-black uppercase text-[#D32F2F] tracking-tighter">Acesso Restrito</h1>
          <p className="mt-2 font-bold uppercase text-slate-600 text-xs">
            Seu nível atual ({user.role}) não possui permissão para visualizar esta tela.
          </p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-6 w-full border-[3px] border-black bg-white text-black py-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-slate-100 transition-colors"
          >
            Voltar uma página
          </button>
        </div>
      </div>
    );
  }
  
  // 3. Acesso liberado
  return children;
};

const AuthenticatedApp = () => {
  return (
    <Routes>
      {/* ROTAS PÚBLICAS */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* ROTA PRINCIPAL (DASHBOARD) - LIBERADA PARA TODOS */}
      <Route path="/" element={
        <RotaProtegida rolesPermitidos={['admin', 'sensei', 'mesario', 'aluno']}>
          <LayoutWrapper currentPageName={mainPageKey}>
            <MainPage />
          </LayoutWrapper>
        </RotaProtegida>
      } />

      {/* ROTAS DINÂMICAS PROTEGIDAS */}
      {Object.entries(Pages).map(([path, Page]) => {
        const pathLower = path.toLowerCase();
        
        if (pathLower === 'login' || pathLower === 'cadastro') return null;

        // Controle rigoroso de quem acessa o quê:
        let roles = ['admin'];
        
        if (pathLower === 'pontuacoes') {
          roles = ['admin', 'mesario', 'sensei'];
        }
        
        // Placar Ao Vivo, Atletas, Eventos, Dojos e Vinculos acessíveis por todos
        if (
          pathLower === 'livekumite' || 
          pathLower === 'atletas' || 
          pathLower === 'eventos' ||
          pathLower === 'dojos' ||
          pathLower === 'vinculos'
        ) {
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
      
      {/* ROTA DE ERRO 404 */}
      <Route path="*" element={<PageNotFound />} />
              
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
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