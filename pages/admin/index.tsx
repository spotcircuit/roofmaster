import { useState } from 'react';
import Link from 'next/link';
import { users, trainingModules, evaluations } from '../../lib/data';

// Icon components
const DashboardIcon = (className: string) => (
  <svg className={`mr-3 h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const UsersIcon = (className: string) => (
  <svg className={`mr-3 h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default function AdminDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const adminName = "Bob Johnson";
  
  // Only show regular users (not admins)
  const regularUsers = users.filter(user => user.role === 'user');
  
  // Calculate average score from evaluations
  const avgScore = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-br from-indigo-900 to-purple-900 text-white transition-all duration-300 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-72 overflow-hidden shadow-2xl`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-100">
              Admin<span className="text-purple-300">Portal</span>
            </h1>
            <button className="md:hidden" onClick={() => setIsMenuOpen(false)}>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Admin profile */}
        <div className="mt-2 px-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-800/40 to-purple-800/40 backdrop-blur-lg border border-white/10">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <span className="text-xl font-semibold">B</span>
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">Bob Johnson</p>
                <p className="text-indigo-200 text-sm">Administrator</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs text-indigo-100">Last login</div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm text-indigo-200">Today, 9:42 AM</span>
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-full">Online</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider px-4 mb-2">Dashboard</div>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors group ${
                activeSection === 'overview' 
                  ? 'bg-white/10 text-white' 
                  : 'text-indigo-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5 text-indigo-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Overview</span>
            </button>
            
            <button 
              onClick={() => setActiveSection('users')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors group ${
                activeSection === 'users' 
                  ? 'bg-white/10 text-white' 
                  : 'text-indigo-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5 text-indigo-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Users</span>
            </button>
            
            <button 
              onClick={() => setActiveSection('content')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors group ${
                activeSection === 'content' 
                  ? 'bg-white/10 text-white' 
                  : 'text-indigo-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5 text-indigo-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Training Content</span>
            </button>
          </div>
          
          <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider px-4 mb-2 mt-8">Analytics</div>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveSection('performance')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors group ${
                activeSection === 'performance' 
                  ? 'bg-white/10 text-white' 
                  : 'text-indigo-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5 text-indigo-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Performance</span>
            </button>
            
            <button 
              onClick={() => setActiveSection('reports')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors group ${
                activeSection === 'reports' 
                  ? 'bg-white/10 text-white' 
                  : 'text-indigo-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5 text-indigo-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Reports</span>
            </button>
          </div>
          
          <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider px-4 mb-2 mt-8">Settings</div>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors group ${
                activeSection === 'settings' 
                  ? 'bg-white/10 text-white' 
                  : 'text-indigo-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5 text-indigo-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>General Settings</span>
            </button>
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-full p-6">
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-white rounded-xl border border-white/5 transition-all duration-300 hover:shadow-xl hover:border-white/10">
            <svg className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign out</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 bg-gray-50 md:ml-72">
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-lg shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button
              className="md:hidden text-gray-600"
              onClick={() => setIsMenuOpen(true)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gradient-purple md:hidden">Admin Portal</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
              
              <div className="relative">
                <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="absolute top-1 right-1 h-2 w-2 bg-blue-500 rounded-full"></span>
                </button>
              </div>
              
              <div className="hidden sm:flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                  <span className="font-semibold">B</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-6">
            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
              <div className="absolute right-0 top-0 opacity-20">
                <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="200" cy="200" r="200" fill="white" />
                </svg>
              </div>
              <div className="relative p-8 sm:p-10">
                <div className="max-w-2xl">
                  <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                  <p className="text-indigo-100 mb-6">Manage users, training content, and analytics for your sales team</p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg shadow hover:bg-indigo-50 transition-colors font-medium">
                      Add New User
                    </button>
                    <button className="px-4 py-2 bg-indigo-500/30 hover:bg-indigo-500/40 text-white rounded-lg border border-white/10 transition-colors">
                      View Analytics
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Users Card */}
              <div className="group bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:border-purple-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">Total Users</h3>
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-gray-900">{regularUsers.length}</p>
                    <p className="ml-2 text-sm text-gray-500 group-hover:text-indigo-500 transition-colors">Active</p>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last 7 days</span>
                      <span className="text-indigo-600 font-medium">+2</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 w-3/4 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Completed Modules Card */}
              <div className="group bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:border-green-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-700 transition-colors">Completed Modules</h3>
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-gray-900">7</p>
                    <p className="ml-2 text-sm text-gray-500 group-hover:text-green-500 transition-colors">Total</p>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">This month</span>
                      <span className="text-green-600 font-medium">+4</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 to-emerald-400 w-3/5 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Training Modules Card */}
              <div className="group bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:border-amber-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-amber-700 transition-colors">Training Modules</h3>
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-gray-900">{trainingModules.length}</p>
                    <p className="ml-2 text-sm text-gray-500 group-hover:text-amber-500 transition-colors">Available</p>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Active modules</span>
                      <span className="text-amber-600 font-medium">All</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 w-full rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Avg Score Card */}
              <div className="group bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:border-purple-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">Average Score</h3>
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-gray-900">{avgScore.toFixed(1)}%</p>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Improvement</span>
                      <span className="text-purple-600 font-medium">+5.2%</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                        style={{ width: `${avgScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Users */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <div className="flex flex-wrap justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">User Management</h3>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span>Filter</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add User</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {regularUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                              {user.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-500">Sales Rep</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.id === 1 ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                          ) : user.id === 3 ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Pending</span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Inactive</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap w-40">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-full rounded-full ${
                                  user.id === 1 
                                    ? 'bg-gradient-to-r from-indigo-400 to-purple-400 w-1/4' 
                                    : 'bg-gray-400 w-0'
                                }`}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {user.id === 1 ? '25%' : '0%'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-3">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-500">Showing <span className="font-medium">1</span> to <span className="font-medium">{regularUsers.length}</span> of <span className="font-medium">{regularUsers.length}</span> users</p>
                <div className="flex space-x-1">
                  <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                  <button className="px-3 py-1 border border-indigo-500 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">1</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                </div>
              </div>
            </div>
            
            {/* Analytics and Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Performance Chart */}
              <div className="md:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">User Performance</h3>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full font-medium">Daily</button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full hover:bg-indigo-100 hover:text-indigo-800">Weekly</button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full hover:bg-indigo-100 hover:text-indigo-800">Monthly</button>
                  </div>
                </div>
                
                <div className="h-60 w-full">
                  {/* Placeholder for chart (in a real app you would use Chart.js, Recharts, etc.) */}
                  <div className="h-full w-full bg-gradient-to-b from-gray-50 to-white rounded-xl flex flex-col justify-center items-center p-4 border border-gray-100">
                    <div className="w-full h-full relative">
                      <div className="absolute bottom-0 left-0 w-full h-px bg-gray-200"></div>
                      <div className="absolute left-0 top-0 h-full w-px bg-gray-200"></div>
                      
                      {/* Fake data points & lines */}
                      <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-between px-1">
                        {[0.3, 0.5, 0.7, 0.6, 0.8, 0.75, 0.9].map((point, i) => (
                          <div key={i} className="h-full flex flex-col justify-end items-center">
                            <div 
                              className="w-2 rounded-t-full bg-gradient-to-t from-indigo-500 to-purple-600" 
                              style={{ height: `${point * 80}%` }}
                            ></div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Line chart */}
                      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path
                          d="M0,70 L14.28,50 L28.57,30 L42.85,40 L57.14,20 L71.42,25 L85.71,10 L100,10"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="2"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#c084fc" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    
                    <div className="w-full flex justify-between text-xs text-gray-500 mt-2">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <div className="text-xs text-indigo-700 font-medium">Total Logins</div>
                    <div className="text-xl font-bold mt-1 text-indigo-900">145</div>
                    <div className="text-xs text-indigo-700 mt-1 flex items-center">
                      <svg className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      +12.5%
                    </div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <div className="text-xs text-purple-700 font-medium">Avg. Time Spent</div>
                    <div className="text-xl font-bold mt-1 text-purple-900">32m</div>
                    <div className="text-xs text-purple-700 mt-1 flex items-center">
                      <svg className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      +7.2%
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-xl">
                    <div className="text-xs text-green-700 font-medium">Completion Rate</div>
                    <div className="text-xl font-bold mt-1 text-green-900">67%</div>
                    <div className="text-xs text-green-700 mt-1 flex items-center">
                      <svg className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      +15.3%
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h3>
                
                <div className="space-y-5">
                  <div className="flex">
                    <div className="relative mr-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200"></div>
                    </div>
                    
                    <div className="flex-1 py-0.5">
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium text-gray-800">User Completed Training</h4>
                        <span className="ml-auto text-xs text-gray-500">2 days ago</span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Alice Smith</span> completed <span className="font-medium">Introduction to Sales</span> with a score of 90%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="relative mr-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200"></div>
                    </div>
                    
                    <div className="flex-1 py-0.5">
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium text-gray-800">AI Training Session</h4>
                        <span className="ml-auto text-xs text-gray-500">Yesterday</span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Alice Smith</span> scored 85% on <span className="font-medium">Price Objection Scenario</span>
                      </p>
                      <button className="mt-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="relative mr-4">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200"></div>
                    </div>
                    
                    <div className="flex-1 py-0.5">
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium text-gray-800">New Module Added</h4>
                        <span className="ml-auto text-xs text-gray-500">5 days ago</span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        New training module <span className="font-medium">Building Relationships</span> was added to the platform
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="relative mr-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="flex-1 py-0.5">
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium text-gray-800">New User Registered</h4>
                        <span className="ml-auto text-xs text-gray-500">1 week ago</span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Charlie Brown</span> joined the platform
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    View All Activity
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}