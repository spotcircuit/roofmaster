'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStackApp, useUser } from '@stackframe/stack';

interface User {
  id: string;
  primary_email: string;
  display_name?: string;
  signed_up_at: string;
  server_metadata?: {
    role?: string;
  };
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();
  const app = useStackApp();
  const currentUser = useUser();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/stack-users');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched users from Stack Auth:', data);
        // Map Stack Auth users to match expected format
        const mappedUsers = data.users?.map((user: any) => ({
          id: user.id,
          primary_email: user.primaryEmail,
          display_name: user.displayName,
          signed_up_at: user.signedUpAt,
          server_metadata: user.serverMetadata
        })) || [];
        setUsers(mappedUsers);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async (userId: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/make-admin`, {
        method: 'POST',
      });

      if (response.ok) {
        // Refresh the users list
        await fetchUsers();
        console.log('User has been made an admin');
      } else {
        console.error('Failed to make user an admin');
      }
    } catch (error) {
      console.error('Error making admin:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const removeAdmin = async (userId: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/remove-admin`, {
        method: 'POST',
      });

      if (response.ok) {
        // Refresh the users list
        await fetchUsers();
        console.log('Admin role has been removed');
      } else {
        console.error('Failed to remove admin role');
      }
    } catch (error) {
      console.error('Error removing admin:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove user from local state
        setUsers(users.filter(u => u.id !== userId));
        console.log('User has been deleted');
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Manage Users
              </h1>
              <p className="text-sm text-gray-400 mt-1">Stack Auth User Management</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="w-full sm:w-auto px-4 py-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-all duration-200 border border-gray-600/30 text-center"
            >
              Back to Admin
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Users Table */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">All Users ({users.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Display Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {user.primary_email}
                        {user.id === currentUser?.id && (
                          <span className="ml-2 text-xs text-blue-400">(You)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {user.display_name || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.server_metadata?.role === 'admin' ? (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-500/20 text-gray-300 rounded-full border border-gray-500/30">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(user.signed_up_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {user.server_metadata?.role === 'admin' ? (
                          <button
                            onClick={() => removeAdmin(user.id)}
                            disabled={actionLoading === user.id || user.id === currentUser?.id}
                            className="px-3 py-1 text-xs bg-amber-600/20 text-amber-400 rounded-lg hover:bg-amber-600/30 transition-all duration-200 border border-amber-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === user.id ? 'Processing...' : 'Remove Admin'}
                          </button>
                        ) : (
                          <button
                            onClick={() => makeAdmin(user.id)}
                            disabled={actionLoading === user.id}
                            className="px-3 py-1 text-xs bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-all duration-200 border border-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === user.id ? 'Processing...' : 'Make Admin'}
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(user.id, user.primary_email)}
                          disabled={actionLoading === user.id || user.id === currentUser?.id}
                          className="px-3 py-1 text-xs bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all duration-200 border border-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === user.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400">No users found</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-600/10 border border-blue-600/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-400 text-xl">ℹ️</span>
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">User Management Notes:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-300/80">
                <li>You cannot delete or remove admin from your own account</li>
                <li>Deleted users will be removed from Stack Auth permanently</li>
                <li>Admin role changes take effect immediately</li>
                <li>Users will need to sign in again after role changes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}