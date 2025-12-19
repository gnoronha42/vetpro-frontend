import api from './api';
import { User } from '../types';

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'vet' | 'admin' | 'tutor';
  phone?: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token && response.data.user) {
        // Garantir que o ID seja string
        const user = {
          ...response.data.user,
          id: String(response.data.user.id)
        };
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      return response.data;
    } catch (error: any) {
      console.error('Erro no login:', error);
      if (error.response?.status === 401) {
        throw new Error('Email ou senha incorretos');
      }
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<{ message: string; user: User }> => {
    try {
      const response = await api.post('/auth/register', data);
      // Garantir que o ID seja string
      if (response.data.user) {
        response.data.user.id = String(response.data.user.id);
      }
      return response.data;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      if (error.message) {
        throw error;
      }
      throw new Error('Erro ao registrar usuário. Verifique sua conexão e tente novamente.');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
};

