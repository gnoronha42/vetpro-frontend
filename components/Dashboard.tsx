import React from 'react';
import { MOCK_KPI, MOCK_APPOINTMENTS } from '../constants';
import { DollarSign, CalendarCheck, UserPlus, Activity, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Seg', consultas: 12 },
  { name: 'Ter', consultas: 19 },
  { name: 'Qua', consultas: 15 },
  { name: 'Qui', consultas: 22 },
  { name: 'Sex', consultas: 18 },
  { name: 'Sáb', consultas: 10 },
];

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
  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
        <p className="text-gray-500">Bem-vindo ao VetCare Pro (Consultório MVP)</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Faturamento Mensal" 
          value={`R$ ${MOCK_KPI.revenue.toLocaleString('pt-BR')}`} 
          icon={<DollarSign size={24} />} 
          trend="+12% vs mês anterior"
        />
        <StatCard 
          title="Consultas Hoje" 
          value={MOCK_KPI.appointmentsToday} 
          icon={<CalendarCheck size={24} />} 
          trend="2 vagas restantes"
        />
        <StatCard 
          title="Novos Pacientes" 
          value={MOCK_KPI.newPatients} 
          icon={<UserPlus size={24} />} 
          trend="+4 essa semana"
        />
        <StatCard 
          title="Taxa de Ocupação" 
          value={`${MOCK_KPI.occupancyRate}%`} 
          icon={<Activity size={24} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Fluxo de Atendimentos Semanal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
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
            {MOCK_APPOINTMENTS.map((apt) => (
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
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors">
            Ver Agenda Completa
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;