import Dashboard from './pages/Dashboard';
import Atletas from './pages/Atletas';
import Pontuacoes from './pages/Pontuacoes';
import Eventos from './pages/Eventos';
import AtletaDetalhes from './pages/AtletaDetalhes';
import LiveKumite from './pages/LiveKumite';
import Usuarios from './pages/Usuarios'; // <-- Importação da nova página
import __Layout from './Layout.jsx';

export const PAGES = {
    "Dashboard": Dashboard,
    "Atletas": Atletas,
    "Pontuacoes": Pontuacoes,
    "Eventos": Eventos,
    "AtletaDetalhes": AtletaDetalhes,
    "LiveKumite": LiveKumite,
    "Usuarios": Usuarios // <-- Nova página registada nas rotas
};

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout
};