import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { BrainCircuit, Loader2, Stethoscope, AlertTriangle, Send, User, Bot } from 'lucide-react';
import { Species } from '../types';

const AIAssistant: React.FC = () => {
  const [mode, setMode] = useState<'diagnosis' | 'chat'>('diagnosis');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Diagnosis mode state
  const [result, setResult] = useState<string | null>(null);
  const [species, setSpecies] = useState(Species.DOG);
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState<number>(0);
  const [symptoms, setSymptoms] = useState('');
  const [history, setHistory] = useState('');

  // Chat mode state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await aiService.analyzeClinicalCase({
        species,
        breed,
        age,
        symptoms,
        history
      });
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar análise');
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setLoading(true);
    setError(null);

    // Adicionar mensagem do usuário
    const newMessages = [...chatMessages, { role: 'user' as const, content: userMessage }];
    setChatMessages(newMessages);

    try {
      // Preparar histórico para o backend
      const conversationHistory = chatMessages.flatMap(msg => [msg.content]);
      
      const response = await aiService.chat(userMessage, conversationHistory);
      
      // Adicionar resposta do assistente
      setChatMessages([...newMessages, { role: 'assistant' as const, content: response }]);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pergunta');
      // Remover mensagem do usuário se houver erro
      setChatMessages(chatMessages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg text-white shadow-lg">
          <BrainCircuit size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">IA Clínica VetCare</h2>
          <p className="text-sm text-gray-500">Powered by Gemini 2.0 Flash</p>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4">
        <button 
          onClick={() => setMode('diagnosis')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            mode === 'diagnosis' ? 'bg-teal-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Stethoscope size={16} className="inline mr-2" />
          Diagnóstico Assistido
        </button>
        <button 
          onClick={() => setMode('chat')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            mode === 'chat' ? 'bg-teal-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Send size={16} className="inline mr-2" />
          Fazer Perguntas
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {mode === 'diagnosis' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 bg-teal-50 border-b border-teal-100">
              <h3 className="font-bold text-teal-800">Dados do Paciente</h3>
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
                      min="0"
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
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Sintomas Observados <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    value={symptoms} 
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Descreva os sintomas clínicos observados..."
                    rows={5}
                    required
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Histórico Relevante / Exames Prévios</label>
                  <textarea 
                    value={history} 
                    onChange={(e) => setHistory(e.target.value)}
                    placeholder="Vacinas, doenças anteriores, medicações, exames realizados..."
                    rows={3}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !symptoms.trim()}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Analisando com IA...
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
                  <p>Processando dados clínicos com IA...</p>
                </div>
              ) : result ? (
                <div className="text-sm leading-relaxed text-gray-800">
                  <div className="whitespace-pre-wrap">
                    {result.split('\n').map((line, idx) => {
                      // Renderizar markdown básico
                      if (line.startsWith('## ')) {
                        return <h2 key={idx} className="text-lg font-bold text-teal-700 mt-6 mb-3">{line.replace('## ', '').trim()}</h2>;
                      }
                      if (line.startsWith('# ')) {
                        return <h1 key={idx} className="text-xl font-bold text-teal-800 mt-6 mb-3">{line.replace('# ', '').trim()}</h1>;
                      }
                      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                        return <div key={idx} className="ml-4 mb-1">• {line.trim().substring(2)}</div>;
                      }
                      if (line.trim().startsWith('1.') || line.trim().match(/^\d+\./)) {
                        return <div key={idx} className="ml-4 mb-1">{line.trim()}</div>;
                      }
                      if (line.trim() === '') {
                        return <br key={idx} />;
                      }
                      return <p key={idx} className="mb-2">{line}</p>;
                    })}
                  </div>
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
      ) : (
        /* Chat Mode */
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 bg-teal-50 border-b border-teal-100">
            <h3 className="font-bold text-teal-800 flex items-center gap-2">
              <Bot size={18} />
              Chat com Assistente Veterinário IA
            </h3>
            <p className="text-xs text-gray-600 mt-1">Faça perguntas sobre medicina veterinária, farmacologia, procedimentos e mais.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Bot size={64} className="opacity-20 mb-4" />
                <p className="text-center">Comece fazendo uma pergunta!</p>
                <p className="text-xs text-gray-400 mt-2">Ex: "Qual a dosagem de ivermectina para cães?"</p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <Bot size={16} className="text-teal-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.role === 'user'
                        ? 'bg-teal-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none whitespace-pre-line">
                      {msg.content}
                    </div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={16} className="text-gray-600" />
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-teal-600" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <Loader2 className="animate-spin text-teal-500" size={20} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Digite sua pergunta..."
                disabled={loading}
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !chatInput.trim()}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={18} />
                    Enviar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
