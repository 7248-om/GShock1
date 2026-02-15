import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User } from '../types';
import { Search, Mail, Calendar, ExternalLink, X, Trash2 } from 'lucide-react';

interface Props {
  users: User[];
}

const UserManagement: React.FC<Props> = ({ users: initialUsers }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [displayUsers, setDisplayUsers] = useState<User[]>(initialUsers);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  // Fetch users from backend
  useEffect(() => {
    let cancelled = false;
    async function fetchUsers() {
      setLoadingUsers(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/users`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });
        if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) setDisplayUsers(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    }

    if (token) fetchUsers();
    return () => { cancelled = true; };
  }, [token, API_BASE_URL]);

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    setUpdatingRole(userId);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error('Failed to update role');
      const updatedUser = await res.json();
      setDisplayUsers(displayUsers.map(u => (u._id || u.id) === (updatedUser._id || updatedUser.id) ? updatedUser : u));
      if (selectedUser && ((selectedUser._id || selectedUser.id) === (updatedUser._id || updatedUser.id))) {
        setSelectedUser(updatedUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setUpdatingRole(null);
    }
  };

  const filteredUsers = displayUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-4xl font-serif font-bold tracking-tight text-coffee-100">User Stewardship</h2>
        <p className="text-coffee-500 mt-1">Managing relationships and engagement history.</p>
      </header>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 bg-coffee-900 p-4 rounded-2xl border border-coffee-800">
        <Search className="text-coffee-500" size={18} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-coffee-100 outline-none text-sm"
        />
      </div>

      <div className="bg-coffee-900 border border-coffee-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-coffee-800 bg-coffee-950/40">
            <tr>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-coffee-500 font-bold">User</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-coffee-500 font-bold">Role</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-coffee-500 font-bold">Joined</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-coffee-500 font-bold">Engagement</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-coffee-800">
            {loadingUsers ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-coffee-500 text-sm">Loading users…</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-coffee-500 text-sm">No users found.</td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user._id || user.id} className="hover:bg-coffee-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-coffee-100">{user.name}</p>
                      <p className="text-xs text-coffee-500 flex items-center gap-1 mt-0.5"><Mail size={10} /> {user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={(user as any).role || 'user'}
                      onChange={(e) => handleRoleChange(user._id || user.id || '', e.target.value as 'user' | 'admin')}
                      disabled={updatingRole === (user._id || user.id)}
                      className="text-xs font-bold px-3 py-1 rounded bg-coffee-800 text-coffee-100 border border-coffee-700 focus:outline-none disabled:opacity-50"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-coffee-600 flex items-center gap-2"><Calendar size={12} /> {user.joinDate || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-coffee-100">
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-bold text-coffee-500 tracking-widest">Orders</p>
                        <p className="text-xs font-bold">{(user as any).orderCount || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-bold text-coffee-500 tracking-widest">WS</p>
                        <p className="text-xs font-bold">{(user as any).workshopCount || 0}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelectedUser(user)} className="text-coffee-500 hover:text-coffee-100"><ExternalLink size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-coffee-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-coffee-900 border border-coffee-800 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="p-8 border-b border-coffee-800 flex justify-between items-center">
                <h3 className="text-2xl font-serif font-bold text-coffee-100">User Dossier</h3>
                <button onClick={() => setSelectedUser(null)} className="p-2 text-coffee-500 hover:bg-coffee-800 rounded-full"><X /></button>
             </div>
             <div className="p-8 grid grid-cols-2 gap-8">
                <div>
                   <p className="text-[10px] uppercase font-bold text-coffee-500 mb-4 tracking-[0.2em]">Customer Profile</p>
                   <div className="space-y-4">
                      <div>
                        <p className="text-xs text-coffee-600">Full Name</p>
                        <p className="text-lg font-bold text-coffee-100">{selectedUser.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-coffee-600">Email</p>
                        <p className="text-sm text-coffee-200">{selectedUser.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-coffee-600">Role</p>
                        <select
                          value={(selectedUser as any).role || 'user'}
                          onChange={(e) => handleRoleChange(selectedUser._id || selectedUser.id || '', e.target.value as 'user' | 'admin')}
                          disabled={updatingRole === (selectedUser._id || selectedUser.id)}
                          className="text-sm font-bold px-3 py-2 rounded bg-coffee-800 text-coffee-100 border border-coffee-700 focus:outline-none disabled:opacity-50 w-full mt-1"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <p className="text-xs text-coffee-600">Registration</p>
                        <p className="text-sm text-coffee-200">{selectedUser.joinDate || 'N/A'}</p>
                      </div>
                   </div>
                </div>
                <div>
                   <p className="text-[10px] uppercase font-bold text-coffee-500 mb-4 tracking-[0.2em]">Activity Ledger</p>
                   <div className="bg-coffee-950/40 rounded-2xl border border-coffee-800 p-4 space-y-3">
                      <div className="flex justify-between border-b border-coffee-800 pb-2">
                        <span className="text-xs text-coffee-600">Orders</span>
                        <span className="text-xs font-bold text-coffee-200">{(selectedUser as any).orderCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-coffee-600">Workshops</span>
                        <span className="text-xs font-bold text-coffee-200">{(selectedUser as any).workshopCount || 0}</span>
                      </div>
                   </div>
                </div>
             </div>
             <div className="p-8 border-t border-coffee-800 text-right">
                <button onClick={() => setSelectedUser(null)} className="px-6 py-2 bg-coffee-800 text-coffee-100 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-coffee-700 transition-colors">Close Dossier</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;