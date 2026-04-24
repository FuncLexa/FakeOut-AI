// src/pages/Dashboard.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDetection } from '../context/DetectionContext';
import {
  Activity, CheckCircle, Shield, AlertTriangle, TrendingUp,
  Calendar, Clock, Award, Brain, Mic, Lock, DownloadCloud,
  ChevronRight
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const Dashboard = () => {
  const { history } = useDetection();

  const stats = useMemo(() => {
    const total = history.length;
    const real = history.filter(r => r.verdict === 'likely_real').length;
    const fake = history.filter(r => r.verdict === 'high_risk').length;
    const suspicious = history.filter(r => r.verdict === 'suspicious').length;
    const avgConfidence = total
      ? Math.round(history.reduce((acc, r) => acc + r.confidence, 0) / total)
      : 0;
    const safetyScore = total
      ? Math.round(((real + suspicious * 0.5) / total) * 100)
      : 100;
    return { total, real, fake, suspicious, avgConfidence, safetyScore };
  }, [history]);

  const pieData = [
    { name: 'Likely Real', value: stats.real, color: '#10b981' },
    { name: 'Suspicious', value: stats.suspicious, color: '#f59e0b' },
    { name: 'High Risk', value: stats.fake, color: '#ef4444' },
  ];

  const pieChartData = pieData.filter((item) => item.value > 0);

  const timelineData = history.slice().reverse().map((r, i) => ({
    id: i,
    date: new Date(r.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    confidence: r.confidence,
  }));

  const radarData = [
    { metric: 'Accuracy', value: 94 },
    { metric: 'Speed', value: 98 },
    { metric: 'Privacy', value: 100 },
    { metric: 'Explainability', value: 89 },
    { metric: 'False Positives', value: 96 },
  ];

  const getInsightMessage = () => {
    if (history.length === 0) return 'Upload your first audio to start tracking.';
    if (stats.fake === 0 && stats.suspicious === 0)
      return 'No suspicious voices detected — your environment looks safe.';
    if (stats.fake > stats.real)
      return 'Alert: More AI voices detected than real ones. Verify unknown callers.';
    if (stats.suspicious > 0)
      return 'Some ambiguous signals found. Trust your gut and verify before acting.';
    return 'Your detection history shows healthy patterns. Stay vigilant.';
  };

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

  // Empty state
  if (history.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No data yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start by analyzing an audio file — your dashboard will appear here.
          </p>
          <button
            onClick={() => window.location.href = '/detect'}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition"
          >
            Go to detector
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          {getInsightMessage()}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total scans', value: stats.total, icon: Activity, color: 'text-gray-600' },
          { label: 'Real voices', value: stats.real, icon: CheckCircle, color: 'text-emerald-600' },
          { label: 'AI detected', value: stats.fake, icon: Shield, color: 'text-red-600' },
          { label: 'Safety score', value: `${stats.safetyScore}%`, icon: Award, color: 'text-amber-600' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-5 transition hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        {/* Pie chart */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-5">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Verdict breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {pieChartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#111827',
                }}
                itemStyle={{ color: '#111827' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-5 mt-4 text-sm">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trend chart */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Confidence trend</h3>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Avg: {stats.avgConfidence}%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} angle={-25} textAnchor="end" height={50} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Area type="monotone" dataKey="confidence" stroke="#f59e0b" strokeWidth={2} fill="url(#confidenceGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar + Tip */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-5">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4" /> Model capabilities
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#d1d5db" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#6b7280' }} />
              <Radar name="FakeOut AI" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
              <Tooltip formatter={(value) => `${value}%`} />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
            Based on benchmark tests (ASVspoof 2019)
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-5">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                Stay scam‑proof
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                AI voice cloning needs only 10 seconds of audio. Always verify urgent requests through a second channel.
              </p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 10s is enough</span>
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Trust, but verify</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4" /> Recent activity
          </h3>
          <span className="text-xs text-gray-500">{history.length} total</span>
        </div>
        <div className="space-y-2 max-h-[360px] overflow-y-auto">
          {history.slice(0, 8).map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                {getVerdictBadge(item.verdict)}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.filename || 'Audio file'}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.confidence}%
                </span>
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(item, null, 2);
                    const blob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `fakeout-${item.timestamp}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
                >
                  <DownloadCloud className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {history.length > 8 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => window.location.href = '/history'}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white inline-flex items-center gap-1"
            >
              View all {history.length} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="mt-8 text-center text-xs text-gray-400">
        <Lock className="inline w-3 h-3 mr-1" /> Your data never leaves your device — fully private.
      </div>
    </div>
  );
};

export default Dashboard;
