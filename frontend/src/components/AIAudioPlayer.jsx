import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function AIAudioPlayer({ textToRead, title = 'AI Voice Intelligence Summary' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const handlePlayPause = () => {
    if (!speechSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead || 'No audio text provided for summary.');
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (speechSupported) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  if (!speechSupported) return null;

  return (
    <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-sm transition-all ${
      isDark
        ? 'bg-[#151c2e] border-[#1e2942] text-white'
        : 'bg-purple-50/70 border-purple-100 text-gray-800'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${isPlaying ? 'bg-emerald-500 text-white animate-pulse' : isDark ? 'bg-blue-600 text-white' : 'bg-[#9a55ff] text-white'}`}>
          {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </div>
        <div>
          <h4 className="text-xs font-bold">{title}</h4>
          <p className="text-[10px] opacity-75 mt-0.5">
            {isPlaying ? 'Playing AI spoken summary...' : 'Listen to hands-free AI report summary'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePlayPause}
          className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            isPlaying
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm'
              : isDark
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-[#9a55ff] hover:bg-[#8843ed] text-white'
          }`}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          <span>{isPlaying ? 'Pause' : 'Listen'}</span>
        </button>

        {isPlaying && (
          <button
            onClick={handleStop}
            className="p-1.5 rounded-xl border border-gray-300 dark:border-[#1e2942] text-gray-500 hover:text-white transition-colors cursor-pointer"
            title="Stop Audio"
          >
            <RotateCcw size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
