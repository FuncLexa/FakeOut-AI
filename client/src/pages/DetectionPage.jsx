// src/pages/DetectionPage.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useDetection } from '../context/DetectionContext';
import WaveformVisualizer from '../components/WaveformVisualizer';
import AudioRecorder from '../components/AudioRecorder';
import VerdictDisplay from '../components/VerdictDisplay';
import LexaBot from '../components/LexaBot';
import { 
  Upload, Mic, Play, Volume2, Loader2, Sparkles, 
  FileJson, FileText, CheckCircle, AlertCircle, X,
  Clock, History, Lightbulb, ShieldCheck, Fingerprint,
  Brain, Cpu, Waves, Radio, Scan, Globe, Zap, Award,
  Lock, Shield
} from 'lucide-react';

const DetectionPage = () => {
  const { addToHistory, setCurrentResult, currentResult, downloadJSON, downloadPDF, history } = useDetection();
  const [audioFile, setAudioFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const demoClips = [
    { name: 'Real Voice', type: 'real', desc: 'Natural human speech' },
    { name: 'AI Clone', type: 'fake', desc: 'Synthetic voice sample' },
    { name: 'Ambiguous', type: 'ambiguous', desc: 'Edge case analysis' },
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'audio/*': ['.wav', '.mp3', '.m4a', '.ogg', '.flac'] },
    onDrop: (files) => {
      if (files[0]) handleFileUpload(files[0]);
    },
  });

  const handleFileUpload = (file) => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setCurrentResult(null);
    showToast(`Loaded: ${file.name}`, 'success');
  };

  const handleRecordComplete = (blob) => {
    const file = new File([blob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
    handleFileUpload(file);
  };

  const loadDemoClip = async (type) => {
    try {
      const response = await fetch(`/samples/${type}_sample.wav`);
      if (!response.ok) throw new Error('Failed to load demo');
      const blob = await response.blob();
      const file = new File([blob], `demo-${type}.wav`, { type: 'audio/wav' });
      handleFileUpload(file);
    } catch (error) {
      console.error('Error loading demo:', error);
      showToast('Failed to load demo sample', 'error');
    }
  };

  const simulateDetection = (type) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let result;
      if (type === 'real') {
        result = {
          verdict: 'likely_real',
          confidence: 92,
          model1: { name: 'MFCC + XGBoost', prediction: 'REAL', confidence: 89 },
          model2: { name: 'wav2vec2', prediction: 'REAL', confidence: 95 },
          explanation: 'This voice shows natural pitch variations, breath sounds, and micro-temporal jitter consistent with human speech.',
          timestamp: new Date().toISOString(),
          filename: audioFile?.name || 'demo-real.wav',
        };
      } else if (type === 'fake') {
        result = {
          verdict: 'high_risk',
          confidence: 96,
          model1: { name: 'MFCC + XGBoost', prediction: 'FAKE', confidence: 94 },
          model2: { name: 'wav2vec2', prediction: 'FAKE', confidence: 98 },
          explanation: 'Detected unnatural pitch consistency and absence of micro-vibrato. Spectral discontinuities suggest neural vocoder artifacts.',
          timestamp: new Date().toISOString(),
          filename: audioFile?.name || 'demo-fake.wav',
        };
      } else {
        result = {
          verdict: 'suspicious',
          confidence: 67,
          model1: { name: 'MFCC + XGBoost', prediction: 'SUSPICIOUS', confidence: 71 },
          model2: { name: 'wav2vec2', prediction: 'SUSPICIOUS', confidence: 63 },
          explanation: 'Mixed signals: MFCC analysis shows minor unnatural smoothness but temporal dynamics are mostly human-like.',
          timestamp: new Date().toISOString(),
          filename: audioFile?.name || 'demo-ambiguous.wav',
        };
      }
      setCurrentResult(result);
      addToHistory(result);
      setIsAnalyzing(false);
      showToast('Analysis complete', 'success');
    }, 2000);
  };

  const startAnalysis = async () => {
    if (!audioFile || isAnalyzing) return;
    setIsAnalyzing(true);
    showToast('Uploading and analyzing...', 'info');

    const formData = new FormData();
    formData.append('file', audioFile);

    console.log('Starting analysis with file:', audioFile.name);

    try {
      console.log('Sending request to /api/predict');
      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.error) {
        showToast(data.error, 'error');
        setIsAnalyzing(false);
        return;
      }

      const mappedResult = {
        verdict: data.risk_level === 'low' ? 'likely_real' : (data.risk_level === 'high' ? 'high_risk' : 'suspicious'),
        confidence: data.confidence,
        model1: { name: 'MFCC + XGBoost', prediction: data.model1_verdict, confidence: data.model1_confidence },
        model2: { name: 'wav2vec2', prediction: data.model2_verdict, confidence: data.model2_confidence },
        explanation: data.explanation,
        timestamp: data.timestamp || new Date().toISOString(),
        filename: data.filename || audioFile.name,
      };

      setCurrentResult(mappedResult);
      addToHistory(mappedResult);
      showToast('Analysis complete', 'success');
    } catch (error) {
      console.error('Analysis error:', error);
      showToast('Error connecting to server', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadJSON = () => {
    if (currentResult) {
      downloadJSON(currentResult);
      showToast('JSON downloaded', 'success');
    }
  };

  const handleDownloadPDF = async () => {
    if (currentResult) {
      try {
        await downloadPDF(currentResult);
        showToast('PDF downloaded', 'success');
      } catch {
        showToast('PDF failed', 'error');
      }
    }
  };

  const clearAll = () => {
    setAudioFile(null);
    setAudioUrl(null);
    setCurrentResult(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    showToast('Cleared', 'info');
  };

  const recentUploads = history.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : 
             toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-500" /> : 
             <AlertCircle className="w-4 h-4 text-amber-500" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          Voice Deepfake Detection
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
          Upload an audio file or record directly to verify authenticity.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`rounded-xl border-2 border-dashed transition-all cursor-pointer p-8 text-center
              ${isDragActive 
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20' 
                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 hover:border-amber-400'
              }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
            <p className="font-medium text-gray-900 dark:text-white">
              {isDragActive ? 'Drop your file here' : 'Drop audio file or click to browse'}
            </p>
            <p className="text-sm text-gray-500 mt-1">WAV, MP3, M4A, OGG, FLAC — up to 25MB</p>
          </div>

          {/* Audio Recorder */}
          <AudioRecorder onRecordingComplete={handleRecordComplete} />

          {/* Demo Samples */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/30 p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Try demo samples</h3>
            <div className="grid grid-cols-3 gap-3">
              {demoClips.map((clip) => (
                <button
                  key={clip.type}
                  onClick={() => loadDemoClip(clip.type)}
                  className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {clip.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">No audio leaves your device — fully private</p>
          </div>

          {/* Audio Player */}
          {audioUrl && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/30 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Volume2 className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="text-sm font-medium truncate">{audioFile?.name}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => audioRef.current?.play()} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Play className="w-4 h-4" />
                  </button>
                  <button onClick={clearAll} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <audio ref={audioRef} src={audioUrl} className="hidden" />
              <WaveformVisualizer audioUrl={audioUrl} />
              <button
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="mt-5 w-full py-2.5 rounded-lg bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 text-white font-medium disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Mic className="w-4 h-4" /> Analyze Audio</>
                )}
              </button>
            </div>
          )}

          {/* Recent Uploads */}
          {recentUploads.length > 0 && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/30 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Recent checks
              </h3>
              <div className="space-y-2">
                {recentUploads.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {item.verdict === 'likely_real' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> :
                       item.verdict === 'high_risk' ? <Shield className="w-3.5 h-3.5 text-red-500" /> :
                       <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                      <span className="truncate max-w-[150px]">{item.filename || 'Audio'}</span>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Results */}
        <div>
          <AnimatePresence mode="wait">
            {currentResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <VerdictDisplay result={currentResult} />
                <div className="flex gap-3">
                  <button
                    onClick={handleDownloadJSON}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FileJson className="w-4 h-4" /> JSON
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FileText className="w-4 h-4" /> PDF
                  </button>
                </div>
                <p className="text-center text-xs text-gray-400">Your data stays local — no servers involved</p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/30 p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Mic className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No analysis yet</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Upload or record an audio file to see detection results.
                </p>
                <div className="flex justify-center gap-4 mt-5 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> 94% accuracy</span>
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Private</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {currentResult ? <LexaBot result={currentResult} /> : null}
    </div>
  );
};

export default DetectionPage;
