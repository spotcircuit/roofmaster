'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserComprehension {
  id: string;
  name: string;
  email: string;
  overallScore: number;
  videosCompleted: number;
  quizzesPassed: number;
  quizzesFailed: number;
  averageQuizScore: number;
  strongAreas: string[];
  weakAreas: string[];
  lastAssessment: string;
  recentActivity: {
    videoTitle: string;
    quizScore: number;
    comprehensionScore: number;
    date: string;
  }[];
}

export default function AIComprehensionDashboard() {
  const [users, setUsers] = useState<UserComprehension[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserComprehension | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchComprehensionData();
  }, [filterRole]);

  const checkAuth = () => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      router.push('/');
      return;
    }
    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      router.push('/journey');
    }
  };

  const fetchComprehensionData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/comprehension?role=${filterRole}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching comprehension data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runAIAnalysis = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/comprehension/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const analysis = await response.json();
        alert(`AI Analysis Complete: ${analysis.summary}`);
        fetchComprehensionData();
      }
    } catch (error) {
      console.error('Error running AI analysis:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Comprehension Monitoring</h1>
          <p className="text-gray-600">Track and analyze user comprehension across all training materials</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="trainee">Trainees</option>
              <option value="apex">Apex</option>
              <option value="manager">Managers</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading comprehension data...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4">User Comprehension Overview</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Overall Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quiz Performance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedUser(user)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`text-2xl font-bold ${getScoreColor(user.overallScore)}`}>
                                {user.overallScore}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div>{user.videosCompleted} videos</div>
                              <div className="text-gray-500">{user.quizzesPassed} quizzes passed</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreBadge(user.averageQuizScore)}`}>
                              {user.averageQuizScore}% avg
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                runAIAnalysis(user.id);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Run AI Analysis
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="lg:col-span-1">
                {selectedUser ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">User Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-lg font-semibold">{selectedUser.name}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Comprehension Score</p>
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${getScoreBadge(selectedUser.overallScore)}`}>
                                {selectedUser.overallScore}%
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${selectedUser.overallScore}%` }}
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                selectedUser.overallScore >= 80 ? 'bg-green-500' :
                                selectedUser.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Strong Areas</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedUser.strongAreas?.map((area, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {area}
                            </span>
                          )) || <span className="text-gray-400 text-sm">No data yet</span>}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Areas for Improvement</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedUser.weakAreas?.map((area, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              {area}
                            </span>
                          )) || <span className="text-gray-400 text-sm">No data yet</span>}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Recent Activity</p>
                        <div className="space-y-2">
                          {selectedUser.recentActivity?.slice(0, 3).map((activity, index) => (
                            <div key={index} className="bg-white p-3 rounded border border-gray-200">
                              <p className="text-sm font-medium">{activity.videoTitle}</p>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">Quiz: {activity.quizScore}%</span>
                                <span className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          )) || <span className="text-gray-400 text-sm">No recent activity</span>}
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <button
                          onClick={() => router.push(`/admin/users/${selectedUser.id}/detailed-report`)}
                          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                        >
                          View Detailed Report
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                    Select a user to view details
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">AI Insights Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Top Performers</h3>
              <p className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.overallScore >= 80).length}
              </p>
              <p className="text-xs text-blue-700 mt-1">Comprehension score above 80%</p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-900 mb-2">Need Support</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {users.filter(u => u.overallScore >= 60 && u.overallScore < 80).length}
              </p>
              <p className="text-xs text-yellow-700 mt-1">Comprehension score 60-79%</p>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-900 mb-2">At Risk</h3>
              <p className="text-2xl font-bold text-red-600">
                {users.filter(u => u.overallScore < 60).length}
              </p>
              <p className="text-xs text-red-700 mt-1">Comprehension score below 60%</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">AI Recommendation</h3>
            <p className="text-sm text-gray-600">
              Based on current comprehension data, focus on reinforcing "Objection Handling" and "Closing Techniques"
              modules. 65% of users show lower comprehension in these areas. Consider adding more practical examples
              and role-play scenarios to improve understanding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}