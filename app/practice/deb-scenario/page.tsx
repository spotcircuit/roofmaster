'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { practiceScenarios } from '@/lib/gameData';

const debScenario = practiceScenarios.deb;

interface ConversationEntry {
  role: 'user' | 'ai';
  message: string;
  score?: number;
}

export default function DebScenarioPractice() {
  const [phase, setPhase] = useState(0);
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start with AI's first message
    if (conversation.length === 0) {
      setConversation([{
        role: 'ai',
        message: debScenario.phases[0].ai
      }]);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const analyzeResponse = (response: string): { score: number; feedback: string } => {
    const currentPhaseData = debScenario.phases[phase];
    let score = 0;
    let feedbackText = '';

    // Check for key elements based on hints
    if (phase === 0) {
      // Phase 1: Should start with non-roof topic
      if (!response.toLowerCase().includes('roof') &&
          (response.toLowerCase().includes('garden') ||
           response.toLowerCase().includes('neighborhood') ||
           response.toLowerCase().includes('weather') ||
           response.toLowerCase().includes('roses'))) {
        score += 40;
        feedbackText = 'Great job starting with a non-roof topic! ';
      }
      if (response.toLowerCase().includes('understand') ||
          response.toLowerCase().includes('totally get')) {
        score += 30;
        feedbackText += 'Good empathy shown. ';
      }
      if (response.includes('!') || response.includes('😊')) {
        score += 30;
        feedbackText += 'Nice positive energy! ';
      }
    } else if (phase === 1) {
      // Phase 2: Building on connection and gentle transition
      if (response.toLowerCase().includes('5 years') ||
          response.toLowerCase().includes('five years')) {
        score += 30;
        feedbackText = 'Good job acknowledging what she shared! ';
      }
      if (response.toLowerCase().includes('by the way') ||
          response.toLowerCase().includes('noticed')) {
        score += 40;
        feedbackText += 'Smooth transition to business. ';
      }
      if (response.toLowerCase().includes('no pressure') ||
          response.toLowerCase().includes('no obligation')) {
        score += 30;
        feedbackText += 'Great low-pressure approach! ';
      }
    }

    return { score, feedback: feedbackText || 'Try incorporating more elements from the hints.' };
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    // Add user message
    const newConversation = [...conversation, {
      role: 'user' as const,
      message: userInput
    }];

    // Analyze response
    const { score, feedback: phaseFeedback } = analyzeResponse(userInput);
    setTotalScore(prev => prev + score);
    setFeedback(prev => [...prev, phaseFeedback]);

    // Simulate AI typing
    setIsTyping(true);
    setConversation(newConversation);
    setUserInput('');

    setTimeout(() => {
      // Move to next phase or complete
      if (phase < debScenario.phases.length - 1) {
        setPhase(phase + 1);
        setConversation([...newConversation, {
          role: 'ai',
          message: debScenario.phases[phase + 1].ai
        }]);
      } else {
        // Session complete
        setSessionComplete(true);
      }
      setIsTyping(false);
    }, 1500);
  };

  const resetPractice = () => {
    setPhase(0);
    setConversation([{
      role: 'ai',
      message: debScenario.phases[0].ai
    }]);
    setTotalScore(0);
    setSessionComplete(false);
    setFeedback([]);
  };

  const getScoreColor = (score: number) => {
    if (score >= 180) return 'text-green-400';
    if (score >= 120) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 180) return '🏆';
    if (score >= 120) return '👍';
    return '💪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {debScenario.title}
              </h1>
              <p className="text-blue-200">{debScenario.description}</p>
              <div className="mt-2">
                <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm border border-red-500/30">
                  {debScenario.difficulty}
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{totalScore}</div>
              <div className="text-sm text-blue-200">Score</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-blue-200 mb-2">
              <span>Progress</span>
              <span>Phase {phase + 1} of {debScenario.phases.length}</span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${((phase + 1) / debScenario.phases.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden"
        >
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {conversation.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md px-4 py-3 rounded-2xl ${
                    entry.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-black/30 text-white border border-white/10'
                  }`}>
                    <div className="text-xs mb-1 opacity-70">
                      {entry.role === 'user' ? 'You' : 'Deb'}
                    </div>
                    <div>{entry.message}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-black/30 px-4 py-3 rounded-2xl border border-white/10">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </motion.div>
            )}

            {sessionComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Practice Complete! {getScoreEmoji(totalScore)}
                </h3>
                <div className={`text-3xl font-bold ${getScoreColor(totalScore)} mb-4`}>
                  Final Score: {totalScore}/200
                </div>

                <div className="space-y-2 mb-4">
                  <h4 className="text-white font-semibold">Feedback:</h4>
                  {feedback.map((fb, i) => (
                    <div key={i} className="text-green-200 text-sm">
                      • Phase {i + 1}: {fb}
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4">
                  <h4 className="text-white font-semibold">Scoring Criteria Met:</h4>
                  {debScenario.scoringCriteria.map((criteria, i) => (
                    <div key={i} className="text-blue-200 text-sm">
                      ✓ {criteria}
                    </div>
                  ))}
                </div>

                <button
                  onClick={resetPractice}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          {!sessionComplete && (
            <div className="p-6 border-t border-white/10">
              {/* Hints */}
              <div className="mb-4">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {showHints ? 'Hide' : 'Show'} Hints 💡
                </button>

                <AnimatePresence>
                  {showHints && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30"
                    >
                      <div className="text-sm text-blue-200 space-y-1">
                        {debScenario.phases[phase].hints.map((hint, i) => (
                          <div key={i}>• {hint}</div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input Field */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Type your response..."
                  className="flex-1 px-4 py-3 bg-black/30 text-white rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none placeholder-blue-200/50"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSubmit}
                  disabled={isTyping || !userInput.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Perfect Response Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10"
        >
          <details className="cursor-pointer">
            <summary className="text-sm text-cyan-400 font-semibold">View Perfect Response (Phase {phase + 1})</summary>
            <p className="mt-2 text-sm text-blue-200 italic">
              "{debScenario.phases[phase].perfectResponse}"
            </p>
          </details>
        </motion.div>
      </div>
    </div>
  );
}