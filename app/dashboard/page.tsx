'use client';

import { useRouter } from 'next/navigation';
import { useStackApp, useUser } from '@stackframe/stack';

export default function DashboardPage() {
  const router = useRouter();
  const app = useStackApp();
  const user = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6">
          <h1 className="text-3xl font-bold text-white mb-6">RoofMaster 24-7 Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => router.push('/admin')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg p-6 transition-all duration-300 shadow-xl transform hover:scale-105"
            >
              <h2 className="text-xl font-bold mb-2">Admin Panel</h2>
              <p className="text-sm opacity-90">Manage users, videos, and quizzes</p>
            </button>

            <button
              onClick={() => router.push('/training')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg p-6 transition-all duration-300 shadow-xl transform hover:scale-105"
            >
              <h2 className="text-xl font-bold mb-2">Training Videos</h2>
              <p className="text-sm opacity-90">Watch training content</p>
            </button>

            <button
              onClick={() => router.push('/practice')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg p-6 transition-all duration-300 shadow-xl transform hover:scale-105"
            >
              <h2 className="text-xl font-bold mb-2">Practice Lab</h2>
              <p className="text-sm opacity-90">Take quizzes and practice</p>
            </button>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <div>
              {user && (
                <p className="text-slate-400">
                  Signed in as: {user.primaryEmail}
                </p>
              )}
            </div>
            <button
              onClick={() => app.redirectToSignOut()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}