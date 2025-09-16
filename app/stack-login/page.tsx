'use client';

import { useStackApp, useUser } from '@stackframe/stack';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StackLoginPage() {
  const app = useStackApp();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">RoofMaster 24-7</h1>
            <p className="text-slate-400">Sign in with Stack Auth</p>
          </div>

          <button
            onClick={() => app.redirectToSignIn()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Sign In / Sign Up
          </button>

          <div className="mt-4">
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}