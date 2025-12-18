import React, { useState, useEffect } from 'react';
import { Pet, Species } from '../types';
import { Search, Filter, Plus, FileText, X } from 'lucide-react';
import { petService } from '../services/petService';

const PatientList: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newPet, setNewPet] = useState<{
    name: string;
    species: string;
    breed: string;
    age: string;
    weight: string;
  }>({
    name: '',
    species: Species.DOG,
    breed: '',
    age: '',
    weight: ''
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const data = await petService.getAll();
      setPets(data);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePet = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await petService.create({
        name: newPet.name,
        species: newPet.species as Species,
        breed: newPet.breed,
        age: Number(newPet.age),
        weight: Number(newPet.weight),
        ownerId: '', // Será preenchido pelo backend com o ID do usuário logado
        imageUrl: `https://placedog.net/500/500?id=${Math.floor(Math.random() * 100)}` // Placeholder
      });
      await fetchPets();
      setIsModalOpen(false);
      setNewPet({ name: '', species: Species.DOG, breed: '', age: '', weight: '' });
    } catch (error) {
      console.error('Erro ao criar pet:', error);
      alert('Erro ao cadastrar paciente. Verifique os dados.');
    } finally {
      setCreating(false);
    }
  };

  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pacientes</h2>
          <p className="text-gray-500">Gerenciamento de prontuários eletrônicos</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          <span>Novo Paciente</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome, raça..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          <Filter size={18} />
          <span>Filtros</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">Espécie / Raça</th>
                <th className="px-6 py-4">Idade</th>
                <th className="px-6 py-4">Peso</th>
                <th className="px-6 py-4">Última Visita</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredPets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum paciente encontrado.
                  </td>
                </tr>
              ) : (
                filteredPets.map((pet) => (
                  <tr key={pet.id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={pet.imageUrl || 'https://via.placeholder.com/100'} 
                          alt={pet.name} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-200" 
                        />
                        <div>
                          <p className="font-bold text-gray-900">{pet.name}</p>
                          <p className="text-xs text-gray-500">ID: {String(pet.id).padStart(4, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{pet.species}</p>
                      <p className="text-xs text-gray-500">{pet.breed}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pet.age} anos</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pet.weight} kg</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pet.lastVisit || 'N/A'}</td>
                    <td className="px-6 py-4 flex justify-center">
                      <button className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors" title="Ver Prontuário">
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-scale-in">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-teal-50">
              <h3 className="font-bold text-teal-800">Cadastrar Novo Paciente</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreatePet} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Pet</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newPet.name}
                  onChange={e => setNewPet({...newPet, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Espécie</label>
                  <select 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                    value={newPet.species}
                    onChange={e => setNewPet({...newPet, species: e.target.value})}
                  >
                    <option value="Canino">Cão</option>
                    <option value="Felino">Gato</option>
                    <option value="Ave">Ave</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Raça</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={newPet.breed}
                    onChange={e => setNewPet({...newPet, breed: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idade (anos)</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={newPet.age}
                    onChange={e => setNewPet({...newPet, age: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={newPet.weight}
                    onChange={e => setNewPet({...newPet, weight: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 shadow-lg shadow-teal-200 disabled:opacity-70"
                >
                  {creating ? 'Salvando...' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
