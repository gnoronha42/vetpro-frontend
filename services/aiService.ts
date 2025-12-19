import api from './api';

export interface AnalyzeClinicalCaseData {
  species: string;
  breed: string;
  age: number;
  symptoms: string;
  history?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const aiService = {
  analyzeClinicalCase: async (data: AnalyzeClinicalCaseData): Promise<string> => {
    try {
      const response = await api.post<{ analysis: string }>('/ai/analyze', data);
      return response.data.analysis;
    } catch (error: any) {
      console.error('Erro ao analisar caso clínico:', error);
      throw new Error(error.response?.data?.error || 'Erro ao processar análise clínica');
    }
  },

  chat: async (message: string, conversationHistory: string[] = []): Promise<string> => {
    try {
      const response = await api.post<{ response: string }>('/ai/chat', {
        message,
        conversationHistory
      });
      return response.data.response;
    } catch (error: any) {
      console.error('Erro no chat:', error);
      throw new Error(error.response?.data?.error || 'Erro ao processar pergunta');
    }
  }
};

