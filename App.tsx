import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import AIAssistant from './components/AIAssistant';
import Marketplace from './components/Marketplace';
import Schedule from './components/Schedule';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { authService } from './services/authService';
import { Menu, X } from 'lucide-react';

// Main Application Layout
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setAuthMode('login');
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-teal-800 mb-2">VetCare Pro</h1>
          <p className="text-gray-500">Gestão Veterinária Inteligente</p>
        </div>
        
        {authMode === 'login' ? (
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onSwitchToRegister={() => setAuthMode('register')} 
          />
        ) : (
          <Register 
            onSwitchToLogin={() => setAuthMode('login')} 
          />
        )}
      </div>
    );
  }

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
          if (view === 'logout') {
            handleLogout();
          } else {
          setCurrentView(view);
          setIsSidebarOpen(false);
          }
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
