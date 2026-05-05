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
// SEGURANÇA COM NÍVEL DE ACESSO
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
    // Se for mesário abelhudo tentando ver o dashboard, joga pra pontuações
    if (user.role === 'mesario') {
      return <Navigate to="/pontuacoes" replace />;
    }
    // Se for admin perdido, joga pro dashboard
    return <Navigate to="/" replace />;
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

      {/* 2. ROTA PRINCIPAL (DASHBOARD) - SOMENTE ADMIN */}
      <Route path="/" element={
        <RotaProtegida rolesPermitidos={['admin']}>
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
        // Por padrão, só 'admin' acessa. Mas se a página for 'pontuacoes', 'mesario' também entra!
        
        
        let roles = ['admin'];
        
        if (pathLower === 'pontuacoes'|| pathLower === 'livekumite') {
          roles = ['admin', 'mesario'];
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