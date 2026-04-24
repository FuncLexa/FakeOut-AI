import { useDetection } from '../context/DetectionContext';
import { CheckCircle, AlertTriangle, Shield, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { FileText } from 'lucide-react';

const VerdictDisplay = ({ result }) => {
const { downloadJSON, downloadPDF } = useDetection();

  const getVerdictConfig = () => {
    switch (result.verdict) {
      case 'likely_real':
        return {
          label: 'LIKELY REAL',
          icon: CheckCircle,
          color: 'text-emerald-500',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'This voice appears authentic.',
        };
      case 'suspicious':
        return {
          label: 'SUSPICIOUS',
          icon: AlertTriangle,
          color: 'text-amber-500',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'Proceed with caution; mixed signals were detected.',
        };
      case 'high_risk':
        return {
          label: 'HIGH RISK',
          icon: Shield,
          color: 'text-red-500',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'AI-generated voice patterns were detected.',
        };
      default:
        return {
          label: 'UNKNOWN',
          icon: Shield,
          color: 'text-gray-500',
          bg: 'bg-gray-500/10',
          border: 'border-gray-500/30',
          text: 'Unable to determine.',
        };
    }
  };

  const config = getVerdictConfig();
  const confidenceData = [
    { name: 'MFCC Model', confidence: result.model1.confidence },
    { name: 'wav2vec2', confidence: result.model2.confidence },
  ];

  return (
    <div className="space-y-6">
      <div className={`glass-card rounded-2xl p-6 border-l-8 ${config.border}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`rounded-xl p-3 ${config.bg}`}>
              <config.icon className={`h-6 w-6 ${config.color}`} />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Verdict</h3>
              <p className={`text-2xl font-bold ${config.color}`}>{config.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Overall Confidence</p>
            <p className="text-3xl font-bold">{result.confidence}%</p>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300">{config.text}</p>
      </div>

      <div className="grid gap-4">
        <h3 className="font-semibold">Dual Model Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">MFCC + XGBoost</span>
              {result.model1.prediction === 'REAL' ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : result.model1.prediction === 'FAKE' ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <Minus className="h-4 w-4 text-amber-500" />
              )}
            </div>
            <p className="text-2xl font-bold">{result.model1.confidence}%</p>
            <p className="text-sm text-gray-500">Prediction: {result.model1.prediction}</p>
            <div className="mt-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-red-500 to-emerald-500"
                style={{ width: `${result.model1.confidence}%` }}
              />
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">wav2vec2 (Fine-tuned)</span>
              {result.model2.prediction === 'REAL' ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : result.model2.prediction === 'FAKE' ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <Minus className="h-4 w-4 text-amber-500" />
              )}
            </div>
            <p className="text-2xl font-bold">{result.model2.confidence}%</p>
            <p className="text-sm text-gray-500">Prediction: {result.model2.prediction}</p>
            <div className="mt-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-red-500 to-emerald-500"
                style={{ width: `${result.model2.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="mb-3 font-semibold">Why?</h3>
        <p className="leading-relaxed text-gray-600 dark:text-gray-300">{result.explanation}</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="mb-4 font-semibold">Model Confidence Comparison</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={confidenceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="confidence" stroke="#f59e0b" fill="url(#chart-gradient)" />
            <defs>
              <linearGradient id="chart-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

     <div className="flex gap-4 mt-6">
  <button
    onClick={() => downloadJSON(result)}
    className="flex-1 py-3 rounded-xl glass-card border border-white/20 flex items-center justify-center space-x-2 hover:bg-white/5 transition-colors"
  >
    <Download className="w-4 h-4" />
    <span>Export as JSON</span>
  </button>

  <button
    onClick={() => downloadPDF(result)}
    className="flex-1 py-3 rounded-xl glass-card border border-white/20 flex items-center justify-center space-x-2 hover:bg-white/5 transition-colors"
  >
    <FileText className="w-4 h-4" />
    <span>Export as PDF</span>
  </button>
</div>
    </div>
  );
};

export default VerdictDisplay;
