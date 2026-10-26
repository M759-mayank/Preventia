import { Language } from '../i18n/translations';

let activeAudioContext: AudioContext | null = null;
let activeSourceNode: AudioBufferSourceNode | null = null;
let activeHtmlAudio: HTMLAudioElement | null = null;

export function stopAllSpeech() {
  if (activeSourceNode) {
    try {
      activeSourceNode.stop();
      activeSourceNode.disconnect();
    } catch {
      // ignore if already stopped
    }
    activeSourceNode = null;
  }
  if (activeHtmlAudio) {
    activeHtmlAudio.pause();
    activeHtmlAudio.currentTime = 0;
    activeHtmlAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

function selectBrowserFemaleVoice(language: Language): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetLangPrefix = language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en';
  const femaleKeywords = [
    'female',
    'woman',
    'swara',
    'aarohi',
    'kalpana',
    'heera',
    'lekha',
    'neerja',
    'priya',
    'aditi',
    'raveena',
    'kajal',
    'zira',
    'samantha',
    'victoria',
    'google हिन्दी',
    'google मराठी',
  ];

  const isFemaleVoice = (v: SpeechSynthesisVoice) =>
    femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw));

  // 1. Exact language match + female voice
  const exactFemale = voices.find(
    (v) => v.lang.toLowerCase().startsWith(targetLangPrefix) && isFemaleVoice(v)
  );
  if (exactFemale) return exactFemale;

  // 2. Exact language match (any voice)
  const exactLang = voices.find((v) => v.lang.toLowerCase().startsWith(targetLangPrefix));
  if (exactLang) return exactLang;

  // 3. For Marathi ('mr'), fallback to Hindi ('hi-IN') Devanagari female voice so it actually speaks Devanagari script!
  if (language === 'mr') {
    const hindiFemale = voices.find(
      (v) => v.lang.toLowerCase().startsWith('hi') && isFemaleVoice(v)
    );
    if (hindiFemale) return hindiFemale;

    const hindiAny = voices.find((v) => v.lang.toLowerCase().startsWith('hi'));
    if (hindiAny) return hindiAny;
  }

  // 4. Fallback to Indian English ('en-IN') female voice or any female voice
  const indianFemale = voices.find(
    (v) => v.lang.toLowerCase().includes('in') && isFemaleVoice(v)
  );
  if (indianFemale) return indianFemale;

  const anyFemale = voices.find((v) => isFemaleVoice(v));
  return anyFemale || voices[0] || null;
}

function speakWithBrowserFallback(
  text: string,
  language: Language,
  seniorMode: boolean,
  onEnd: () => void
) {
  if (!('speechSynthesis' in window)) {
    onEnd();
    return;
  }

  const runUtterance = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const chosenVoice = selectBrowserFemaleVoice(language);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang;
    } else {
      utterance.lang = language === 'mr' ? 'hi-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    }
    // Slightly higher pitch for clear, warm female tone
    utterance.pitch = 1.15;
    utterance.rate = seniorMode ? 0.88 : 0.95;
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      runUtterance();
    };
    setTimeout(runUtterance, 150);
  } else {
    runUtterance();
  }
}

export async function speakInFemaleVoice(
  text: string,
  language: Language,
  seniorMode: boolean,
  onStart: () => void,
  onEnd: () => void
): Promise<void> {
  stopAllSpeech();
  onStart();

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });

    if (!response.ok) {
      throw new Error('TTS API fallback');
    }

    const { audioBase64, mimeType } = await response.json();
    if (!audioBase64) {
      throw new Error('Empty audio payload');
    }

    const binaryString = atob(audioBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Check if raw 16-bit PCM (24kHz) from Gemini TTS or WAV/MP3 container
    const isPcm =
      !mimeType ||
      mimeType.includes('pcm') ||
      mimeType.includes('L16') ||
      (bytes[0] !== 0x52 && bytes[1] !== 0x49); // Not 'RIFF' WAV header

    if (isPcm) {
      if (!activeAudioContext || activeAudioContext.state === 'closed') {
        activeAudioContext = new AudioContext({ sampleRate: 24000 });
      }
      if (activeAudioContext.state === 'suspended') {
        await activeAudioContext.resume();
      }

      const sampleCount = Math.floor(bytes.byteLength / 2);
      const audioBuffer = activeAudioContext.createBuffer(1, sampleCount, 24000);
      const channelData = audioBuffer.getChannelData(0);
      const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

      for (let i = 0; i < sampleCount; i++) {
        const int16 = dataView.getInt16(i * 2, true);
        channelData[i] = int16 / 32768;
      }

      const source = activeAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.playbackRate.value = seniorMode ? 0.92 : 1.0;
      source.connect(activeAudioContext.destination);
      activeSourceNode = source;
      source.onended = () => {
        activeSourceNode = null;
        onEnd();
      };
      source.start(0);
      return;
    } else {
      const blob = new Blob([bytes], { type: mimeType || 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.playbackRate = seniorMode ? 0.92 : 1.0;
      activeHtmlAudio = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        activeHtmlAudio = null;
        onEnd();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        activeHtmlAudio = null;
        speakWithBrowserFallback(text, language, seniorMode, onEnd);
      };
      await audio.play();
      return;
    }
  } catch {
    // Seamless fallback to female voice in Web Speech API (with Devanagari hi-IN fallback for Marathi)
    speakWithBrowserFallback(text, language, seniorMode, onEnd);
  }
}
