import axios from 'axios';

// URL oficial do backend na Vercel, já com o sufixo /api para coincidir com as rotas do servidor
const API_URL = "https://karate-backend.vercel.app/api";

// Criação da instância do axios. É isto que permite usar api.get() e api.post() abaixo.
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// ==========================================
// --- INTERCEPTADOR DE AUTENTICAÇÃO ---
// ==========================================
// Antes de qualquer requisição sair, ele verifica se tem token e anexa.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('karate_token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// ==========================================

export const base44 = {
    auth: {
        // Métodos de autenticação e registo adicionados para o ecrã "Nova Conta"
        login: async (credenciais) => (await api.post('/login', credenciais)).data,
        cadastro: async (dados) => (await api.post('/cadastro', dados)).data,
        me: async () => ({ id: 1, name: "Daniel Silva" })
    },
    
    atleta: {
        findMany: async () => (await api.get('/atletas')).data,
        create: async (data) => (await api.post('/atletas', data)).data,
        findOne: async (id) => (await api.get(`/atletas/${id}`)).data,
    },
    
    evento: { 
        findMany: async () => (await api.get('/eventos')).data, 
        create: async (data) => (await api.post('/eventos', data)).data 
    },

    pontuacaoKata: { 
        findMany: async () => (await api.get('/pontuacoes/kata')).data || [], 
        create: async (data) => (await api.post('/pontuacoes/kata', data)).data 
    },
    
    pontuacaoKumite: { 
        findMany: async () => (await api.get('/pontuacoes/kumite')).data || [], 
        create: async (data) => (await api.post('/pontuacoes/kumite', data)).data 
    }
};