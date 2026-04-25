import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Zap,
  Activity,
  Users,
  Award,
} from 'lucide-react';
import logo from '../assets/logo.png';

const LandingPage = () => {
  const stats = [
    { value: '94%', label: 'Detection Accuracy', icon: Award },
    { value: '< 3s', label: 'Analysis Time', icon: Zap },
    { value: '50K+', label: 'Samples Analyzed', icon: Activity },
    { value: '2+', label: 'Active Users', icon: Users },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        <div className="absolute left-0 top-0 h-full w-full opacity-30">
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-amber-500/20"
                />
              </pattern>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#glow)" />
          </svg>
        </div>
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-red-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-left"
          >
            <div className="mb-6 inline-flex items-center rounded-full glass-card px-3 py-1">
              <Shield className="mr-2 h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Stop AI Voice Scams</span>
            </div>

          <div className="relative inline-block">

  {/* glow */}
  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 opacity-60 blur" />

  {/* main title box */}
  <div className="relative rounded-2xl bg-white px-6 py-4 dark:bg-gray-900 shadow-md">
    <h1 className="text-5xl font-bold lg:text-7xl leading-none">
      <span className="bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">
        FakeOut AI
      </span>
    </h1>
  </div>

  {/* 🔥 OUTSIDE SUBSCRIPT (right side) */}


</div> 

            <p className="mt-6 max-w-xl text-xl text-gray-600 dark:text-gray-300">
              Real-time voice deepfake detection. Upload any audio and know instantly if it&apos;s
              real or AI-generated before scammers strike.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/detect"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 px-8 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105"
              >
                Start Detection
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center justify-center rounded-full border border-white/20 glass-card px-8 py-3 font-semibold transition-colors hover:bg-white/10"
              >
                Explore Features
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/20 glass-card p-3 text-center">
                  <stat.icon className="mx-auto mb-1 h-5 w-5 text-amber-500" />
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-1 justify-center"
          >
            <div className="relative h-72 w-72 lg:h-96 lg:w-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 opacity-30 blur-3xl animate-pulse" />
              <div className="relative flex h-full w-full items-center justify-center">
               <div className="relative h-72 w-72 lg:h-96 lg:w-96 flex items-center justify-center">

  {/* soft glow */}
  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 via-amber-500/20 to-emerald-500/20 blur-2xl" />

  {/* circular logo */}
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="relative rounded-full bg-white/10 backdrop-blur-lg p-6 shadow-xl border border-white/20 flex items-center justify-center"
  >
    <img
      src={logo}
      alt="FakeOut AI logo"
      className="h-50 w-45 object-contain"
    />
  </motion.div>

</div>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute right-0 top-0 h-12 w-12 rounded-full bg-red-500/40 blur-md"
              />
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-0 left-0 h-16 w-16 rounded-full bg-emerald-500/40 blur-md"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 -right-4 h-8 w-8 rounded-full bg-amber-500/50 blur-sm"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid gap-6 md:grid-cols-3"
        >
          <div className="rounded-2xl border-l-8 border-emerald-500/30 glass-card p-5">
            <div className="mb-2 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="font-bold text-emerald-500">LIKELY REAL</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Natural voice patterns detected</p>
          </div>
          <div className="rounded-2xl border-l-8 border-amber-500/30 glass-card p-5">
            <div className="mb-2 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span className="font-bold text-amber-500">SUSPICIOUS</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Mixed signals, verify further</p>
          </div>
          <div className="rounded-2xl border-l-8 border-red-500/30 glass-card p-5">
            <div className="mb-2 flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-500" />
              <span className="font-bold text-red-500">HIGH RISK</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">AI-generated voice detected</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
