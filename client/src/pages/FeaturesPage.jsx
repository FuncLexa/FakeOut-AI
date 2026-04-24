// src/pages/FeaturesPage.jsx
import {
  Zap, Lock, Brain, BarChart, Download, FileJson,
  Globe, Shield, Mic, Clock, Sparkles, Layers
} from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    { icon: Zap, title: 'Lightning fast', desc: 'Under 3 seconds analysis time' },
    { icon: Lock, title: 'Privacy first', desc: 'No audio leaves your device' },
    { icon: Brain, title: 'Explainable AI', desc: 'Natural language explanations' },
    { icon: BarChart, title: '94% accuracy', desc: 'Trained on gold standard datasets' },
    { icon: Download, title: 'Export reports', desc: 'JSON & PDF formats' },
    { icon: FileJson, title: 'Data visualisation', desc: 'Upload JSON for insights' },
    { icon: Globe, title: 'Multi‑format', desc: 'WAV, MP3, M4A, OGG, FLAC' },
    { icon: Shield, title: 'Dual model', desc: 'Ensemble for low false positives' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Features
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Everything you need to protect yourself from AI voice scams
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900/30 p-5 transition hover:shadow-sm"
          >
            <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <feature.icon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesPage;