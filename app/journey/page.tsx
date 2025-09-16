'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apexJourney, dailyChallenges, leaderboard, getLevelFromXP } from '@/lib/gameData';

// Get user data from localStorage (in production, this would use proper auth)
const getUserData = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      return {
        name: user.name || "Demo User",
        currentPhase: 2,
        currentWeek: 3,
        xp: 2750,
        level: 8,
        streak: 5,
        personalWhy: "To achieve financial freedom and master the art of sales",
        todayStats: {
          doors: 45,
          conversations: 12,
          appointments: 2,
          xpEarned: 350
        },
        weeklyProgress: {
          doors: { current: 245, target: 400 },
          conversations: { current: 52, target: 80 },
          appointments: { current: 3, target: 4 }
        }
      };
    }
  }
  // Fallback data
  return {
    name: "Sales Pro",
    currentPhase: 1,
    currentWeek: 1,
    xp: 0,
    level: 1,
    streak: 0,
    personalWhy: "To become an Apex Sales Pro",
    todayStats: {
      doors: 0,
      conversations: 0,
      appointments: 0,
      xpEarned: 0
    },
    weeklyProgress: {
      doors: { current: 0, target: 400 },
      conversations: { current: 0, target: 80 },
      appointments: { current: 0, target: 4 }
    }
  };
};

export default function JourneyDashboard() {
  const [userData, setUserData] = useState(getUserData());
  const [selectedPhase, setSelectedPhase] = useState(userData.currentPhase);
  const [showChallenges, setShowChallenges] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentPhaseData = apexJourney[userData.currentPhase - 1];
  const nextLevelXP = getLevelFromXP(userData.xp + 500) * 50;
  const currentLevelXP = getLevelFromXP(userData.xp) * 50;
  const levelProgress = ((userData.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-400/10 rounded-full blur-3xl"
            style={{
              width: Math.random() * 400 + 100,
              height: Math.random() * 400 + 100,
            }}
            animate={{
              x: [Math.random() * 1920, Math.random() * 1920],
              y: [Math.random() * 1080, Math.random() * 1080],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 sm:p-6 w-full max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Welcome back, {userData.name.split(' ')[0]}! 🚀
                </h1>
                <p className="text-blue-200 text-sm sm:text-base">Week {userData.currentWeek} • {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{userData.streak}🔥</div>
                  <div className="text-xs text-blue-200">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-400">#{leaderboard.find(u => u.isCurrentUser)?.rank}</div>
                  <div className="text-xs text-blue-200">Rank</div>
                </div>
              </div>
            </div>

            {/* XP & Level Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Level {userData.level}</span>
                <span className="text-blue-200 text-sm">{userData.xp} / {nextLevelXP} XP</span>
              </div>
              <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.header>

        {/* Personal Why Reminder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-xl p-4 mb-6 border border-purple-500/30"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">💭</span>
            <div>
              <h3 className="text-white font-semibold mb-1">Your Why</h3>
              <p className="text-purple-200 italic">"{userData.personalWhy}"</p>
            </div>
          </div>
        </motion.div>

        {/* Today's Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span> Today's Mission
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Doors', value: userData.todayStats.doors, icon: '🚪', color: 'from-blue-400 to-blue-600' },
                  { label: 'Conversations', value: userData.todayStats.conversations, icon: '💬', color: 'from-green-400 to-green-600' },
                  { label: 'Appointments', value: userData.todayStats.appointments, icon: '📅', color: 'from-purple-400 to-purple-600' },
                  { label: 'XP Earned', value: `+${userData.todayStats.xpEarned}`, icon: '⭐', color: 'from-yellow-400 to-orange-500' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl`}
                  >
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/80">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Weekly Progress */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wide">Weekly Goals</h3>
                {Object.entries(userData.weeklyProgress).map(([key, data]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm text-white mb-1">
                      <span className="capitalize">{key}</span>
                      <span>{data.current} / {data.target}</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.current / data.target) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Daily Challenges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span> Daily Challenges
              </h2>
              <div className="space-y-3">
                {dailyChallenges.map((challenge, i) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="bg-black/20 rounded-lg p-3 border border-white/10 hover:border-cyan-400/50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-medium text-sm">{challenge.title}</h3>
                      <span className="text-yellow-400 text-xs font-bold">+{challenge.xpReward} XP</span>
                    </div>
                    <p className="text-blue-200 text-xs mb-2">{challenge.description}</p>
                    <div className="text-xs text-cyan-400">⏰ {challenge.timeLimit}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Journey Path */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Your Apex Journey</h2>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-white/10 rounded-full"></div>
            <motion.div
              className="absolute top-12 left-0 h-1 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(userData.currentPhase / 5) * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Phases */}
            <div className="relative grid grid-cols-1 md:grid-cols-5 gap-4">
              {apexJourney.map((phase, index) => {
                const isUnlocked = index < userData.currentPhase;
                const isCurrent = index === userData.currentPhase - 1;

                return (
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    onClick={() => isUnlocked && setSelectedPhase(phase.id)}
                    className={`relative cursor-pointer transition-all ${
                      !isUnlocked && 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {/* Phase Node */}
                    <div className="flex justify-center mb-4">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl
                        ${isCurrent ? 'bg-gradient-to-br from-cyan-400 to-blue-500 animate-pulse' :
                          isUnlocked ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                          'bg-gray-700'}
                        ${isUnlocked && 'hover:scale-110'} transition-transform`}>
                        {phase.icon}
                      </div>
                    </div>

                    {/* Phase Info */}
                    <div className="text-center">
                      <h3 className={`font-bold text-sm mb-1 ${
                        isCurrent ? 'text-cyan-400' :
                        isUnlocked ? 'text-white' : 'text-gray-500'
                      }`}>
                        {phase.title}
                      </h3>
                      <p className="text-xs text-blue-200">{phase.weeks}</p>
                      {isCurrent && (
                        <div className="mt-2 text-xs text-yellow-400 font-semibold">CURRENT</div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🏆</span> Leaderboard
          </h2>
          <div className="space-y-2">
            {leaderboard.map((user, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  user.isCurrentUser ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border border-cyan-400/50' :
                  'bg-black/20 border border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${i === 0 ? 'bg-yellow-500 text-black' :
                      i === 1 ? 'bg-gray-400 text-black' :
                      i === 2 ? 'bg-orange-600 text-white' :
                      'bg-gray-700 text-white'}`}>
                    {user.rank}
                  </div>
                  <div>
                    <div className="text-white font-medium">{user.name}</div>
                    <div className="text-xs text-blue-200">Level {user.level}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{user.xp.toLocaleString()} XP</div>
                  <div className="text-xs text-green-400">{user.deals} deals</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}