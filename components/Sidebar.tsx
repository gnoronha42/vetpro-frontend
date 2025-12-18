import React from 'react';
import { LayoutDashboard, Users, Calendar, BrainCircuit, Settings, Stethoscope, ShoppingBag, LogOut } from 'lucide-react';
import { authService } from '../services/authService';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen }) => {
  const user = authService.getCurrentUser();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'patients', label: 'Pacientes', icon: <Users size={20} /> },
    { id: 'schedule', label: 'Agenda', icon: <Calendar size={20} /> },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag size={20} /> },
    { id: 'ai-assistant', label: 'IA Clínica (VetCare AI)', icon: <BrainCircuit size={20} /> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
  ];

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-20 w-64 h-full bg-teal-900 text-white transition-transform duration-300 ease-in-out flex flex-col shadow-xl`}>
      <div className="p-6 flex items-center gap-3 border-b border-teal-800">
        <div className="bg-white p-2 rounded-lg text-teal-700">
          <Stethoscope size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">I-Vet Pro</h1>
          <p className="text-xs text-teal-300">Gestão Veterinária</p>
        </div>
      </div>

      <nav className="flex-1 py-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2 px-4">
              <button
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'text-teal-100 hover:bg-teal-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
          
          <li className="mt-8 mb-2 px-4 border-t border-teal-800 pt-4">
             <button
                onClick={() => setView('logout')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-teal-100 hover:bg-red-800 hover:text-white"
              >
                <LogOut size={20} />
                <span className="font-medium">Sair</span>
              </button>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-teal-800 bg-teal-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-teal-500 bg-teal-800 flex items-center justify-center font-bold text-white">
             {user?.name.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-teal-400 capitalize">{user?.role || 'Visitante'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
