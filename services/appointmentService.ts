import api from './api';
import { Appointment } from '../types';

export interface AppointmentCreateData {
  date: string;
  time?: string;
  petId: string;
  vetId?: string;
  type?: 'Consulta' | 'Vacina' | 'Retorno' | 'Cirurgia';
  status?: 'Agendado' | 'Concluido' | 'Cancelado';
}

export interface AppointmentResponse {
  id: number;
  date: string;
  petId: number;
  vetId?: number;
  status: 'scheduled' | 'completed' | 'canceled';
  type?: string;
  pet?: {
    id: number;
    name: string;
    owner?: {
      id: number;
      name: string;
      email: string;
      phone?: string;
    };
  };
  vet?: {
    id: number;
    name: string;
    email: string;
  };
}

// Converter status do backend para frontend
const statusToFrontend = (status: string): 'Agendado' | 'Concluido' | 'Cancelado' => {
  const map: Record<string, 'Agendado' | 'Concluido' | 'Cancelado'> = {
    'scheduled': 'Agendado',
    'completed': 'Concluido',
    'canceled': 'Cancelado'
  };
  return map[status] || 'Agendado';
};

// Converter appointment do backend para formato do frontend
const transformAppointment = (apt: AppointmentResponse): Appointment => {
  const dateObj = new Date(apt.date);
  return {
    id: String(apt.id),
    petId: String(apt.petId),
    ownerName: apt.pet?.owner?.name || 'N/A',
    petName: apt.pet?.name || 'N/A',
    date: dateObj.toISOString().split('T')[0],
    time: dateObj.toTimeString().slice(0, 5),
    type: (apt.type as any) || 'Consulta',
    status: statusToFrontend(apt.status)
  };
};

export const appointmentService = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await api.get<AppointmentResponse[]>('/appointments');
    return response.data.map(transformAppointment);
  },

  getById: async (id: string): Promise<Appointment> => {
    const response = await api.get<AppointmentResponse>(`/appointments/${id}`);
    return transformAppointment(response.data);
  },

  create: async (data: AppointmentCreateData): Promise<Appointment> => {
    // Combinar data e hora em um único campo datetime ISO
    // data.date vem como "YYYY-MM-DD" e data.time vem como "HH:MM" (ou está em data.date)
    let dateTime: string;
    
    if (data.date.includes('T')) {
      // Se já inclui hora, usar como está
      dateTime = data.date;
    } else {
      // Combinar data (YYYY-MM-DD) com hora
      const time = (data as any).time || '09:00';
      // Garantir formato HH:MM:SS
      const timeParts = time.split(':');
      const timeFormatted = timeParts.length === 2 
        ? `${time}:00` 
        : (timeParts.length === 3 ? time : `${time}:00:00`);
      dateTime = `${data.date}T${timeFormatted}`;
    }
    
    // Validar se a data é válida
    const dateObj = new Date(dateTime);
    if (isNaN(dateObj.getTime())) {
      throw new Error(`Data ou hora inválida: ${dateTime}`);
    }
    
    console.log('Enviando data para API:', dateTime);
    
    const response = await api.post<AppointmentResponse>('/appointments', {
      date: dateTime,
      petId: Number(data.petId),
      vetId: data.vetId ? Number(data.vetId) : undefined,
      type: data.type,
      status: data.status || 'Agendado'
    });
    
    return transformAppointment(response.data);
  },

  update: async (id: string, data: Partial<AppointmentCreateData>): Promise<Appointment> => {
    const updateData: any = {};
    
    if (data.status) {
      updateData.status = data.status;
    }
    
    if (data.date) {
      const dateTime = `${data.date}T${data.date.includes('T') ? data.date.split('T')[1] : '09:00:00'}`;
      updateData.date = dateTime;
    }

    const response = await api.put<AppointmentResponse>(`/appointments/${id}`, updateData);
    return transformAppointment(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  }
};

