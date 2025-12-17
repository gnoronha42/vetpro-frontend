import { Pet, Species, Owner, Appointment, KPI, Product } from './types';

export const MOCK_OWNERS: Owner[] = [
  { id: '1', name: 'Ana Silva', phone: '(11) 99999-9999', email: 'ana@email.com' },
  { id: '2', name: 'Carlos Souza', phone: '(11) 98888-8888', email: 'carlos@email.com' },
];

export const MOCK_PETS: Pet[] = [
  { 
    id: 'p1', 
    name: 'Thor', 
    species: Species.DOG, 
    breed: 'Golden Retriever', 
    age: 5, 
    weight: 32.5, 
    ownerId: '1', 
    lastVisit: '2023-10-15',
    imageUrl: 'https://picsum.photos/200/200?random=1'
  },
  { 
    id: 'p2', 
    name: 'Luna', 
    species: Species.CAT, 
    breed: 'Siamês', 
    age: 2, 
    weight: 4.1, 
    ownerId: '2', 
    lastVisit: '2024-01-20',
    imageUrl: 'https://picsum.photos/200/200?random=2'
  },
  { 
    id: 'p3', 
    name: 'Paçoca', 
    species: Species.DOG, 
    breed: 'SRD', 
    age: 8, 
    weight: 12, 
    ownerId: '1', 
    lastVisit: '2024-02-10',
    imageUrl: 'https://picsum.photos/200/200?random=3'
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1', petId: 'p1', petName: 'Thor', ownerName: 'Ana Silva', date: '2024-05-20', time: '09:00', type: 'Consulta', status: 'Agendado' },
  { id: 'a2', petId: 'p2', petName: 'Luna', ownerName: 'Carlos Souza', date: '2024-05-20', time: '10:30', type: 'Vacina', status: 'Agendado' },
  { id: 'a3', petId: 'p3', petName: 'Paçoca', ownerName: 'Ana Silva', date: '2024-05-20', time: '14:00', type: 'Retorno', status: 'Concluido' },
  { id: 'a4', petId: 'p1', petName: 'Thor', ownerName: 'Ana Silva', date: '2024-05-20', time: '16:00', type: 'Cirurgia', status: 'Agendado' },
  { id: 'a5', petId: 'p2', petName: 'Luna', ownerName: 'Carlos Souza', date: '2024-05-21', time: '09:00', type: 'Consulta', status: 'Agendado' },
];

export const MOCK_KPI: KPI = {
  revenue: 15450.00,
  appointmentsToday: 8,
  newPatients: 12,
  occupancyRate: 85
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod1',
    name: 'Bravecto 20-40kg',
    description: 'Comprimido mastigável para cães. Proteção de 12 semanas contra pulgas e carrapatos.',
    price: 289.90,
    category: 'Medicamento',
    imageUrl: 'https://picsum.photos/300/300?random=10',
    stock: 50
  },
  {
    id: 'prod2',
    name: 'Royal Canin Adulto 15kg',
    description: 'Ração Premium para cães adultos de médio porte. Nutrição balanceada.',
    price: 345.00,
    category: 'Nutrição',
    imageUrl: 'https://picsum.photos/300/300?random=11',
    stock: 20
  },
  {
    id: 'prod3',
    name: 'Apoquel 16mg',
    description: 'Dermatológico para tratamento do prurido associado a dermatites alérgicas.',
    price: 310.50,
    category: 'Medicamento',
    imageUrl: 'https://picsum.photos/300/300?random=12',
    stock: 35
  },
  {
    id: 'prod4',
    name: 'Shampoo Hipoalergênico',
    description: 'Para cães e gatos com pele sensível. pH balanceado.',
    price: 45.90,
    category: 'Higiene',
    imageUrl: 'https://picsum.photos/300/300?random=13',
    stock: 100
  },
  {
    id: 'prod5',
    name: 'Vermífugo Drontal',
    description: 'Comprimido para tratamento de vermes intestinais em cães.',
    price: 89.00,
    category: 'Medicamento',
    imageUrl: 'https://picsum.photos/300/300?random=14',
    stock: 80
  },
  {
    id: 'prod6',
    name: 'Coleira Antipulgas Seresto',
    description: 'Proteção contínua por até 8 meses. Resistente à água.',
    price: 220.00,
    category: 'Acessórios',
    imageUrl: 'https://picsum.photos/300/300?random=15',
    stock: 45
  }
];