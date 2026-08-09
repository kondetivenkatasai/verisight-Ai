import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceAssistant({ onTranscript }) {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentText += event.results[i][0].transcript;
      }
      setTranscriptText(currentText);

      if (event.results[0].isFinal) {
        handleFinalTranscript(currentText.trim());
      }
    };

    recognition.onerror = (event) => {
      console.warn('[VoiceAssistant] Error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleFinalTranscript = (text) => {
    if (!text) return;
    const lower = text.toLowerCase();

    // Check voice navigation commands
    if (lower.includes('go to reports') || lower.includes('open reports') || lower.includes('show reports')) {
      speak('Opening Reports');
      navigate('/reports');
      return;
    }
    if (lower.includes('go to analytics') || lower.includes('open analytics') || lower.includes('show analytics')) {
      speak('Opening Risk Analytics');
      navigate('/analytics');
      return;
    }
    if (lower.includes('go to dashboard') || lower.includes('open dashboard') || lower.includes('home')) {
      speak('Navigating to Dashboard');
      navigate('/dashboard');
      return;
    }
    if (lower.includes('create case') || lower.includes('new case') || lower.includes('new investigation')) {
      speak('Opening New Investigation creation form');
      navigate('/create-case');
      return;
    }
    if (lower.includes('go to settings') || lower.includes('open settings')) {
      speak('Opening Settings');
      navigate('/settings');
      return;
    }

    // Pass transcript to AI Copilot callback
    if (onTranscript) {
      onTranscript(text);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscriptText('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative flex items-center gap-2">
      {/* Listening pulse rings */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute -inset-1 rounded-xl bg-purple-500/30 dark:bg-blue-500/30 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Voice Toggle Button */}
      <button
        type="button"
        onClick={toggleListening}
        title={isListening ? 'Listening... Click to stop' : 'Activate Voice Assistant'}
        className={`relative p-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 text-xs font-semibold ${
          isListening
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105'
            : 'bg-purple-500/10 dark:bg-blue-500/10 text-[#9a55ff] dark:text-blue-400 border border-purple-500/20 dark:border-blue-500/20 hover:scale-105'
        }`}
      >
        {isListening ? <MicOff size={16} className="animate-pulse" /> : <Mic size={16} />}
        <span className="hidden sm:inline">{isListening ? 'Listening...' : 'Voice AI'}</span>
      </button>

      {/* Speech Output Indicator */}
      {isSpeaking && (
        <button
          type="button"
          onClick={stopSpeaking}
          title="Stop AI voice reading"
          className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-bounce cursor-pointer"
        >
          <Volume2 size={16} />
        </button>
      )}

      {/* Live Speech Overlay Bubble */}
      <AnimatePresence>
        {isListening && transcriptText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 w-64 p-2.5 rounded-xl bg-slate-900/90 text-white text-xs backdrop-blur-md border border-purple-500/30 shadow-2xl z-50 pointer-events-none"
          >
            <div className="flex items-center gap-1 text-[10px] text-purple-400 font-bold uppercase mb-1">
              <Sparkles size={12} />
              <span>Transcribing Speech</span>
            </div>
            <p className="italic text-slate-200">{transcriptText}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
