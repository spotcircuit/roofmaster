import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

// Dashboard module type definition
type DashboardModule = {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  progress?: number;
  color: string;
  phase: number;
  status: 'available' | 'coming-soon' | 'in-progress';
};

// Dashboard modules data
const dashboardModules: DashboardModule[] = [
  {
    id: 'sales-training',
    title: 'Sales Training',
    description: 'Master the art of roofing sales with our comprehensive training program.',
    icon: '🎓',
    href: '/training',
    progress: 25,
    color: 'blue',
    phase: 1,
    status: 'available'
  },
  {
    id: 'sop-library',
    title: 'SOP Library',
    description: 'Access process playbooks, checklists, and role-specific guides.',
    icon: '📚',
    href: '/resources/sop',
    progress: 0,
    color: 'green',
    phase: 2,
    status: 'coming-soon'
  },
  {
    id: 'practice-lab',
    title: 'Practice Lab',
    description: 'Practice sales scenarios with simulated customer conversations.',
    icon: '🧪',
    href: '/practice-lab',
    progress: 0,
    color: 'purple',
    phase: 2,
    status: 'available'
  },
  {
    id: 'ai-interactive',
    title: 'AI Interactive Training',
    description: 'Practice your sales skills with AI-powered voice clients in realistic scenarios.',
    icon: '🤖',
    href: '/ai-interactive',
    progress: 0,
    color: 'indigo',
    phase: 3,
    status: 'available'
  },
  {
    id: 'certifications',
    title: 'Certifications',
    description: 'Earn credentials that validate your roofing sales expertise.',
    icon: '🏆',
    href: '/certifications',
    progress: 0,
    color: 'yellow',
    phase: 2,
    status: 'coming-soon'
  },
  {
    id: 'performance',
    title: 'Performance Tracking',
    description: 'Track your sales metrics and performance over time.',
    icon: '📊',
    href: '/performance',
    progress: 0,
    color: 'orange',
    phase: 2,
    status: 'coming-soon'
  },
  {
    id: 'community',
    title: 'Community Forum',
    description: 'Connect with other sales professionals, share tips, and ask questions.',
    icon: '👥',
    href: '/community',
    progress: 0,
    color: 'indigo',
    phase: 2,
    status: 'coming-soon'
  }
];

// Recent activity type
type Activity = {
  id: number;
  type: 'completed' | 'started' | 'achievement' | 'notification';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
};

// Recent activity data
const recentActivity: Activity[] = [
  {
    id: 1,
    type: 'completed',
    title: 'Completed Module 1',
    description: 'You completed "Foundational Principles and Mindset"',
    timestamp: '2 hours ago',
    icon: '✅'
  },
  {
    id: 2,
    type: 'started',
    title: 'Started Module 2',
    description: 'You began "Prospecting & Lead Generation"',
    timestamp: '1 hour ago',
    icon: '🚀'
  },
  {
    id: 3,
    type: 'notification',
    title: 'New Training Available',
    description: 'New advanced sales techniques module has been added',
    timestamp: '3 days ago',
    icon: '🔔'
  }
];

// Roadmap type
type RoadmapItem = {
  phase: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  eta?: string;
};

// Roadmap data
const roadmapItems: RoadmapItem[] = [
  {
    phase: 1,
    title: 'Core Platform',
    description: 'Basic dashboard and training modules',
    status: 'in-progress',
    eta: 'May 2025'
  },
  {
    phase: 2,
    title: 'Enhanced Learning Experience',
    description: 'SOP library, quizzes, and certifications',
    status: 'upcoming',
    eta: 'June 2025'
  },
  {
    phase: 3,
    title: 'AI Integration',
    description: 'Practice scenarios and automated feedback',
    status: 'upcoming',
    eta: 'July 2025'
  },
  {
    phase: 4,
    title: 'Manager & Admin Tools',
    description: 'Team management and analytics',
    status: 'upcoming',
    eta: 'August 2025'
  },
  {
    phase: 5,
    title: 'Integration & Expansion',
    description: 'CRM integration and mobile app',
    status: 'upcoming',
    eta: 'September 2025'
  }
];

