import React, { useState } from 'react';
import { MOCK_PETS } from '../constants';
import { Search, Filter, Plus, FileText } from 'lucide-react';

const PatientList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPets = MOCK_PETS.filter(pet => 
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
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={18} />
          <span>Novo Paciente</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome, raça ou tutor..." 
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
              {filteredPets.map((pet) => (
                <tr key={pet.id} className="hover:bg-teal-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={pet.imageUrl} alt={pet.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                      <div>
                        <p className="font-bold text-gray-900">{pet.name}</p>
                        <p className="text-xs text-gray-500">ID: {pet.id.toUpperCase()}</p>
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
              ))}
              {filteredPets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum paciente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientList;