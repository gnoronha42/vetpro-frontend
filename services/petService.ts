import api from './api';
import { Pet } from '../types';

export const petService = {
  getAll: async (): Promise<Pet[]> => {
    const response = await api.get('/pets');
    return response.data;
  },

  getById: async (id: string): Promise<Pet> => {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  },

  create: async (pet: Omit<Pet, 'id'>): Promise<Pet> => {
    const response = await api.post('/pets', pet);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/pets/${id}`);
  }
};



