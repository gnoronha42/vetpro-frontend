import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { User, Lock, Mail, Phone, ArrowRight } from 'lucide-react';

const Register: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'tutor' as 'tutor' | 'vet' | 'admin'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone
      });
      setSuccess(true);
      setTimeout(() => {
         onSwitchToLogin(); // Redireciona para login após sucesso
      }, 2000);
    } catch (err: any) {
      console.error('Registration error details:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      
      let errorMessage = 'Erro ao registrar usuário.';
      
      if (err.response) {
        // Erro do backend
        errorMessage = err.response.data?.error || err.message || 'Erro ao registrar usuário.';
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      } else if (err.message) {
        // Erro de rede ou outro erro
        errorMessage = err.message;
      } else if (err.request) {
        // Requisição feita mas sem resposta
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Conta criada!</h2>
        <p className="text-gray-600">Redirecionando para o login...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Crie sua conta</h2>
        <p className="text-gray-500">Junte-se ao VetCare Pro</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="name"
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="tel"
              name="phone"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              name="password"
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              name="confirmPassword"
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Conta</label>
          <select
            name="role"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="tutor">Tutor (Dono de Pet)</option>
            <option value="vet">Veterinário</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? 'Criando conta...' : (
            <>
              Criar Conta <ArrowRight size={18} />
            </>
          )}
        </button>

        <div className="text-center mt-4 text-sm text-gray-500">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-teal-600 font-bold hover:underline"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;

