import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import AIAssistant from './components/AIAssistant';
import Marketplace from './components/Marketplace';
import Schedule from './components/Schedule';
import { Menu, X } from 'lucide-react';

// Main Application Layout
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <PatientList />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'marketplace':
        return <Marketplace />;
      case 'schedule':
        return <Schedule />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-400">
            <h3 className="text-xl font-bold text-gray-700">Em Desenvolvimento</h3>
            <p>Este módulo estará disponível na próxima atualização.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        setView={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full w-full relative overflow-hidden">
        {/* Top Header (Mobile Only for Menu) */}
        <header className="md:hidden bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <span className="font-bold text-teal-800">VetCare Pro</span>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;