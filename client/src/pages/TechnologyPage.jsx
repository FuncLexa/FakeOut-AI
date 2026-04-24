import { GitBranch, BarChart3, BrainCircuit } from 'lucide-react';

const TechnologyPage = () => {
  const models = [
    {
      name: 'MFCC + XGBoost',
      icon: BarChart3,
      accuracy: '88–90%',
      description:
        'Extracts 40 acoustic fingerprint features. Human voices have natural imperfections; AI voices are unnaturally smooth.',
    },
    {
      name: 'wav2vec2 (Fine‑tuned)',
      icon: BrainCircuit,
      accuracy: '94–96%',
      description:
        "Facebook's pretrained speech model fine‑tuned on 22,000 AI‑generated voice samples from ASVspoof 2019.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
          How it works
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Two independent AI models work together to catch deepfakes with high accuracy.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {models.map((model, idx) => (
          <div
            key={idx}
            className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900/30 p-6"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <model.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {model.name}
            </h2>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-3">
              {model.accuracy}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {model.description}
            </p>
          </div>
        ))}
      </div>

      <div className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900/30 p-6">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ensemble logic</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
          Both models vote independently. FakeOut AI only flags <strong>HIGH RISK</strong> when both
          models agree — drastically reducing false positives. The result is a reliable,
          explainable detection system you can trust.
        </p>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-center text-sm text-gray-600 dark:text-gray-400 italic">
          “When in doubt, both models must agree — safety by consensus.”
        </div>
      </div>
    </div>
  );
};

export default TechnologyPage;