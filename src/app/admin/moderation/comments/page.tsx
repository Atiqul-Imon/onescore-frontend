"use client";
import { useEffect, useState } from 'react';
import { getAuthHeaders } from '@/lib/auth';

export default function ModerationCommentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/comments/reports`, { headers: getAuthHeaders(), cache: 'no-store' });
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
      await fetch(`${base}/api/comments/${id}/hide`, { method: 'POST', headers: getAuthHeaders() });
    } else {
      await fetch(`${base}/api/comments/${id}/reports/resolve`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: type })
      });
    }
    load();
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Comment Moderation</h1>
      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-3 py-2">Comment</th>
              <th className="text-left px-3 py-2">Author</th>
              <th className="text-left px-3 py-2">Thread</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-3 py-6">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={4} className="px-3 py-6 text-red-600">{error}</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="px-3 py-6 text-gray-500">No reported comments.</td></tr>
            ) : items.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="px-3 py-2 max-w-[480px]"><div className="line-clamp-2">{c.content}</div></td>
                <td className="px-3 py-2">{c.author?.name || '-'}</td>
                <td className="px-3 py-2">{c.thread?.title || '-'}</td>
                <td className="px-3 py-2 text-right">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => action(c._id, 'dismiss')} className="px-2 py-1 border rounded-md">Approve</button>
                    <button onClick={() => action(c._id, 'actioned')} className="px-2 py-1 border rounded-md">Mark Resolved</button>
                    <button onClick={() => action(c._id, 'hide')} className="px-2 py-1 bg-red-600 text-white rounded-md">Hide</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


