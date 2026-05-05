import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Assim que a aplicação abre, verifica se o utilizador já está logado
  useEffect(() => {
    const token = localStorage.getItem('karate_token');
    const savedUser = localStorage.getItem('karate_user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setIsLoadingAuth(false);
  }, []);

  // Função central de Login (O Login.jsx vai chamar esta função)
  const login = async (email, senha) => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // Guarda os dados no navegador
      localStorage.setItem('karate_token', data.token);
      localStorage.setItem('karate_user', JSON.stringify(data.usuario));

      // Atualiza o estado do React para liberar as páginas protegidas
      setUser(data.usuario);
      setIsAuthenticated(true);

      return { success: true, usuario: data.usuario };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('karate_token');
    localStorage.removeItem('karate_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};