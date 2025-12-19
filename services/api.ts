import axios from 'axios';

// URL do backend - em produção usa Render, em desenvolvimento usa localhost
const getBaseURL = () => {
  // Se a variável de ambiente estiver definida, usa ela
  if (import.meta.env.VITE_API_URL) {
    console.log('API URL (env):', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  // Fallback: detecta se está em produção (sem localhost na URL)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    const prodUrl = 'https://ivet-project.onrender.com/api';
    console.log('API URL (prod):', prodUrl);
    return prodUrl;
  }
  // Desenvolvimento local
  const devUrl = 'http://localhost:3001/api';
  console.log('API URL (dev):', devUrl);
  return devUrl;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Log da requisição em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401 (não autenticado), limpar dados do localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirecionar para login apenas se não estiver já na página de login
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

