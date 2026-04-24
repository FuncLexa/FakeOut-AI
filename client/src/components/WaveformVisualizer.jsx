// src/components/WaveformVisualizer.jsx
import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const WaveformVisualizer = ({ audioUrl }) => {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#d1d5db',
      progressColor: 'url(#wave-gradient)',
      cursorColor: '#f59e0b',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 2,
      height: 80,
      barGap: 2,
    });

    ws.load(audioUrl);
    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('finish', () => setIsPlaying(false));
    wavesurferRef.current = ws;

    return () => ws.destroy();
  }, [audioUrl]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  return (
    <div className="relative">
      <svg width="0" height="0">
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div ref={containerRef} className="cursor-pointer" onClick={togglePlay} />
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{isPlaying ? 'Playing...' : 'Click waveform to play'}</span>
      </div>
    </div>
  );
};

export default WaveformVisualizer;
