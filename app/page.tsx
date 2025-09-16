'use client';

import { useRouter } from 'next/navigation';
import { useStackApp, useUser } from '@stackframe/stack';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const app = useStackApp();
  const user = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // If not logged in, redirect to Stack Auth
    if (user === null) {
      app.redirectToSignIn();
    }
  }, [user, app]);

  useEffect(() => {
    // Fetch user role from server
    if (user) {
      fetch('/api/user/role')
        .then(res => res.json())
        .then(data => {
          console.log('Role from API:', data.role);
          setIsAdmin(data.role === 'admin');
        })
        .catch(err => console.error('Error fetching role:', err));
    }
  }, [user]);

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }


  // Show dashboard for logged-in users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                RoofMaster 24-7 Training Platform
              </h1>
              <p className="text-sm text-gray-400 mt-1">Your Journey to Sales Excellence</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Welcome, {user.primaryEmail}
              </span>
              <button
                onClick={() => app.redirectToSignOut()}
                className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all duration-200 border border-red-600/30"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 backdrop-blur-sm rounded-xl border border-blue-500/30 p-4 sm:p-6 hover:border-blue-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300/80">Training Progress</p>
                <p className="text-3xl font-bold text-white mt-2">0%</p>
                <p className="text-sm text-blue-400 mt-2">0 of 12 modules</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 backdrop-blur-sm rounded-xl border border-emerald-500/30 p-4 sm:p-6 hover:border-emerald-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-300/80">Quiz Average</p>
                <p className="text-3xl font-bold text-white mt-2">--</p>
                <p className="text-sm text-emerald-400 mt-2">No quizzes taken</p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-sm rounded-xl border border-purple-500/30 p-4 sm:p-6 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-300/80">Quizzes Completed</p>
                <p className="text-3xl font-bold text-white mt-2">0</p>
                <p className="text-sm text-purple-400 mt-2">Take your first quiz!</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-600/20 to-amber-700/20 backdrop-blur-sm rounded-xl border border-amber-500/30 p-4 sm:p-6 hover:border-amber-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-300/80">Streak</p>
                <p className="text-3xl font-bold text-white mt-2">0</p>
                <p className="text-sm text-amber-400 mt-2">days</p>
              </div>
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <span className="text-2xl">🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Training Card */}
              <button
                onClick={() => router.push('/training')}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-blue-500/30 transition-all duration-300 text-left"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="p-3 bg-blue-500/20 rounded-xl mb-4 inline-block group-hover:scale-110 transition-transform">
                      <span className="text-2xl">📹</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Training Videos</h3>
                    <p className="text-sm text-gray-400">Watch comprehensive training modules and track your progress</p>
                  </div>
                  <span className="text-blue-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>

              {/* Practice Card */}
              <button
                onClick={() => router.push('/practice')}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-emerald-500/30 transition-all duration-300 text-left"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="p-3 bg-emerald-500/20 rounded-xl mb-4 inline-block group-hover:scale-110 transition-transform">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Quizzes</h3>
                    <p className="text-sm text-gray-400">Test your knowledge with comprehensive assessments</p>
                  </div>
                  <span className="text-emerald-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>

              {/* AI Interactive Card */}
              <button
                onClick={() => router.push('/ai-interactive')}
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
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-xs">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Introduction to Door-to-Door Sales</p>
                    <p className="text-xs text-gray-400">Not started</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-600/20 rounded-full flex items-center justify-center">
                    <span className="text-xs">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">Building Rapport</p>
                    <p className="text-xs text-gray-600">Locked</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-600/20 rounded-full flex items-center justify-center">
                    <span className="text-xs">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">Handling Objections</p>
                    <p className="text-xs text-gray-600">Locked</p>
                  </div>
                </div>
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
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
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
    </div>
  );
}