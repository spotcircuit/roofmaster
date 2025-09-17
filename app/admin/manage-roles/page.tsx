'use client';

import { useState, useEffect } from 'react';
import { useUser, useStackApp } from '@stackframe/stack';
import { useRouter } from 'next/navigation';

export default function ManageRolesPage() {
  const currentUser = useUser();
  const app = useStackApp();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (currentUser === null) {
      app.redirectToSignIn();
      return;
    }

    // Check if user is admin
    if (currentUser) {
      fetch('/api/user/role')
        .then(res => res.json())
        .then(data => {
          if (data.role === 'admin') {
            setIsAdmin(true);
            fetchUsers();
          } else {
            router.push('/');
          }
          setAuthChecked(true);
        })
        .catch(err => {
          console.error('Error checking admin role:', err);
          router.push('/');
        });
    }
  }, [currentUser, app, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/stack-users');
      const data = await response.json();
      console.log('Received data from API:', data);
      console.log('Users array:', data.users);
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const setUserRole = async (userId: string, role: string) => {
    try {
      const response = await fetch('/api/admin/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role })
      });

      if (response.ok) {
        alert(`Role updated to ${role}`);
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error setting role:', error);
      alert('Failed to update role');
    }
  };

  if (!authChecked || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Access Denied - Admin Only</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6">
          <h1 className="text-3xl font-bold text-white mb-6">Manage User Roles</h1>

          {loading ? (
            <div className="text-white">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-white">No users found. Check console for debugging info.</div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">{user.displayName || 'No Name'}</div>
                    <div className="text-slate-400">{user.primaryEmail}</div>
                    <div className="text-sm text-slate-500">
                      Current Role: <span className="text-blue-400">{user.serverMetadata?.role || 'user'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUserRole(user.id, 'admin')}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                      disabled={user.serverMetadata?.role === 'admin'}
                    >
                      Make Admin
                    </button>
                    <button
                      onClick={() => setUserRole(user.id, 'user')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      disabled={user.serverMetadata?.role !== 'admin'}
                    >
                      Make User
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <a href="/admin" className="text-blue-400 hover:text-blue-300">
              ← Back to Admin Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}