"use client";
import { useEffect, useState } from 'react';
import { getAuthHeaders } from '@/lib/auth';
import { AdminSurface, AdminToolbar, Button, LoadingSpinner, StatMetric } from '@/components/ui';

export default function ModerationCommentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/v1/comments/reports`, { headers: getAuthHeaders(), cache: 'no-store' });
      const json = await res.json();
      setItems(json?.data?.items || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function action(id: string, type: 'dismiss' | 'actioned' | 'hide') {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    if (type === 'hide') {
      await fetch(`${base}/api/v1/comments/${id}/hide`, { method: 'POST', headers: getAuthHeaders() });
    } else {
      await fetch(`${base}/api/v1/comments/${id}/reports/resolve`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: type })
      });
    }
    load();
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Community Safety</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Comment moderation</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review reported comments, take quick actions, and keep the forums clean.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatMetric label="Pending reports" value={items.length} />
        <StatMetric label="Auto hidden" value={items.filter((c) => c.status === 'hidden').length} />
        <StatMetric label="Awaiting action" value={items.filter((c) => !c.status).length} />
      </div>

      <AdminToolbar>
        <div className="text-sm text-slate-500">
          {items.length} reports fetched from the last 48 hours.
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={load}>
            Refresh
          </Button>
        </div>
      </AdminToolbar>

      <AdminSurface padded={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Comment</th>
                <th className="px-5 py-3">Author</th>
                <th className="px-5 py-3">Thread</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-slate-500">
                    No reported comments.
                  </td>
                </tr>
              ) : (
                items.map((c) => (
                  <tr key={c._id} className="border-t border-slate-100">
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900 line-clamp-2">{c.content}</p>
                      <p className="text-xs text-slate-500">Reported {new Date(c.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="px-5 py-3">{c.author?.name || '-'}</td>
                    <td className="px-5 py-3">{c.thread?.title || '-'}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => action(c._id, 'dismiss')}>
                          Approve
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => action(c._id, 'actioned')}>
                          Mark resolved
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => action(c._id, 'hide')}>
                          Hide
                        </Button>
                      </div>
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


