import { StackHandler } from '@stackframe/stack';
import { stackServerApp } from '@/lib/stack-server';
import StackAuthStyles from './stack-auth-styles';

export default function Handler(props: any) {
  return (
    <>
      <StackAuthStyles />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Logo and Branding Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-8">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 blur-2xl opacity-50 animate-pulse"></div>
                <span className="relative text-6xl drop-shadow-2xl">⚡</span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
              RoofMaster <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">24-7</span>
            </h1>
            <p className="text-lg font-semibold text-slate-300 mb-2">Restoration Solutions</p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <span>🎯</span> Apex Sales Training
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <span>📚</span> Professional Coaching
              </span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span>🏆</span> Elite Performance
              </span>
              <span className="flex items-center gap-1">
                <span>💼</span> Industry Leaders
              </span>
              <span className="flex items-center gap-1">
                <span>📈</span> Proven Results
              </span>
            </div>
          </div>
        </div>

        {/* Stack Auth Handler */}
        <StackHandler
          fullPage
          app={stackServerApp}
          routeProps={props}
        />
      </div>
    </>
  );
}