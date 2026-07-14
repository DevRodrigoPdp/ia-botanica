export const startSpeechRecognition = (onResult, onError) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    onError('Tu navegador no soporta reconocimiento de voz');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.continuous = false;

  recognition.onstart = () => {
    console.log('Escuchando...');
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript + ' ';
    }
    onResult(transcript.trim());
  };

  recognition.onerror = (event) => {
    onError(`Error: ${event.error}`);
  };

  recognition.onend = () => {
    console.log('Micrófono apagado');
  };

  recognition.start();
  return recognition;
};