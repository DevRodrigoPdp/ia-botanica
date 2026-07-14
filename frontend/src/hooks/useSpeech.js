/**
 * Hook para manejar Speech-to-Text
 * Mantiene estado de escucha, transcripción, errores
 */

import { useState } from 'react';
import { startSpeechRecognition } from '../services/speech';

export const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const startListening = () => {
    setError('');
    setTranscript('');
    
    startSpeechRecognition(
      (result) => {
        setTranscript(result);
        setIsListening(false);
      },
      (err) => {
        setError(err);
        setIsListening(false);
      }
    );

    setIsListening(true);
  };

  return {
    isListening,
    transcript,
    error,
    startListening
  };
};