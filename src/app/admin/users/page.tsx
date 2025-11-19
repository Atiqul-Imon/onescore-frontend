"use client";
import { useEffect, useState } from 'react';
import { getAuthHeaders } from '@/lib/auth';

type User = {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  isVerified: boolean;
  createdAt?: string;
};

export default function AdminUsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const qs = new URLSearchParams();
      if (search) qs.set('search', search);
      if (roleFilter) qs.set('role', roleFilter);
      const res = await fetch(`${base}/api/users?${qs.toString()}`, { headers: getAuthHeaders(), cache: 'no-store' });
      const json = await res.json();
      setItems(json?.data?.users || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function updateUser(id: string, patch: Partial<User>) {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${base}/api/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(patch),
    });
    if (res.ok) load();
  }

  async function removeUser(id: string) {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${base}/api/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    if (res.ok) load();
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Users & Roles</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <form onSubmit={e => { e.preventDefault(); load(); }} className="flex flex-wrap gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email" className="border rounded-md px-3 py-2 text-sm w-64" />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="px-3 py-2 text-sm border rounded-md">Filter</button>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Email</th>
              <th className="text-left px-3 py-2">Role</th>
              <th className="text-left px-3 py-2">Verified</th>
              <th className="text-left px-3 py-2">Joined</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-3 py-6">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="px-3 py-6 text-red-600">{error}</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-3 py-6 text-gray-500">No users found.</td></tr>
            ) : items.map(u => (
              <tr key={u._id} className="border-t">
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">
                  <select value={u.role} onChange={e => updateUser(u._id, { role: e.target.value as any })} className="border rounded-md px-2 py-1">
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={u.isVerified} onChange={e => updateUser(u._id, { isVerified: e.target.checked })} />
                    <span>Verified</span>
                  </label>
                </td>
                <td className="px-3 py-2">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => removeUser(u._id)} className="px-2 py-1 border rounded-md text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


