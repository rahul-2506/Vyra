export const speakText = (text, lang = 'en-US') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to find a voice that matches the requested language
  const voices = window.speechSynthesis.getVoices();
  const safeLang = lang || 'en-US';
  const targetLangPrefix = safeLang.split('-')[0].toLowerCase();
  
  let voice = voices.find(v => v.lang && v.lang.toLowerCase() === safeLang.toLowerCase());
  if (!voice) {
    voice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(targetLangPrefix));
  }
  
  if (voice) {
    utterance.voice = voice;
  }
  
  utterance.lang = lang;
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
