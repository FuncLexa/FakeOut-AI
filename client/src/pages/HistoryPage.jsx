import { useDetection } from '../context/DetectionContext';
import { Download, Trash2, ChevronRight, Calendar, Clock } from 'lucide-react';

const HistoryPage = () => {
  const { history, clearHistory, downloadJSON } = useDetection();

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case 'likely_real':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">Real</span>;
      case 'high_risk':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400">Fake</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">Suspicious</span>;
    }
  };

  const handleDownload = (item) => {
    const dataStr = JSON.stringify(item, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fakeout-${item.timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
            History
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Review and export past analyses</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900/30">
          <Calendar className="w-10 h-10 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No detection history yet</p>
          <p className="text-sm text-gray-500 mt-1">Upload an audio file to start analyzing</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900/30 p-5 hover:shadow-sm transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    {getVerdictBadge(item.verdict)}
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {item.filename || 'Unknown audio'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {item.explanation ? `${item.explanation.substring(0, 120)}...` : 'No explanation available'}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span>Confidence: {item.confidence || 0}%</span>
                    <span>MFCC: {item.model1?.confidence || 0}%</span>
                    <span>wav2vec2: {item.model2?.confidence || 0}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(item)}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500"
                    title="Download JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          {history.length} total {history.length === 1 ? 'analysis' : 'analyses'}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;