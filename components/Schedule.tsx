import React, { useState } from 'react';
import { MOCK_APPOINTMENTS } from '../constants';
import { Appointment } from '../types';
import { Calendar as CalendarIcon, Clock, Plus, CheckCircle, XCircle, AlertCircle, User, ChevronLeft, ChevronRight } from 'lucide-react';

const Schedule: React.FC = () => {
  // Defaulting to the mock data date for demo purposes, in production would be new Date()
  const [date, setDate] = useState<string>('2024-05-20'); 
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Appointment Form State
  const [newAppt, setNewAppt] = useState<Partial<Appointment>>({
    type: 'Consulta',
    status: 'Agendado',
    time: '09:00'
  });

  const filteredAppointments = appointments
    .filter(a => a.date === date)
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleStatusUpdate = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppt.petName || !newAppt.ownerName || !newAppt.time || !newAppt.type) return;

    const appointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      petId: 'temp-id',
      petName: newAppt.petName,
      ownerName: newAppt.ownerName,
      date: date,
      time: newAppt.time,
      type: newAppt.type as any,
      status: 'Agendado'
    };

    setAppointments([...appointments, appointment]);
    setIsModalOpen(false);
    setNewAppt({ type: 'Consulta', status: 'Agendado', time: '09:00' });
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Vacina': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cirurgia': return 'bg-red-100 text-red-700 border-red-200';
      case 'Retorno': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-teal-100 text-teal-700 border-teal-200';
    }
  };

  const changeDate = (days: number) => {
    const curr = new Date(date + 'T12:00:00'); // Fix timezone issue usually caused by simple string parsing
    curr.setDate(curr.getDate() + days);
    setDate(curr.toISOString().split('T')[0]);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Agenda</h2>
          <p className="text-gray-500">Gestão de consultas e procedimentos</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Date Navigation */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <CalendarIcon size={20} className="text-teal-600" />
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="font-bold text-lg text-gray-800 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-teal-500"
          />
        </div>
        <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Schedule List */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-y-auto">
        {filteredAppointments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Clock size={48} className="mb-4 opacity-20" />
            <p>Nenhum agendamento para esta data.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => (
              <div key={apt.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group relative overflow-hidden">
                {/* Status Stripe */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                   apt.status === 'Concluido' ? 'bg-green-500' : apt.status === 'Cancelado' ? 'bg-red-300' : 'bg-teal-500'
                }`} />

                <div className="flex items-center gap-4 min-w-[120px]">
                  <div className="bg-gray-100 p-2 rounded-lg text-center min-w-[3.5rem]">
                    <span className="block font-bold text-gray-800 text-lg">{apt.time}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{apt.petName}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getTypeColor(apt.type)}`}>
                      {apt.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><User size={14} /> {apt.ownerName}</span>
                    {apt.type === 'Vacina' && (
                        <span className="flex items-center gap-1 text-orange-600"><AlertCircle size={14} /> Alerta de Vacinação</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto justify-end">
                  {apt.status === 'Agendado' ? (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(apt.id, 'Concluido')}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                      >
                        <CheckCircle size={14} /> Concluir
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(apt.id, 'Cancelado')}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                      >
                        <XCircle size={14} /> Cancelar
                      </button>
                    </>
                  ) : (
                    <span className={`text-sm font-medium px-3 py-1 rounded-lg ${
                      apt.status === 'Concluido' ? 'text-green-600 bg-green-50' : 'text-red-400 bg-red-50'
                    }`}>
                      {apt.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-4 bg-teal-900 text-white flex justify-between items-center">
              <h3 className="font-bold">Novo Agendamento</h3>
              <button onClick={() => setIsModalOpen(false)}><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    disabled // Simplification: Add to currently viewed date
                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                  <input 
                    type="time" 
                    required
                    value={newAppt.time}
                    onChange={(e) => setNewAppt({...newAppt, time: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente (Pet)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Thor"
                  value={newAppt.petName || ''}
                  onChange={(e) => setNewAppt({...newAppt, petName: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Tutor</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Ana Silva"
                  value={newAppt.ownerName || ''}
                  onChange={(e) => setNewAppt({...newAppt, ownerName: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Atendimento</label>
                <select 
                  value={newAppt.type}
                  onChange={(e) => setNewAppt({...newAppt, type: e.target.value as any})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="Consulta">Consulta</option>
                  <option value="Vacina">Vacina</option>
                  <option value="Retorno">Retorno</option>
                  <option value="Cirurgia">Cirurgia</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full bg-teal-600 text-white py-2 rounded-lg font-bold hover:bg-teal-700 transition-colors"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;