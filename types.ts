export enum Species {
  DOG = 'Canino',
  CAT = 'Felino',
  BIRD = 'Ave',
  OTHER = 'Outro'
}

export interface Owner {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  age: number;
  weight: number;
  ownerId: string;
  lastVisit?: string;
  imageUrl?: string;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}

export interface Appointment {
  id: string;
  petId: string;
  ownerName: string; // Denormalized for UI
  petName: string;   // Denormalized for UI
  date: string;
  time: string;
  type: 'Consulta' | 'Vacina' | 'Retorno' | 'Cirurgia';
  status: 'Agendado' | 'Concluido' | 'Cancelado';
}

export interface KPI {
  revenue: number;
  appointmentsToday: number;
  newPatients: number;
  occupancyRate: number;
}

// Marketplace Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Medicamento' | 'Nutrição' | 'Acessórios' | 'Higiene';
  imageUrl: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processando' | 'Enviado' | 'Entregue';
  paymentMethod: 'Cartão de Crédito' | 'Pix' | 'Boleto';
}