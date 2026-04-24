// src/pages/DetectionPage.jsx
import { useEffect, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDetection } from '../context/DetectionContext';
import WaveformVisualizer from '../components/WaveformVisualizer';
import AudioRecorder from '../components/AudioRecorder';
import VerdictDisplay from '../components/VerdictDisplay';
import { Upload, Mic, Play, Volume2 } from 'lucide-react';

const DetectionPage = () => {
  const { addToHistory, setCurrentResult, currentResult } = useDetection();
  const [audioFile, setAudioFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const demoClips = [
    { name: 'Real Voice Sample', type: 'real', url: '/demo-real.wav' },
    { name: 'AI Cloned Sample', type: 'fake', url: '/demo-fake.wav' },
    { name: 'Ambiguous Sample', type: 'ambiguous', url: '/demo-ambiguous.wav' },
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'audio/*': ['.wav', '.mp3', '.m4a', '.ogg', '.flac'] },
    onDrop: (files) => {
      if (files[0]) {
        handleFileUpload(files[0]);
      }
    },
  });

  const handleFileUpload = (file) => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setCurrentResult(null);
  };

  const handleRecordComplete = (blob) => {
    const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
    handleFileUpload(file);
  };

  const loadDemoClip = async (type) => {
    try {
      const response = await fetch(`/api/demo/${type}`);
      const blob = await response.blob();
      const file = new File([blob], `${type}.wav`, { type: 'audio/wav' });
      handleFileUpload(file);
      simulateDetection(type, file.name);
    } catch {
      simulateDetection(type, `${type}.wav`);
    }
  };

  const simulateDetection = (type, filename = audioFile?.name || 'audio-file.wav') => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let result;
      if (type === 'real') {
        result = {
          verdict: 'likely_real',
          confidence: 92,
          model1: { name: 'MFCC + XGBoost', prediction: 'REAL', confidence: 89 },
          model2: { name: 'wav2vec2', prediction: 'REAL', confidence: 95 },
          explanation: 'This voice shows natural pitch variations, breath sounds, and micro-temporal jitter consistent with human speech. The spectral envelope contains expected formant transitions.',
          timestamp: new Date().toISOString(),
          filename,
        };
      } else if (type === 'fake') {
        result = {
          verdict: 'high_risk',
          confidence: 96,
          model1: { name: 'MFCC + XGBoost', prediction: 'FAKE', confidence: 94 },
          model2: { name: 'wav2vec2', prediction: 'FAKE', confidence: 98 },
          explanation: 'Detected unnatural pitch consistency (variance 87% below human baseline) and absence of micro-vibrato. Spectral discontinuities suggest neural vocoder artifacts.',
          timestamp: new Date().toISOString(),
          filename,
        };
      } else {
        result = {
          verdict: 'suspicious',
          confidence: 67,
          model1: { name: 'MFCC + XGBoost', prediction: 'SUSPICIOUS', confidence: 71 },
          model2: { name: 'wav2vec2', prediction: 'SUSPICIOUS', confidence: 63 },
          explanation: 'Mixed signals: MFCC analysis shows minor unnatural smoothness but temporal dynamics are mostly human-like. Recommend additional verification.',
          timestamp: new Date().toISOString(),
          filename,
        };
      }
      setCurrentResult(result);
      addToHistory(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  const startAnalysis = () => {
    if (audioFile) {
      simulateDetection('analyze', audioFile.name);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">
          Voice Deepfake Detection
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Upload, record, or try demo samples</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div {...getRootProps()} className={`glass-card rounded-2xl p-8 text-center cursor-pointer transition-all border-2 border-dashed ${isDragActive ? 'border-amber-500 bg-amber-500/5' : 'border-white/30'}`}>
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Drop audio file here</p>
            <p className="text-sm text-gray-500 mt-1">WAV, MP3, M4A, OGG, FLAC up to 25MB</p>
          </div>

          <AudioRecorder onRecordingComplete={handleRecordComplete} />

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Demo Samples</h3>
            <div className="grid grid-cols-3 gap-3">
              {demoClips.map((clip) => (
                <button
                  key={clip.name}
                  onClick={() => loadDemoClip(clip.type)}
                  className="px-4 py-2 rounded-xl glass-card border border-white/20 text-sm hover:scale-105 transition-transform"
                >
                  {clip.name}
                </button>
              ))}
            </div>
          </div>

          {audioUrl && (
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-5 h-5 text-amber-500" />
                  <span className="font-medium truncate">{audioFile?.name}</span>
                </div>
                <button onClick={() => audioRef.current?.play()} className="p-2 rounded-full hover:bg-white/10">
                  <Play className="w-4 h-4" />
                </button>
              </div>
              <audio ref={audioRef} src={audioUrl} className="hidden" controls />
              <WaveformVisualizer audioUrl={audioUrl} />
              <button
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 text-white font-semibold disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
              </button>
            </div>
          )}
        </div>

        <div>
          {currentResult ? (
            <VerdictDisplay result={currentResult} />
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500/20 to-emerald-500/20 flex items-center justify-center">
                <Mic className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500">Upload or record audio to see detection results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetectionPage;
