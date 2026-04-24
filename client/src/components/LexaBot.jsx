import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import Groq from 'groq-sdk';

const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
const groq = groqApiKey
  ? new Groq({
      apiKey: groqApiKey,
      dangerouslyAllowBrowser: true,
    })
  : null;

const LexaBot = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const messagesEndRef = useRef(null);

  const systemPrompt = `You are LexaBot, an AI voice deepfake detection expert.

Detection result:
${JSON.stringify(result, null, 2)}

Your role: Answer user questions about this detection result.
Keep answers:
- Simple and practical
- Based strictly on the given result
- Concise (2-3 sentences max)
- Friendly but professional

If user asks "Why is this fake?", explain the key indicators from the result.
If user asks "Explain in simple terms", simplify the technical explanation.
If user asks "What should I do next?", give actionable advice.
For other questions, answer based on the result.`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-send initial question when chat opens
  useEffect(() => {
    if (isOpen && !initialMessageSent && messages.length === 0 && groq) {
      setInitialMessageSent(true);
      const autoQuestion = `Why is this ${
        result.verdict === 'likely_real'
          ? 'real'
          : result.verdict === 'high_risk'
          ? 'fake'
          : 'suspicious'
      }? Explain in simple terms.`;
      setInput(autoQuestion);
      // Automatically send after a tiny delay to allow UI to settle
      setTimeout(() => {
        handleSend(autoQuestion);
      }, 100);
    }
  }, [isOpen, initialMessageSent, messages.length]);

  const handleSend = async (forcedQuestion = null) => {
    const question = forcedQuestion !== null ? forcedQuestion : input;
    if (!question.trim() || loading) return;

    const userMessage = { role: 'user', content: question };
    setMessages((prev) => [...prev, userMessage]);
    if (forcedQuestion === null) setInput('');

    if (!groq) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'LexaBot needs a Groq API key. Add `VITE_GROQ_API_KEY` to your environment.',
        },
      ]);
      return;
    }

    setLoading(true);

    // Build conversation history (include system prompt + previous messages)
    const conversation = [
      { role: 'system', content: systemPrompt },
      ...messages,
      userMessage,
    ];

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: conversation,
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 250,
      });

      const reply =
        chatCompletion.choices[0]?.message?.content ||
        "Sorry, I couldn't generate a response.";

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('Groq API error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Oops, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    `Why is this ${
      result.verdict === 'likely_real'
        ? 'real'
        : result.verdict === 'high_risk'
        ? 'fake'
        : 'suspicious'
    }?`,
    'Explain in simple terms',
    'What should I do next?',
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open LexaBot"
        className="fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 p-3 text-white shadow-lg transition hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-96 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-red-50 to-amber-50 p-4 dark:border-gray-800 dark:from-red-950/20 dark:to-amber-950/20">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-amber-600" />
                <span className="font-semibold text-gray-900 dark:text-white">LexaBot</span>
                <span className="text-xs text-gray-500">AI Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages container with custom scrollbar class */}
            <div className="chat-scroll h-96 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && !loading && (
                <div className="mt-8 text-center text-sm text-gray-500">
                  <Bot className="mx-auto mb-2 h-10 w-10 opacity-50" />
                  <p>LexaBot is analysing your result...</p>
                  {!groq && (
                    <p className="mx-auto mt-2 max-w-xs text-xs text-amber-600 dark:text-amber-400">
                      Add `VITE_GROQ_API_KEY` to enable live answers.
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(suggestion)}
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-2 ${
                      message.role === 'user'
                        ? 'rounded-br-none bg-amber-500 text-white'
                        : 'rounded-bl-none bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg rounded-bl-none bg-gray-100 p-2 dark:bg-gray-800">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about this result..."
                  className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-gray-700 dark:bg-gray-800"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="rounded-lg bg-gradient-to-r from-red-500 to-amber-500 p-2 text-white disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-gray-400">
                Powered by LexaChat&nbsp;•&nbsp; Context‑aware
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LexaBot;