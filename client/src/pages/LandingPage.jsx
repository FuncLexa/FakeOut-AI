// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mic, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const verdicts = [
    { label: 'Likely Real', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Suspicious', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { label: 'High Risk', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-amber-500/5 to-emerald-500/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full glass-card mb-6">
              <Shield className="w-4 h-4 text-amber-500 mr-2" />
              <span className="text-sm font-medium">Stop AI Voice Scams Before They Start</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">
                FakeOut AI
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Real-time voice deepfake detection. Upload any audio and know instantly if it's real or AI-generated.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/detect"
                className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
              >
                Start Detection <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-3 rounded-full glass-card border border-white/20 font-semibold hover:bg-white/10 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="glass-card rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-2 mb-4">
                  <Mic className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold">How It Works</h3>
                </div>
                <div className="space-y-4">
                  {['Upload suspicious audio clip', 'Dual AI models analyze voice patterns', 'Get instant verdict + explanation'].map((step, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-emerald-500 text-white text-xs flex items-center justify-center">{i+1}</div>
                      <span className="text-gray-700 dark:text-gray-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card rounded-2xl p-6 border border-white/20">
                <h3 className="font-semibold mb-3">Verdict Types</h3>
                <div className="space-y-3">
                  {verdicts.map((v) => (
                    <div key={v.label} className={`flex items-center space-x-3 p-2 rounded-lg ${v.bg} border ${v.border}`}>
                      <v.icon className={`w-5 h-5 ${v.color}`} />
                      <span className="font-medium">{v.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powered by Dual AI Models</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-3 flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>MFCC + XGBoost</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Extracts 40 acoustic fingerprint features. Catches unnatural smoothness in AI voices.</p>
              <div className="text-sm text-gray-500">Accuracy: 88-90%</div>
            </div>
            <div className="glass-card rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-3 flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>wav2vec2 Fine-tuned</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Facebook's pretrained model fine-tuned on 22,000 AI samples from ASVspoof 2019.</p>
              <div className="text-sm text-gray-500">Accuracy: 94-96%</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
