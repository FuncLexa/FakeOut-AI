// src/components/AudioRecorder.jsx
import { useState, useRef } from 'react';
import { Mic, Square, Play } from 'lucide-react';

const AudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Use Web Audio API to record as WAV
      const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      
      const chunks = [];
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        chunks.push(new Float32Array(inputData));
      };
      
      source.connect(processor);
      processor.connect(audioContext.destination);
      
      audioContextRef.current = audioContext;
      processorRef.current = processor;
      chunksRef.current = chunks;
      
      setMediaRecorder({ stream, source });
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      const { stream, source } = mediaRecorder;
      
      // Stop the audio processing
      processorRef.current.disconnect();
      source.disconnect();
      audioContextRef.current.close();
      
      // Convert chunks to WAV
      const chunks = chunksRef.current;
      const sampleRate = 16000;
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const result = new Float32Array(totalLength);
      let offset = 0;
      
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }
      
      // Convert to 16-bit PCM
      const buffer = new ArrayBuffer(44 + totalLength * 2);
      const view = new DataView(buffer);
      
      // WAV header
      const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };
      
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + totalLength * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, totalLength * 2, true);
      
      // Write audio data
      for (let i = 0; i < totalLength; i++) {
        const sample = Math.max(-1, Math.min(1, result[i]));
        view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      }
      
      const blob = new Blob([buffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setRecordingUrl(url);
      onRecordingComplete(blob);
      
      // Stop the stream
      stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-semibold mb-4 flex items-center"><Mic className="w-4 h-4 mr-2" />Record Audio</h3>
      <div className="flex items-center space-x-4">
        {!isRecording ? (
          <button onClick={startRecording} className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 text-white">
            <Mic className="w-4 h-4" /> <span>Start Recording</span>
          </button>
        ) : (
          <button onClick={stopRecording} className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-600 text-white">
            <Square className="w-4 h-4" /> <span>Stop Recording</span>
          </button>
        )}
        {recordingUrl && (
          <button onClick={() => audioRef.current?.play()} className="p-2 rounded-lg hover:bg-white/10">
            <Play className="w-5 h-5" />
          </button>
        )}
      </div>
      <audio ref={audioRef} src={recordingUrl} className="hidden" controls />
    </div>
  );
};

export default AudioRecorder;
