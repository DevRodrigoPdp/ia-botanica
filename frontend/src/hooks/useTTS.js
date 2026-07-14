import { useState, useCallback } from 'react';
import { speak } from '../services/tts';

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = useCallback((text) => {
    setIsSpeaking(true);
    speak(text, {
      onend: () => setIsSpeaking(false),
      onerror: () => setIsSpeaking(false),
    });
  }, []);

  return { isSpeaking, speakText };
};