export default function Dashboard() {
  const [activeNavItem, setActiveNavItem] = useState<string>('dashboard');
  const [showRoadmap, setShowRoadmap] = useState<boolean>(false);

  return (
    <Layout activeNavItem={activeNavItem} setActiveNavItem={setActiveNavItem} title="Dashboard | RoofMaster 24/7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back, <span className="text-blue-600">Alex</span></h1>
              <p className="mt-2 text-gray-600">Here's an overview of your progress and available modules.</p>
            </div>
            <button 
              onClick={() => setShowRoadmap(!showRoadmap)} 
              className="mt-4 md:mt-0 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
            >
              <span className="mr-2">{showRoadmap ? '🔍 Hide Roadmap' : '🗺️ View Roadmap'}</span>
            </button>
          </div>
        </div>

        {/* Roadmap (Conditional) */}
        {showRoadmap && (
          <div className="mb-8 glass-card p-6 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Platform Roadmap</h2>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200"></div>
              <div className="space-y-8">
                {roadmapItems.map((item) => (
                  <div key={item.phase} className="relative flex items-start">
                    <div className={`absolute left-8 w-1 h-full ${
                      item.status === 'completed' ? 'bg-green-500' : 
                      item.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}></div>
                    <div className={`z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${
                      item.status === 'completed' ? 'bg-green-100 border-green-500 text-green-500' : 
                      item.status === 'in-progress' ? 'bg-blue-100 border-blue-500 text-blue-500' : 'bg-gray-100 border-gray-300 text-gray-500'
                    }`}>
                      <span className="text-xl font-bold">{item.phase}</span>
                    </div>
                    <div className="ml-6">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                          item.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status === 'completed' ? 'Completed' : 
                           item.status === 'in-progress' ? 'In Progress' : `Coming ${item.eta}`}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card bg-gradient-to-br from-blue-50 to-blue-100 border-t-4 border-blue-500 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Completed Modules</p>
                <p className="text-3xl font-extrabold text-blue-900 mt-1">1/12</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>
          <div className="glass-card bg-gradient-to-br from-green-50 to-green-100 border-t-4 border-green-500 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Certification Progress</p>
                <p className="text-3xl font-extrabold text-green-900 mt-1">25%</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-green-600">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </div>
          <div className="glass-card bg-gradient-to-br from-purple-50 to-purple-100 border-t-4 border-purple-500 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Practice Sessions</p>
                <p className="text-3xl font-extrabold text-purple-900 mt-1">0</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-purple-600">
                <span className="text-2xl">⏱️</span>
              </div>
            </div>
          </div>
          <div className="glass-card bg-gradient-to-br from-amber-50 to-amber-100 border-t-4 border-amber-500 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">Quizzes Passed</p>
                <p className="text-3xl font-extrabold text-amber-900 mt-1">1/4</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-amber-600">
                <span className="text-2xl">✏️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Modules Grid */}
          <div className="lg:w-2/3 p-6 glass-card bg-gradient-to-br from-blue-50/40 to-indigo-50/40 border-t-4 border-indigo-400 shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">Available Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dashboardModules.map((module, index) => (
                <div key={module.id} className="relative animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                  {module.status === 'coming-soon' && (
                    <div className="absolute -right-2 -top-2 z-10 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs px-3 py-1 rounded-full shadow-md">
                      Phase {module.phase}
                    </div>
                  )}
                  <Link
                    href={module.status === 'available' ? module.href : '#'}
                    className={`glass-card module-card module-card-${module.color} p-6 transition-all duration-300 block ${
                      module.status === 'available' 
                        ? `group cursor-pointer bg-gradient-to-br from-${module.color}-50 to-${module.color}-100` 
                        : 'opacity-85 cursor-not-allowed bg-gradient-to-br from-gray-50 to-gray-100'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`w-16 h-16 rounded-full bg-${module.color}-100 flex items-center justify-center text-${module.color}-600 mr-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl">{module.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className={`text-lg font-bold text-gray-900 ${module.status === 'available' ? 'group-hover:text-blue-600' : ''} transition-colors`}>
                            {module.title}
                          </h3>
                          {module.status === 'coming-soon' && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{module.description}</p>
                        
                        {module.progress !== undefined && module.progress > 0 && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-700">{module.progress}% Complete</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                              <div 
                                className={`h-full bg-gradient-to-r from-${module.color}-400 to-${module.color}-600 rounded-full`}
                                style={{ width: `${module.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {module.status === 'available' && (
                          <div className="mt-4 flex justify-end">
                            <span className="text-sm text-${module.color}-600 font-medium flex items-center group-hover:underline">
                              Open {module.title} <span className="ml-1">→</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {module.status === 'coming-soon' && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-gray-200 flex-shrink-0"></div>
                          <div className="ml-2 h-0.5 flex-grow bg-gray-100 rounded-full overflow-hidden">
                            <div className="animate-shimmer w-full h-full"></div>
                          </div>
                          <div className="w-4 h-4 rounded-full bg-gray-200 flex-shrink-0"></div>
                        </div>
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Continue Learning */}
            <div className="glass-card bg-gradient-to-br from-indigo-50 to-indigo-100 border-l-4 border-indigo-500 p-6 mb-6 animate-slideUp shadow-lg">
              <h2 className="text-lg font-bold text-indigo-800 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600 mr-2">
                  <span className="text-sm">📝</span>
                </span>
                Continue Learning
              </h2>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-5 text-white shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3">
                    <span className="text-lg">🚀</span>
                  </div>
                  <div>
                    <h3 className="font-bold">Module 2: Prospecting & Lead Generation</h3>
                    <p className="text-sm text-blue-100 mt-1">You're 15% through this module</p>
                  </div>
                </div>
                
                <div className="mt-4 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-blue-100">Progress</span>
                    <span className="text-xs text-blue-100">15%</span>
                  </div>
                  <div className="h-2 bg-blue-400/30 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-white rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-100">Last activity: 1 hour ago</span>
                  <Link 
                    href="/training"
                    className="inline-block px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50 shadow-md hover:shadow-lg"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            </div>
            
            {/* AI Practice Lab */}
            <div className="glass-card bg-gradient-to-br from-fuchsia-50 to-purple-100 border-l-4 border-fuchsia-500 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-fuchsia-800">AI Practice Lab</h2>
                <span className="px-2 py-1 text-xs font-medium bg-fuchsia-100 text-fuchsia-800 rounded-full">Beta</span>
              </div>
              <p className="text-fuchsia-700 mb-4">
                Practice your sales skills with our AI-powered role-playing scenarios. Get instant feedback and improve your techniques.
              </p>
              <div className="bg-white/70 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-fuchsia-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <span className="text-fuchsia-900">Practice Door Knocking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-fuchsia-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <span className="text-fuchsia-900">Handle Objections</span>
                </div>
              </div>
              <Link href="/practice-lab" className="mt-4 w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg transition-colors inline-block text-center">
                Enter Practice Lab
              </Link>
            </div>
            
            {/* Recent Activity */}
            <div className="glass-card bg-gradient-to-br from-cyan-50 to-cyan-100 border-l-4 border-cyan-500 p-6 shadow-lg">
              <h2 className="text-lg font-bold text-cyan-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start bg-white/50 p-3 rounded-lg mb-2 hover:bg-white/80 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex-shrink-0 flex items-center justify-center text-cyan-600 mr-3 shadow-sm">
                      {activity.icon}
                    </div>
                    <div>
                      <p className="text-sm text-cyan-900">{activity.title}</p>
                      <p className="text-xs text-cyan-600 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-cyan-200">
                <Link 
                  href="/activity"
                  className="text-sm bg-cyan-600 text-white px-4 py-2 rounded-full hover:bg-cyan-700 font-medium inline-flex items-center shadow-sm"
                >
                  View All Activity <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
            
            {/* SOP Library */}
            <div className="glass-card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 shadow-lg">
              <h2 className="text-lg font-bold text-blue-800 mb-4">SOP Library</h2>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-blue-900">Inspection Process</span>
                </div>
                <div className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-blue-900">Customer Communication</span>
                </div>
                <div className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-blue-900">Insurance Claims</span>
                </div>
              </div>
              <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                View All SOPs
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}