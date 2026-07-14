let currentUtterance = null;

export const speak = (text, { onend, onerror } = {}) => {
  if (currentUtterance) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = 'es-ES';
  currentUtterance.rate = 0.9;
  currentUtterance.pitch = 1;
  currentUtterance.volume = 1;

  if (onend) currentUtterance.onend = onend;
  if (onerror) currentUtterance.onerror = onerror;

  window.speechSynthesis.speak(currentUtterance);
};

export const stop = () => {
  window.speechSynthesis.cancel();
  currentUtterance = null;
};