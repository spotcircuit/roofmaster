'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/lib/context/DataContext';

// Type definition for questions
type Question = {
  question: string;
  type: 'multiple_choice' | 'true_false' | 'open_ended';
  points: number;
  correctAnswer?: string;
  options?: string[];
  expectedKeywords?: string[];
};

interface QuizTakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
  quizTitle: string;
}

export default function QuizTakeModal({ isOpen, onClose, quizId, quizTitle }: QuizTakeModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);

  // Use cached quiz data from context
  const { getQuizById } = useData();

  // Fetch quiz data from cache or API
  useEffect(() => {
    const fetchQuizData = async () => {
      if (!isOpen || !quizId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Use cached quiz fetching
        const quiz = await getQuizById(quizId);
        if (quiz) {
          // Extract questions from the quiz data
          const quizQuestions = quiz.questions || [];
          const actualQuestions = quizQuestions.filter((q: any) => !q._metadata);
          setQuestions(actualQuestions);
        } else {
          console.error('Failed to fetch quiz data');
          setQuestions([]);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchQuizData();
      // Reset state when modal opens
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setShowResults(false);
      setQuizStarted(false);
    }
  }, [isOpen, quizId, getQuizById]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: answer });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizStarted(false);
  };

  const calculateScore = () => {
    let score = 0;
    let totalPoints = 0;

    questions.forEach((q, index) => {
      totalPoints += q.points;
      if (selectedAnswers[index] === q.correctAnswer) {
        score += q.points;
      }
    });

    return Math.round((score / totalPoints) * 100);
  };

  if (!isOpen) return null;

  const question = questions[currentQuestion];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-slate-800 rounded-2xl shadow-2xl border border-white/10 w-full max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {quizStarted ? 'Quiz in Progress' : 'Start Quiz'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">{quizTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-gray-400">Loading quiz...</div>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">No questions available for this quiz.</div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-colors border border-gray-600/30"
                >
                  Close
                </button>
              </div>
            ) : !quizStarted ? (
              /* Start Screen */
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 mb-6">
                  <span className="text-4xl">📝</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{quizTitle}</h3>
                <div className="space-y-2 text-gray-400 mb-8">
                  <p>{questions.length} Questions</p>
                  <p>Take your time - no time limit</p>
                  <p>You can retake this quiz anytime</p>
                </div>
                <button
                  onClick={() => setQuizStarted(true)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-500 hover:to-cyan-400 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 font-medium"
                >
                  Start Quiz
                </button>
              </div>
            ) : !showResults ? (
              <>
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span>{question.points} point{question.points > 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">
                    {question.question}
                  </h3>

                  {/* Multiple Choice */}
                  {question.type === 'multiple_choice' && (
                    <div className="space-y-3">
                      {question.options?.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(String.fromCharCode(65 + index))}
                          className={`w-full text-left p-4 rounded-lg border transition-all ${
                            selectedAnswers[currentQuestion] === String.fromCharCode(65 + index)
                              ? 'bg-blue-600/20 border-blue-500/50 text-white'
                              : 'bg-slate-700/30 border-white/10 text-gray-300 hover:bg-slate-700/50'
                          }`}
                        >
                          <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* True/False */}
                  {question.type === 'true_false' && (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleAnswer('true')}
                        className={`p-4 rounded-lg border transition-all ${
                          selectedAnswers[currentQuestion] === 'true'
                            ? 'bg-green-600/20 border-green-500/50 text-white'
                            : 'bg-slate-700/30 border-white/10 text-gray-300 hover:bg-slate-700/50'
                        }`}
                      >
                        <span className="text-2xl mb-2 block">✓</span>
                        True
                      </button>
                      <button
                        onClick={() => handleAnswer('false')}
                        className={`p-4 rounded-lg border transition-all ${
                          selectedAnswers[currentQuestion] === 'false'
                            ? 'bg-red-600/20 border-red-500/50 text-white'
                            : 'bg-slate-700/30 border-white/10 text-gray-300 hover:bg-slate-700/50'
                        }`}
                      >
                        <span className="text-2xl mb-2 block">✗</span>
                        False
                      </button>
                    </div>
                  )}

                  {/* Open-Ended */}
                  {question.type === 'open_ended' && (
                    <div>
                      <textarea
                        value={selectedAnswers[currentQuestion] || ''}
                        onChange={(e) => handleAnswer(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                        placeholder="Type your answer here..."
                      />
                      {question.expectedKeywords && (
                        <p className="text-xs text-gray-500 mt-2">
                          Your answer will be self-evaluated
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className="px-4 py-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={nextQuestion}
                    disabled={!selectedAnswers[currentQuestion]}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestion === questions.length - 1 ? 'Finish' : 'Next →'}
                  </button>
                </div>
              </>
            ) : (
              /* Results Screen */
              <div className="text-center py-8">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                  calculateScore() >= 70 ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  <span className="text-3xl">{calculateScore() >= 70 ? '✓' : '✗'}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Quiz Complete!
                </h2>
                <p className="text-lg text-gray-400 mb-2">
                  Your Score: <span className="font-bold text-white">{calculateScore()}%</span>
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  {calculateScore() >= 70
                    ? 'Great job! You passed the quiz.'
                    : 'Keep practicing! You can retake this quiz anytime.'}
                </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-600/30"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-colors border border-gray-600/30"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}