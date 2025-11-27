"use client";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAuthHeaders } from '@/lib/auth';
import {
  AdminSurface,
  AdminToolbar,
  Button,
  Input,
  LoadingSpinner,
  Select,
  StatMetric,
} from '@/components/ui';

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

  const load = useCallback(async () => {
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
  }, [roleFilter, search]);

  useEffect(() => {
    load();
  }, [load]);

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

  const metrics = useMemo(() => {
    const total = items.length;
    const verified = items.filter((u) => u.isVerified).length;
    const admins = items.filter((u) => u.role === 'admin').length;
    return { total, verified, admins };
  }, [items]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">People Ops</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Users & roles</h1>
        <p className="mt-2 text-sm text-slate-500">
          Audit accounts, update roles, and keep the newsroom roster verified.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatMetric label="Total users" value={metrics.total} trend="All active accounts" />
        <StatMetric label="Verified" value={metrics.verified} trend="Email confirmed" />
        <StatMetric label="Admins" value={metrics.admins} trend="Core control center access" />
      </div>

      <AdminToolbar>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
          className="flex flex-1 flex-wrap gap-3"
        >
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="w-full min-w-[220px] flex-1"
          />
          <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-48">
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </Select>
          <Button type="submit" variant="secondary">
            Apply filters
          </Button>
        </form>
        <div className="flex items-center gap-3">
          <Button variant="outline">Export CSV</Button>
        </div>
      </AdminToolbar>

      <AdminSurface padded={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Verified</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                items.map((u) => (
                  <tr key={u._id} className="border-t border-slate-100">
                    <td className="px-5 py-3 font-medium text-slate-900">{u.name}</td>
                    <td className="px-5 py-3 text-slate-600">{u.email}</td>
                    <td className="px-5 py-3">
                      <Select
                        value={u.role}
                        onChange={(e) => updateUser(u._id, { role: e.target.value as any })}
                        className="w-36"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </Select>
                    </td>
                    <td className="px-5 py-3">
                      <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={u.isVerified}
                          onChange={(e) => updateUser(u._id, { isVerified: e.target.checked })}
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        Verified
                      </label>
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-500"
                        onClick={() => removeUser(u._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminSurface>
    </div>
  );
}


