'use client';

import { useRouter } from 'next/navigation';
import { useStackApp, useUser } from '@stackframe/stack';
import { useEffect, useState } from 'react';
import QuizTakeModal from '@/components/QuizTakeModal';
import { useData } from '@/lib/context/DataContext';

export default function HomePage() {
  const router = useRouter();
  const app = useStackApp();
  const user = useUser();
  const {
    videos,
    quizzes,
    isAdmin,
    isLoadingVideos,
    isLoadingQuizzes
  } = useData();

  const [selectedQuiz, setSelectedQuiz] = useState<{ id: string; title: string } | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);

  useEffect(() => {
    // If not logged in, redirect to Stack Auth
    if (user === null) {
      app.redirectToSignIn();
    }
  }, [user, app]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-amber-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const startQuiz = (quiz: any) => {
    setSelectedQuiz({ id: quiz.id, title: quiz.title });
    setShowQuizModal(true);
  };

  const startPracticeLab = () => {
    // Start with the first available quiz for practice
    if (quizzes.length > 0) {
      startQuiz(quizzes[0]);
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

  // Get first 3 videos for learning path
  const learningPathVideos = videos.slice(0, 3);

  // Show dashboard for logged-in users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                RoofMaster 24-7
              </h1>
              <p className="text-sm text-gray-400 mt-1">Master your roofing sales skills</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {user && (
                <>
                  <span className="text-sm text-gray-400 self-center">
                    {user.primaryEmail}
                  </span>
                  <button
                    onClick={() => app.redirectToSignOut()}
                    className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all duration-200 border border-red-600/30 text-center"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-8 mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.displayName || user.primaryEmail?.split('@')[0]}!
          </h2>
          <p className="text-gray-400 text-lg">Your journey to sales excellence continues here.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Navigation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Training Videos */}
              <button
                onClick={() => router.push('/training')}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-blue-500/30 transition-all duration-300 text-left relative"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="p-3 bg-blue-500/20 rounded-xl mb-4 inline-block group-hover:scale-110 transition-transform">
                      <span className="text-2xl">📹</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Training Videos</h3>
                    <p className="text-sm text-gray-400">Watch expert sales training content</p>
                  </div>
                  <span className="text-blue-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
                </div>
                {!isLoadingVideos && videos.length > 0 && (
                  <div className="absolute top-4 right-4 bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                    {videos.length} available
                  </div>
                )}
              </button>

              {/* Practice Lab */}
              <button
                onClick={startPracticeLab}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-green-500/30 transition-all duration-300 text-left relative"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="p-3 bg-green-500/20 rounded-xl mb-4 inline-block group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Practice Lab</h3>
                    <p className="text-sm text-gray-400">Test your knowledge with practice quizzes</p>
                  </div>
                  <span className="text-green-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
                </div>
                {!isLoadingQuizzes && quizzes.length > 0 && (
                  <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                    {quizzes.length} available
                  </div>
                )}
              </button>

              {/* AI Interactive - Placeholder */}
              <button
                onClick={() => alert('AI Role-Play coming soon!')}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-purple-500/30 transition-all duration-300 text-left"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="p-3 bg-purple-500/20 rounded-xl mb-4 inline-block group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">AI Role-Play</h3>
                    <p className="text-sm text-gray-400">Practice with AI-powered customer interactions</p>
                  </div>
                  <span className="text-purple-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>

              {/* Admin Card - Only show if admin */}
              {isAdmin && (
                <button
                  onClick={() => router.push('/admin')}
                  className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-red-500/30 transition-all duration-300 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="p-3 bg-red-500/20 rounded-xl mb-4 inline-block group-hover:scale-110 transition-transform">
                        <span className="text-2xl">⚙️</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Admin Panel</h3>
                      <p className="text-sm text-gray-400">Manage users, content, and platform settings</p>
                    </div>
                    <span className="text-red-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </button>
              )}
            </div>

            {/* Quizzes Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Available Quizzes</h2>
                {!isLoadingQuizzes && quizzes.length > 0 && (
                  <span className="text-sm text-gray-400">{quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} available</span>
                )}
              </div>

              {isLoadingQuizzes ? (
                <div className="text-center py-8">
                  <div className="text-gray-400">Loading quizzes...</div>
                </div>
              ) : quizzes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quizzes.slice(0, 4).map((quiz) => (
                    <div
                      key={quiz.id}
                      className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-white/10 rounded-lg p-4 hover:from-slate-700/40 hover:to-slate-800/40 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-semibold">{quiz.title}</h3>
                        <span className={`text-xs ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{quiz.description}</p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500">
                          {quiz.questionCount} questions
                        </span>
                        {quiz.isCompleted && (
                          <span className="text-xs text-green-400">Completed</span>
                        )}
                      </div>

                      <button
                        onClick={() => startQuiz(quiz)}
                        className="w-full px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-200 text-sm font-medium border border-blue-600/30"
                      >
                        {quiz.isCompleted ? 'Retake Quiz' : 'Start Quiz'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm">No quizzes available yet</p>
                    <p className="text-xs text-gray-500 mt-1">Check back later for new quizzes</p>
                  </div>
                </div>
              )}

              {quizzes.length > 4 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => router.push('/practice')}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View all {quizzes.length} quizzes →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Progress & Recent Activity */}
          <div className="space-y-6">
            {/* Learning Path */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Your Learning Path
              </h3>
              <div className="space-y-3">
                {isLoadingVideos ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-400">Loading videos...</p>
                  </div>
                ) : learningPathVideos.length > 0 ? (
                  learningPathVideos.map((video, index) => (
                    <div key={video.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${video.completed ? 'bg-green-500/20' : index === 0 ? 'bg-blue-500/20' : 'bg-gray-600/20'} rounded-full flex items-center justify-center`}>
                        {video.completed ? (
                          <span className="text-xs text-green-400">✓</span>
                        ) : (
                          <span className="text-xs">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${index === 0 || video.completed ? 'text-white' : 'text-gray-500'}`}>
                          {video.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {video.completed ? 'Completed' : index === 0 ? 'Ready to start' : 'Locked'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-400">No videos available</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => router.push('/training')}
                className="mt-4 w-full px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-200 border border-blue-600/30 text-center"
              >
                Continue Learning
              </button>
            </div>

            {/* Recent Achievements */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                Achievements
              </h3>
              <div className="text-center py-8">
                <div className="text-gray-500 mb-2">
                  <span className="text-4xl">🏆</span>
                </div>
                <p className="text-sm text-gray-400">Complete your first module to earn achievements!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 mt-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Daily Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <span className="text-2xl mb-2 block">💡</span>
              <h4 className="font-medium text-white mb-1">Practice Makes Perfect</h4>
              <p className="text-sm text-gray-400">Spend at least 30 minutes daily on training modules for best results</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <span className="text-2xl mb-2 block">🎯</span>
              <h4 className="font-medium text-white mb-1">Set Goals</h4>
              <p className="text-sm text-gray-400">Complete one module per week to maintain consistent progress</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <span className="text-2xl mb-2 block">🤝</span>
              <h4 className="font-medium text-white mb-1">Apply What You Learn</h4>
              <p className="text-sm text-gray-400">Practice new techniques in real scenarios for better retention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {selectedQuiz && (
        <QuizTakeModal
          isOpen={showQuizModal}
          onClose={() => {
            setShowQuizModal(false);
            setSelectedQuiz(null);
          }}
          quizId={selectedQuiz.id}
          quizTitle={selectedQuiz.title}
        />
      )}
    </div>
  );
}