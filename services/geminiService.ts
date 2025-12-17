import { GoogleGenAI } from "@google/genai";

// Initialize the client.
// NOTE: In a production environment, never expose the API key in the frontend code.
// This should be proxied through a backend. We use process.env for this demo structure.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const checkApiKey = (): boolean => {
  return !!apiKey && apiKey.length > 0;
};

export const analyzeClinicalCase = async (
  species: string,
  breed: string,
  age: number,
  symptoms: string,
  history: string
): Promise<string> => {
  if (!checkApiKey()) {
    return "Erro: Chave de API do Gemini não configurada.";
  }

  try {
    const prompt = `
      Atue como um Especialista em Medicina Veterinária Sênior.
      Analise o seguinte caso clínico e forneça:
      1. Lista de diagnósticos diferenciais prováveis (com probabilidades estimadas).
      2. Exames complementares sugeridos.
      3. Plano de tratamento inicial recomendado.
      
      Paciente:
      - Espécie: ${species}
      - Raça: ${breed}
      - Idade: ${age} anos
      
      Sintomas Atuais:
      ${symptoms}
      
      Histórico Médico:
      ${history}
      
      Formate a resposta em Markdown limpo e profissional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.4, // Lower temperature for more analytical/medical accuracy
      }
    });

    return response.text || "Não foi possível gerar uma análise no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao consultar o assistente de IA. Verifique sua conexão e chave de API.";
  }
};

export const chatWithVetAssistant = async (
  message: string,
  conversationHistory: string[]
): Promise<string> => {
  if (!checkApiKey()) {
    return "Configuração de API pendente.";
  }

  try {
    // For a simple demo, we are appending context manually, 
    // but usually we would use the Chat API state management.
    const prompt = `
      Você é o I-Vet Assistant, um assistente virtual para clínicas veterinárias.
      Ajude com dúvidas sobre farmacologia, triagem ou procedimentos administrativos.
      Seja conciso e profissional.
      
      Histórico recente:
      ${conversationHistory.slice(-3).join('\n')}
      
      Nova mensagem do usuário:
      ${message}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Sem resposta.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Erro no serviço de chat.";
  }
};