import React, { useState } from 'react';
import { analyzeClinicalCase, checkApiKey } from '../services/geminiService';
import { BrainCircuit, Loader2, Stethoscope, AlertTriangle, Send } from 'lucide-react';
import { Species } from '../types';

const AIAssistant: React.FC = () => {
  const [mode, setMode] = useState<'diagnosis' | 'chat'>('diagnosis');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Form State for Diagnosis
  const [species, setSpecies] = useState(Species.DOG);
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState<number>(0);
  const [symptoms, setSymptoms] = useState('');
  const [history, setHistory] = useState('');

  const hasApiKey = checkApiKey();

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms) return;

    setLoading(true);
    setResult(null);

    const analysis = await analyzeClinicalCase(species, breed, age, symptoms, history);
    setResult(analysis);
    setLoading(false);
  };

  if (!hasApiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-white rounded-xl shadow-sm border border-red-100">
        <div className="bg-red-50 p-4 rounded-full mb-4 text-red-500">
          <AlertTriangle size={48} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Configuração Necessária</h2>
        <p className="text-gray-600 max-w-md">
          O Agente de IA VetCare Pro requer uma chave de API do Google Gemini. 
          Por favor, configure a variável de ambiente <code>API_KEY</code> para utilizar este recurso.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg text-white shadow-lg">
          <BrainCircuit size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">IA Clínica VetCare</h2>
          <p className="text-sm text-gray-500">Powered by Gemini 2.5 Flash</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex gap-4">
             <button 
                onClick={() => setMode('diagnosis')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'diagnosis' ? 'bg-white text-teal-700 shadow-sm border border-gray-200' : 'text-gray-500 hover:bg-gray-100'
                }`}
             >
               Diagnóstico Assistido
             </button>
             {/* Chat mode placeholder for future expansion */}
             <button 
                onClick={() => setMode('chat')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'chat' ? 'bg-white text-teal-700 shadow-sm border border-gray-200' : 'text-gray-500 hover:bg-gray-100'
                }`}
                disabled
             >
               Chatbot (Em breve)
             </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <form onSubmit={handleAnalysis} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Espécie</label>
                  <select 
                    value={species} 
                    onChange={(e) => setSpecies(e.target.value as Species)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    {Object.values(Species).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Idade (anos)</label>
                  <input 
                    type="number" 
                    value={age} 
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Raça</label>
                <input 
                  type="text" 
                  value={breed} 
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="Ex: Golden Retriever"
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Sintomas Observados</label>
                <textarea 
                  value={symptoms} 
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Descreva os sintomas clínicos..."
                  rows={4}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Histórico Relevante / Exames Prévios</label>
                <textarea 
                  value={history} 
                  onChange={(e) => setHistory(e.target.value)}
                  placeholder="Vacinas, doenças anteriores, medicações..."
                  rows={3}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !symptoms}
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Analisando com Gemini...
                  </>
                ) : (
                  <>
                    <Stethoscope size={20} />
                    Gerar Análise Clínica
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
          <div className="p-4 bg-teal-50 border-b border-teal-100">
            <h3 className="font-bold text-teal-800 flex items-center gap-2">
              <BrainCircuit size={18} />
              Resultado da Análise
            </h3>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <Loader2 className="animate-spin text-teal-500" size={48} />
                <p>Processando dados clínicos...</p>
              </div>
            ) : result ? (
              <div className="prose prose-teal max-w-none text-sm leading-relaxed whitespace-pre-line text-gray-800">
                {result}
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-400 italic flex items-center gap-1">
                    <AlertTriangle size={12} />
                    Aviso: Esta análise é gerada por IA e serve apenas como suporte à decisão clínica. A responsabilidade final é do Médico Veterinário.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Stethoscope size={64} className="opacity-20 mb-4" />
                <p>Preencha os dados e inicie a análise.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;