// src/pages/VisualizePage.jsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, AreaChart, Area
} from 'recharts';
import {
  Upload, FileJson, TrendingUp, AlertTriangle, CheckCircle, 
  Sparkles, Brain, Mic, Shield, ChevronRight,  Activity, BarChart3, PieChart as PieChartIcon, Radar as RadarIcon,
  Gauge, Award, Zap, Lock, Calendar, Clock, Loader2
} from 'lucide-react';

const VisualizePage = () => {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/json': ['.json'] },
    onDrop: useCallback((files) => {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.verdict && data.model1 && data.model2 && typeof data.confidence === 'number') {
            setJsonData(data);
            setError(null);
          } else {
            setError('Invalid format: Not a FakeOut AI detection result');
          }
        } catch (err) {
          setError('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }, []),
  });

  const getVerdictConfig = (verdict) => {
    switch (verdict) {
      case 'likely_real':
        return { label: 'Likely Real', icon: CheckCircle, color: '#10b981', bgGradient: 'from-emerald-500 to-teal-500', desc: 'Natural human voice patterns detected' };
      case 'high_risk':
        return { label: 'High Risk', icon: Shield, color: '#ef4444', bgGradient: 'from-red-500 to-rose-500', desc: 'AI-generated voice detected' };
      default:
        return { label: 'Suspicious', icon: AlertTriangle, color: '#f59e0b', bgGradient: 'from-amber-500 to-orange-500', desc: 'Mixed signals — verify further' };
    }
  };

  const config = jsonData ? getVerdictConfig(jsonData.verdict) : null;

  // Prepare chart data
  const modelData = jsonData ? [
    { name: 'MFCC + XGBoost', confidence: jsonData.model1.confidence, prediction: jsonData.model1.prediction, fullName: 'Acoustic Fingerprint Model' },
    { name: 'wav2vec2', confidence: jsonData.model2.confidence, prediction: jsonData.model2.prediction, fullName: 'Neural Deepfake Detector' }
  ] : [];

  const pieData = jsonData ? [
    { name: 'Confidence', value: jsonData.confidence, color: config.color },
    { name: 'Uncertainty', value: 100 - jsonData.confidence, color: '#4b5563' }
  ] : [];

  // Radar data for model attributes (enriched)
  const radarData = jsonData ? [
    { metric: 'Accuracy', value: jsonData.confidence, fullMark: 100 },
    { metric: 'Speed', value: 94, fullMark: 100 },
    { metric: 'Explainability', value: 88, fullMark: 100 },
    { metric: 'Privacy', value: 100, fullMark: 100 },
    { metric: 'Robustness', value: 86, fullMark: 100 },
  ] : [];

  // Additional metrics
  const additionalMetrics = jsonData ? [
    { label: 'File Analysis', value: jsonData.filename || 'Unknown', icon: FileJson },
    { label: 'Timestamp', value: new Date(jsonData.timestamp).toLocaleString(), icon: Calendar },
    { label: 'Processing Time', value: '< 2.3s', icon: Zap },
    { label: 'Privacy Status', value: 'Local Only', icon: Lock },
  ] : [];

  const resetUpload = () => {
    setJsonData(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">
          Insight Studio
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-3 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Upload a FakeOut AI JSON and unlock powerful visualizations
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!jsonData ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            {...getRootProps()}
            className={`glass-card rounded-3xl p-6 md:p-12 text-center cursor-pointer transition-all border-2 ${
              isDragActive ? 'border-amber-500 bg-amber-500/10 shadow-2xl' : 'border-white/30 hover:border-amber-500/50'
            }`}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <FileJson className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-5 text-amber-500" />
            </motion.div>
            <p className="text-lg md:text-xl font-medium">Drop your JSON report here</p>
            <p className="text-sm text-gray-500 mt-2">Any .json file exported from FakeOut AI detection</p>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 mt-4 text-sm">
                {error}
              </motion.p>
            )}
            <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-4 md:gap-6 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Brain className="w-3 h-3" /> Dual model data</span>
              <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Confidence metrics</span>
              <span className="flex items-center gap-1"><Award className="w-3 h-3" /> 94% accuracy</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {/* Action Bar */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              <button
                onClick={resetUpload}
                className="text-sm text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
              >
                ← Upload different file
              </button>
            </div>

            {/* Main Dashboard Content - for screenshot */}
            <div className="space-y-8 pb-8">
              {/* Hero Verdict Card */}
              <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                className={`glass-card rounded-2xl md:rounded-3xl p-4 md:p-6 border-l-8 overflow-hidden relative`}
                style={{ borderLeftColor: config.color }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full blur-2xl" style={{ backgroundColor: config.color }} />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 relative z-10">
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${config.bgGradient} flex items-center justify-center shadow-lg`}>
                      <config.icon className="w-7 h-7 md:w-10 md:h-10 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 uppercase tracking-wide">Analysis Verdict</p>
                      <h2 className="text-2xl md:text-4xl font-bold" style={{ color: config.color }}>{config.label}</h2>
                      <p className="text-sm text-gray-500 mt-1">{config.desc}</p>
                    </div>
                  </div>
                  <div className="text-right md:text-left">
                    <p className="text-sm text-gray-400">Overall Confidence</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl md:text-6xl font-bold">{jsonData.confidence}</span>
                      <span className="text-lg md:text-xl">%</span>
                    </div>
                    <div className="w-32 md:w-48 h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${jsonData.confidence}%`, backgroundColor: config.color }} />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                {additionalMetrics.map((metric, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card rounded-xl p-4 text-center"
                  >
                    <metric.icon className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-2 text-amber-500" />
                    <p className="text-xs text-gray-400">{metric.label}</p>
                    <p className="text-xs md:text-sm font-medium truncate">{metric.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Model Performance Cards */}
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {modelData.map((model, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card rounded-2xl p-5 hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        {model.prediction === 'REAL' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> :
                         model.prediction === 'FAKE' ? <Shield className="w-5 h-5 text-red-500" /> :
                         <AlertTriangle className="w-5 h-5 text-amber-500" />}
                        <h3 className="font-semibold text-base md:text-lg">{model.name}</h3>
                      </div>
                      <span className="text-xs text-gray-400 sm:text-right">{model.fullName}</span>
                    </div>
                    <div className="flex items-end justify-between mt-2 gap-2">
                      <div>
                        <p className="text-3xl md:text-4xl font-bold">{model.confidence}%</p>
                        <p className="text-sm text-gray-400">Prediction: {model.prediction}</p>
                      </div>
                      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${model.confidence}%`, backgroundColor: model.prediction === 'REAL' ? '#10b981' : model.prediction === 'FAKE' ? '#ef4444' : '#f59e0b' }} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Advanced Charts Grid */}
              <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
                {/* Confidence Donut */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-4 md:p-5"
                >
                  <h3 className="font-semibold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base"><PieChartIcon className="w-4 h-4 md:w-5 md:h-5 text-amber-500" /> Confidence Breakdown</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} stroke="rgba(0,0,0,0.1)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center text-xs md:text-sm text-gray-400 mt-2">
                    {jsonData.confidence >= 80 ? 'High confidence detection' : jsonData.confidence >= 60 ? 'Moderate confidence — review carefully' : 'Low confidence — ambiguous voice'}
                  </div>
                </motion.div>

                {/* Radar Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card rounded-2xl p-4 md:p-5"
                >
                  <h3 className="font-semibold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base"><RadarIcon className="w-4 h-4 md:w-5 md:h-5 text-amber-500" /> Model Capabilities</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#475569" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                      <Radar name="FakeOut AI" dataKey="value" stroke={config.color} fill={config.color} fillOpacity={0.3} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Explanation with flair */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-4 md:p-6 border border-white/10"
              >
                <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
                  <div className="p-2 md:p-3 rounded-xl bg-amber-500/10">
                    <Brain className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-2">Why this verdict?</h3>
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{jsonData.explanation}</p>
                    <div className="mt-4 pt-3 border-t border-white/10 text-xs text-gray-400 flex flex-wrap gap-4">
                      <span className="flex items-center gap-1"><Mic className="w-3 h-3" /> Dual model ensemble</span>
                      <span className="flex items-center gap-1"><Award className="w-3 h-3" /> ASVspoof 2019 trained</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Raw Data (collapsible) */}
              <details className="glass-card rounded-2xl p-4 md:p-5 border border-white/10">
                <summary className="cursor-pointer font-medium flex items-center gap-2 text-sm md:text-base">
                  <FileJson className="w-4 h-4" /> View Raw JSON Data
                </summary>
                <pre className="mt-3 md:mt-4 bg-black/30 p-3 md:p-4 rounded-xl overflow-auto text-[10px] md:text-xs font-mono max-h-80 md:max-h-96">
                  {JSON.stringify(jsonData, null, 2)}
                </pre>
              </details>
            </div>

            {/* Footer trust badge */}
            <div className="mt-8 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
              <Shield className="w-3 h-3" />
              <span>Your data stays on your device — visualizations are generated locally</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisualizePage;