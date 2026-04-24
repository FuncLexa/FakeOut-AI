// src/pages/HistoryPage.jsx
import { useDetection } from '../context/DetectionContext';
import { Download, Trash2, ChevronRight, Calendar } from 'lucide-react';

const HistoryPage = () => {
  const { history, clearHistory, downloadResult } = useDetection();

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case 'likely_real':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Likely Real</span>;
      case 'high_risk':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">High Risk</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">Suspicious</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">Detection History</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Review and export past analyses</p>
        </div>
        {history.length > 0 && (
          <button onClick={clearHistory} className="flex items-center space-x-2 px-4 py-2 rounded-lg glass-card text-red-500 hover:bg-red-500/10 transition-colors">
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No detection history yet</p>
          <p className="text-sm text-gray-400 mt-2">Upload an audio file to start analyzing</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, idx) => (
            <div key={idx} className="glass-card rounded-xl p-5 hover:bg-white/5 transition-all">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getVerdictBadge(item.verdict)}
                    <span className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="font-medium truncate">{item.filename || 'Unknown Audio'}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-fallback">{item.explanation.substring(0, 100)}...</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                    <span>Confidence: {item.confidence}%</span>
                    <span>MFCC: {item.model1.confidence}%</span>
                    <span>wav2vec2: {item.model2.confidence}%</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => downloadResult(item)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Download className="w-5 h-5 text-gray-400" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          {history.length} total analyses
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
