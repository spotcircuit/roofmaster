'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStackApp, useUser } from '@stackframe/stack';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalVideos: number;
  totalQuizzes: number;
  averageComprehension: number;
  completionRate: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalVideos: 0,
    totalQuizzes: 0,
    averageComprehension: 0,
    completionRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const app = useStackApp();
  const user = useUser();

  useEffect(() => {
    // If not logged in, redirect to Stack Auth
    if (user === null) {
      app.redirectToSignIn();
    }
  }, [user, app]);

  useEffect(() => {
    // Layout already handles auth check, just fetch dashboard data
    if (user) {
      setIsAdmin(true); // Layout ensures only admins reach this page
      setIsLoading(false);
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
      } else {
        console.error('Failed to fetch dashboard data');
        // Fallback to empty data
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          totalVideos: 0,
          totalQuizzes: 0,
          averageComprehension: 0,
          completionRate: 0,
        });
        setRecentActivity([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to empty data
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        totalVideos: 0,
        totalQuizzes: 0,
        averageComprehension: 0,
        completionRate: 0,
      });
      setRecentActivity([]);
    }
  };

  const quickActions = [
    { title: 'Upload Video', icon: '📹', href: '/admin/videos', color: 'bg-blue-500' },
    { title: 'Manage Quizzes', icon: '📝', href: '/admin/quizzes', color: 'bg-yellow-500' },
    { title: 'Manage Users', icon: '👥', href: '/admin/users', color: 'bg-green-500' },
    { title: 'View Reports', icon: '📊', href: '/admin/reports', color: 'bg-purple-500' },
  ];

  // Show loading while checking auth
  if (!user || isLoading) {
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
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-400 mt-1">RoofMaster 24-7 Training Platform</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-200 border border-blue-600/30 text-center"
              >
                User Dashboard
              </button>
              <button
                onClick={() => app.redirectToSignOut()}
                className="w-full sm:w-auto px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all duration-200 border border-red-600/30 text-center"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 backdrop-blur-sm rounded-xl border border-blue-500/30 p-4 sm:p-6 hover:border-blue-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300/80">Total Users</p>
                <p className="text-4xl font-bold text-white mt-2">{stats.totalUsers}</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-green-400">
                    {stats.activeUsers} active today
                  </p>
                </div>
              </div>
              <div className="p-4 bg-blue-500/20 rounded-xl">
                <span className="text-3xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 backdrop-blur-sm rounded-xl border border-emerald-500/30 p-4 sm:p-6 hover:border-emerald-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-300/80">Training Content</p>
                <p className="text-4xl font-bold text-white mt-2">{stats.totalVideos}</p>
                <p className="text-sm text-emerald-400 mt-3">
                  {stats.totalQuizzes} quizzes available
                </p>
              </div>
              <div className="p-4 bg-emerald-500/20 rounded-xl">
                <span className="text-3xl">📚</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-sm rounded-xl border border-purple-500/30 p-4 sm:p-6 hover:border-purple-400/50 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-300/80">Avg Comprehension</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-4xl font-bold text-white">{stats.averageComprehension}</p>
                  <span className="text-xl text-purple-300">%</span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-purple-900/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-purple-300 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-purple-400 mt-1">{stats.completionRate}% completion</p>
                </div>
              </div>
              <div className="p-4 bg-purple-500/20 rounded-xl">
                <span className="text-3xl">🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 text-center sm:text-left">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-center"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-xl sm:text-2xl">{action.icon}</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-200">{action.title}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Content Management
            </h2>
            <div className="space-y-3">
              <Link href="/admin/videos" className="block p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 border border-white/10 hover:border-blue-500/30 transition-all duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-white">Video Management</p>
                    <p className="text-sm text-gray-400 mt-1">Upload and manage training videos</p>
                  </div>
                  <span className="text-blue-400 text-xl">→</span>
                </div>
              </Link>
              <Link href="/admin/quizzes" className="block p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 border border-white/10 hover:border-blue-500/30 transition-all duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-white">Quiz Management</p>
                    <p className="text-sm text-gray-400 mt-1">Create quizzes with CSV bulk upload</p>
                  </div>
                  <span className="text-blue-400 text-xl">→</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              AI & Analytics
            </h2>
            <div className="space-y-3">
              <Link href="/admin/comprehension" className="block p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-white">Comprehension Monitoring</p>
                    <p className="text-sm text-gray-400 mt-1">AI-powered comprehension tracking</p>
                  </div>
                  <span className="text-purple-400 text-xl">→</span>
                </div>
              </Link>
              <Link href="/admin/reports" className="block p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-white">Performance Reports</p>
                    <p className="text-sm text-gray-400 mt-1">Detailed analytics and insights</p>
                  </div>
                  <span className="text-purple-400 text-xl">→</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-white/10">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-white/5 transition-colors duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-white">
                      <span className="text-cyan-400">{activity.user}</span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-gray-300">{activity.action}</span>
                    </p>
                    <p className="text-sm text-gray-400 mt-1">{activity.details}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10">
            <Link href="/admin/activity" className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
              View all activity →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}