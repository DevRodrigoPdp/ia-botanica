/**
 * VoiceControls - Botones de micrófono y speaker
 * 
 * @param {Object} props
 * @param {Function} props.onTranscript - Callback cuando se captura voz
 * @param {string} props.textToSpeak - Texto a reproducir
 * @param {boolean} props.disabled - Deshabilitar controles
 */

import { useEffect } from 'react';
import { useSpeech } from '../../hooks/useSpeech';
import { useTTS } from '../../hooks/useTTS';
import './VoiceControl.css';

export default function VoiceControls({ 
  onTranscript, 
  textToSpeak, 
  disabled = false 
}) {
  const { isListening, transcript, startListening } = useSpeech();
  const { isSpeaking, speak } = useTTS();

  // Cuando se captura voz, notificar al padre
  const handleListen = () => {
    startListening();
  };

  // Cuando hay nueva transcripción, enviar al padre
  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  // Si hay texto nuevo, hablar
  useEffect(() => {
    if (textToSpeak) {
      speak(textToSpeak);
    }
  }, [textToSpeak, speak]);

  return (
    <div className="voice-controls">
      <button
        className={`voice-btn mic-btn ${isListening ? 'listening' : ''}`}
        onClick={handleListen}
        disabled={disabled || isListening || isSpeaking}
        title="Presiona para hablar"
      >
        🎤
      </button>
      {isListening && <span className="listening-indicator">Escuchando...</span>}
      {isSpeaking && <span className="speaking-indicator">Hablando...</span>}
    </div>
  );
}