/**
 * Servicio de API
 * Llamadas HTTP al backend
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const sendChatMessage = async (message, sessionId) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Error en API:', error);
    throw error;
  }
};