'use client';

import { useRouter } from 'next/navigation';

export default function DevAdminPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard (Dev Mode)</h1>
            <div className="text-red-400 bg-red-400/10 px-3 py-1 rounded">
              AUTH BYPASSED - DEV ONLY
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => router.push('/admin/videos')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg p-6 transition-all duration-300 shadow-xl transform hover:scale-105"
            >
              <h2 className="text-xl font-bold mb-2">📹 Manage Videos</h2>
              <p className="text-sm opacity-90">Upload and manage training videos</p>
            </button>

            <button
              onClick={() => router.push('/admin/users')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg p-6 transition-all duration-300 shadow-xl transform hover:scale-105"
            >
              <h2 className="text-xl font-bold mb-2">👥 Manage Users</h2>
              <p className="text-sm opacity-90">View and manage user accounts</p>
            </button>

            <button
              onClick={() => router.push('/admin/quizzes')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg p-6 transition-all duration-300 shadow-xl transform hover:scale-105"
            >
              <h2 className="text-xl font-bold mb-2">📝 Manage Quizzes</h2>
              <p className="text-sm opacity-90">Create and edit quizzes</p>
            </button>

            <button
              onClick={() => router.push('/admin/analytics')}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg p-6 transition-all duration-300 shadow-xl transform hover:scale-105"
            >
              <h2 className="text-xl font-bold mb-2">📊 Analytics</h2>
              <p className="text-sm opacity-90">View training progress and scores</p>
            </button>

            <button
              onClick={() => router.push('/admin/manage-roles')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg p-6 transition-all duration-300 shadow-xl transform hover:scale-105"
            >
              <h2 className="text-xl font-bold mb-2">🔐 Manage Roles</h2>
              <p className="text-sm opacity-90">Assign admin privileges</p>
            </button>

            <button
              onClick={() => router.push('/admin/settings')}
              className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white rounded-lg p-6 transition-all duration-300 shadow-xl transform hover:scale-105"
            >
              <h2 className="text-xl font-bold mb-2">⚙️ Settings</h2>
              <p className="text-sm opacity-90">Platform configuration</p>
            </button>
          </div>

          <div className="text-center">
            <p className="text-slate-400 mb-4">
              This is a development bypass. Stack Auth is having issues with email verification.
            </p>
            <p className="text-slate-500 text-sm">
              Try signing in with GitHub instead of Google at{' '}
              <a href="/handler/sign-in" className="text-blue-400 hover:text-blue-300">
                /handler/sign-in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}