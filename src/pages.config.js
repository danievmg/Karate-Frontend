import Dashboard from './pages/Dashboard';
import Atletas from './pages/Atletas';
import Pontuacoes from './pages/Pontuacoes';
import Eventos from './pages/Eventos';
import AtletaDetalhes from './pages/AtletaDetalhes';
import LiveKumite from './pages/LiveKumite';
import Usuarios from './pages/Usuarios'; 
import Dojos from './pages/Dojos';       // <-- Importação da página de Dojos
import Vinculos from './pages/Vinculos'; // <-- Importação da página de Vínculos
import __Layout from './Layout.jsx';

export const PAGES = {
    "Dashboard": Dashboard,
    "Atletas": Atletas,
    "Pontuacoes": Pontuacoes,
    "Eventos": Eventos,
    "AtletaDetalhes": AtletaDetalhes,
    "LiveKumite": LiveKumite,
    "Usuarios": Usuarios, 
    "Dojos": Dojos,       // <-- Nova página registrada nas rotas
    "Vinculos": Vinculos  // <-- Nova página registrada nas rotas
};

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout
};