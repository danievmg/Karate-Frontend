import axios from 'axios';

// Altere para a URL oficial do seu backend na Vercel
const API_URL = "https://karate-backend.vercel.app";
export const base44 = {
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
},

  auth: { me: async () => ({ id: 1, name: "Daniel Silva" }) }
};