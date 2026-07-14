/**
 * Servicio de Text-to-Speech (texto → voz)
 * Hace que la IA hable
 */

let currentUtterance = null;

export const speak = (text, onStart, onEnd, onError) => {
  // Cancela si ya está hablando
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.9;  // Velocidad (0.5-2)
  utterance.pitch = 1;   // Tono (0-2)
  utterance.volume = 1;  // Volumen (0-1)

  utterance.onstart = () => {
    if (onStart) onStart();
    console.log('IA hablando...');
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
    console.log('IA terminó de hablar');
  };

  utterance.onerror = (event) => {
    if (onError) onError(event.error);
    console.error('Error al hablar:', event.error);
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  window.speechSynthesis.cancel();
  currentUtterance = null;
};

export const isSpeaking = () => {
  return window.speechSynthesis.speaking;
};