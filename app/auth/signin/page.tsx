'use client';

import { useStackApp } from '@stackframe/stack';
import { OAuthButtonGroup } from '@stackframe/stack';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 blur-2xl opacity-50 animate-pulse"></div>
                <span className="relative text-6xl drop-shadow-2xl">⚡</span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
              RoofMaster <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">24-7</span>
            </h1>
            <p className="text-slate-400 font-semibold tracking-widest uppercase text-sm mb-8">Sign In</p>
          </div>

          <div className="space-y-4">
            <p className="text-white text-center mb-4">Choose your sign-in method:</p>

            <OAuthButtonGroup type="sign-in" />

            <div className="mt-6 text-center">
              <a href="/" className="text-sm text-blue-400 hover:text-blue-300">
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}