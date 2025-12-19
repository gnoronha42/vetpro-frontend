import React, { useState, useEffect } from 'react';
import { DollarSign, CalendarCheck, UserPlus, Activity, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { appointmentService } from '../services/appointmentService';
import { petService } from '../services/petService';
import { Appointment } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend?: string }> = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {trend && <p className="text-xs text-emerald-600 mt-2 font-medium">{trend}</p>}
    </div>
    <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    appointmentsToday: 0,
    newPatients: 0,
    revenue: 0,
    occupancyRate: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appts, pets] = await Promise.all([
        appointmentService.getAll(),
        petService.getAll()
      ]);
      
      setAppointments(appts);
      
      // Calcular estatísticas
      const today = new Date().toISOString().split('T')[0];
      const appointmentsToday = appts.filter(apt => apt.date === today && apt.status === 'Agendado').length;
      
      // Novos pacientes (últimos 7 dias)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const newPatients = pets.filter(pet => {
        const createdAt = new Date((pet as any).createdAt || 0);
        return createdAt >= weekAgo;
      }).length;

      // Taxa de ocupação (agendamentos hoje / capacidade estimada)
      const capacity = 20; // Capacidade diária estimada
      const occupancyRate = Math.round((appointmentsToday / capacity) * 100);

      setStats({
        appointmentsToday,
        newPatients,
        revenue: 0, // Calcular baseado em agendamentos se necessário
        occupancyRate
      });
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular dados do gráfico semanal
  const getWeeklyData = () => {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const today = new Date();
    const weekData = days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (today.getDay() - 1) + index);
      const dateStr = date.toISOString().split('T')[0];
      const count = appointments.filter(apt => apt.date === dateStr).length;
      return { name: day, consultas: count };
    });
    return weekData;
  };

  // Próximos agendamentos (hoje e próximos dias)
  const upcomingAppointments = appointments
    .filter(apt => {
      const aptDate = new Date(apt.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return aptDate >= today && apt.status === 'Agendado';
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
        <p className="text-gray-500">Bem-vindo ao VetCare Pro</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Faturamento Mensal" 
          value={`R$ ${stats.revenue.toLocaleString('pt-BR')}`} 
          icon={<DollarSign size={24} />} 
        />
        <StatCard 
          title="Consultas Hoje" 
          value={stats.appointmentsToday} 
          icon={<CalendarCheck size={24} />} 
        />
        <StatCard 
          title="Novos Pacientes" 
          value={stats.newPatients} 
          icon={<UserPlus size={24} />} 
          trend="Últimos 7 dias"
        />
        <StatCard 
          title="Taxa de Ocupação" 
          value={`${stats.occupancyRate}%`} 
          icon={<Activity size={24} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Fluxo de Atendimentos Semanal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getWeeklyData()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f0fdfa' }} />
                <Bar dataKey="consultas" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Próximos Agendamentos</h3>
          <div className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Clock size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">Nenhum agendamento próximo</p>
              </div>
            ) : (
              upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-50">
                  <div className="flex-shrink-0 bg-teal-100 text-teal-700 w-12 h-12 flex items-center justify-center rounded-lg font-bold text-xs flex-col">
                    <span>{apt.time.split(':')[0]}</span>
                    <span>{apt.time.split(':')[1]}</span>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-bold text-gray-900">{apt.petName}</p>
                    <p className="text-xs text-gray-500">{apt.type} • {apt.ownerName}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    apt.status === 'Agendado' ? 'bg-blue-100 text-blue-700' :
                    apt.status === 'Concluido' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))
            )}
          </div>
          <button 
            onClick={() => window.location.hash = '#schedule'}
            className="w-full mt-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
          >
            Ver Agenda Completa
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
