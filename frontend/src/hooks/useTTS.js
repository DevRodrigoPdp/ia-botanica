/**
 * Hook para manejar Text-to-Speech
 * Mantiene estado de reproducción
 */

import { useState } from 'react';
import { speak, stopSpeaking, isSpeaking } from '../services/tts';

export const useTTS = () => {
  const [, setIsSpeaking] = useState(false);

  const startSpeaking = (text) => {
    speak(
      text,
      () => setIsSpeakingState(true),
      () => setIsSpeakingState(false),
      (err) => console.error('Error TTS:', err)
    );
  };

  const stop = () => {
    stopSpeaking();
    setIsSpeakingState(false);
  };

  return {
    isSpeaking: isSpeakingState,
    speak: startSpeaking,
    stop
  };
};