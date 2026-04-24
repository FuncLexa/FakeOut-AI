// src/components/AudioRecorder.jsx
import { useState, useRef } from 'react';
import { Mic, Square, Play } from 'lucide-react';

const AudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const audioRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        onRecordingComplete(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
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
