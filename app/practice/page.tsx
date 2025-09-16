'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStackApp, useUser } from '@stackframe/stack';

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timeLimit: number; // in minutes
  passingScore: number;
  attempts: number;
  bestScore?: number;
  lastAttempt?: string;
}

export default function PracticePage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: 'fundamentals',
      title: 'Door-to-Door Sales Fundamentals',
      description: 'Test your knowledge of basic sales principles and techniques',
      category: 'basics',
      difficulty: 'easy',
      questionCount: 20,
      timeLimit: 30,
      passingScore: 70,
      attempts: 0
    },
    {
      id: 'objection-handling',
      title: 'Mastering Objections',
      description: 'Practice handling common customer objections and concerns',
      category: 'objections',
      difficulty: 'medium',
      questionCount: 25,
      timeLimit: 45,
      passingScore: 75,
      attempts: 0
    },
    {
      id: 'closing-techniques',
      title: 'Advanced Closing Strategies',
      description: 'Master the art of closing deals and securing commitments',
      category: 'closing',
      difficulty: 'hard',
      questionCount: 30,
      timeLimit: 60,
      passingScore: 80,
      attempts: 0
    },
    {
      id: 'rapport-building',
      title: 'Building Customer Rapport',
      description: 'Learn to connect with customers and build trust quickly',
      category: 'rapport',
      difficulty: 'easy',
      questionCount: 15,
      timeLimit: 25,
      passingScore: 70,
      attempts: 0
    },
    {
      id: 'comprehensive-assessment',
      title: 'Comprehensive Sales Assessment',
      description: 'Complete evaluation covering all aspects of door-to-door sales',
      category: 'all',
      difficulty: 'hard',
      questionCount: 50,
      timeLimit: 90,
      passingScore: 85,
      attempts: 0
    }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const router = useRouter();
  const app = useStackApp();
  const user = useUser();

  useEffect(() => {
    // If not logged in, redirect to Stack Auth
    if (user === null) {
      app.redirectToSignIn();
    }
  }, [user, app]);

  const startQuiz = (quiz: Quiz) => {
    // In a real app, this would navigate to the quiz-taking page
    alert(`Starting quiz: ${quiz.title}`);
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const categoryMatch = selectedCategory === 'all' || quiz.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-500/30 bg-green-500/20';
      case 'medium': return 'text-amber-400 border-amber-500/30 bg-amber-500/20';
      case 'hard': return 'text-red-400 border-red-500/30 bg-red-500/20';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/20';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Quizzes
              </h1>
              <p className="text-sm text-gray-400 mt-1">Test your knowledge with comprehensive assessments</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="w-full sm:w-auto px-4 py-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-all duration-200 border border-gray-600/30 text-center"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all" className="bg-slate-800">All Categories</option>
              <option value="basics" className="bg-slate-800">Basics</option>
              <option value="rapport" className="bg-slate-800">Building Rapport</option>
              <option value="objections" className="bg-slate-800">Handling Objections</option>
              <option value="closing" className="bg-slate-800">Closing Techniques</option>
            </select>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all" className="bg-slate-800">All Difficulties</option>
              <option value="easy" className="bg-slate-800">Easy</option>
              <option value="medium" className="bg-slate-800">Medium</option>
              <option value="hard" className="bg-slate-800">Hard</option>
            </select>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">{quiz.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(quiz.difficulty)}`}>
                  {getDifficultyIcon(quiz.difficulty)} {quiz.difficulty}
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-4">{quiz.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Questions:</span>
                  <span className="text-gray-300">{quiz.questionCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Time Limit:</span>
                  <span className="text-gray-300">{quiz.timeLimit} minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Passing Score:</span>
                  <span className="text-gray-300">{quiz.passingScore}%</span>
                </div>
              </div>

              {quiz.attempts > 0 && (
                <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Best Score:</span>
                    <span className={quiz.bestScore && quiz.bestScore >= quiz.passingScore ? 'text-green-400' : 'text-amber-400'}>
                      {quiz.bestScore}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Attempts:</span>
                    <span className="text-gray-300">{quiz.attempts}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => startQuiz(quiz)}
                className="w-full px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-200 border border-blue-600/30"
              >
                {quiz.attempts > 0 ? 'Retake Quiz' : 'Start Quiz'}
              </button>
            </div>
          ))}
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">
              <span className="text-4xl">📝</span>
            </div>
            <p className="text-gray-400">No quizzes match your selected filters</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            How Quizzes Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <span className="text-2xl mb-2 block">📚</span>
              <h3 className="font-medium text-white mb-1">Comprehensive Testing</h3>
              <p className="text-sm text-gray-400">Each quiz covers multiple topics and scenarios to test your complete understanding</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <span className="text-2xl mb-2 block">⏱️</span>
              <h3 className="font-medium text-white mb-1">Timed Assessments</h3>
              <p className="text-sm text-gray-400">Practice under pressure with time limits that simulate real-world situations</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <span className="text-2xl mb-2 block">📈</span>
              <h3 className="font-medium text-white mb-1">Track Progress</h3>
              <p className="text-sm text-gray-400">Monitor your improvement with detailed scoring and performance history</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}