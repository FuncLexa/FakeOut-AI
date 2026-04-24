// src/pages/Dashboard.jsx
import { useDetection } from '../context/DetectionContext';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Shield, Activity } from 'lucide-react';

const Dashboard = () => {
  const { history } = useDetection();

  const stats = {
    total: history.length,
    real: history.filter(r => r.verdict === 'likely_real').length,
    fake: history.filter(r => r.verdict === 'high_risk').length,
    suspicious: history.filter(r => r.verdict === 'suspicious').length,
    avgConfidence: history.length ? Math.round(history.reduce((acc, r) => acc + r.confidence, 0) / history.length) : 0,
  };

  const pieData = [
    { name: 'Likely Real', value: stats.real, color: '#10b981' },
    { name: 'Suspicious', value: stats.suspicious, color: '#f59e0b' },
    { name: 'High Risk', value: stats.fake, color: '#ef4444' },
  ];

  const timelineData = history.slice().reverse().map((r, i) => ({
    index: i + 1,
    confidence: r.confidence,
    verdict: r.verdict,
  }));

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'likely_real': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'high_risk': return <Shield className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Overview of your detection activity</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-xl p-4 text-center">
          <Activity className="w-6 h-6 mx-auto mb-2 text-amber-500" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Scans</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <CheckCircle className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
          <p className="text-2xl font-bold">{stats.real}</p>
          <p className="text-sm text-gray-500">Real Voices</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Shield className="w-6 h-6 mx-auto mb-2 text-red-500" />
          <p className="text-2xl font-bold">{stats.fake}</p>
          <p className="text-sm text-gray-500">AI Detected</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-amber-500" />
          <p className="text-2xl font-bold">{stats.avgConfidence}%</p>
          <p className="text-sm text-gray-500">Avg Confidence</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Detection Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Confidence Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="index" tick={{ fill: '#9ca3af' }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="confidence" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        {history.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No detection history yet. Upload your first audio file to get started.</p>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 10).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-3">
                  {getVerdictIcon(item.verdict)}
                  <div>
                    <p className="font-medium text-sm">{item.filename || 'Audio File'}</p>
                    <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.confidence}%</p>
                  <p className="text-xs text-gray-500">{item.verdict === 'likely_real' ? 'REAL' : item.verdict === 'high_risk' ? 'FAKE' : 'SUSPICIOUS'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
