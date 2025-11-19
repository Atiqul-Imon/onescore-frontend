'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAuthHeaders } from '@/lib/auth';

export default function AdminNewsList() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const state = searchParams.get('state') || 'draft';

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const qs = new URLSearchParams();
        if (state) qs.set('state', state);
        if (searchParams.get('type')) qs.set('type', searchParams.get('type')!);
        if (searchParams.get('category')) qs.set('category', searchParams.get('category')!);
        qs.set('limit', '20');
        const res = await fetch(`${base}/api/news?${qs.toString()}`, { cache: 'no-store', headers: getAuthHeaders() });
        if (res.ok) {
          const data = await res.json();
          setItems(data?.data?.items || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [state, searchParams]);

  return (
    <div className="p-6 space-y-4 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">News</h1>
        <Link href="/admin/news/create" prefetch={false} className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">New Article</Link>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
        <div className="flex flex-wrap gap-3">
          <select value={state} onChange={(e) => window.location.href = `/admin/news?state=${e.target.value}`} className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="draft">Draft</option>
            <option value="in_review">In Review</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <select className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">All types</option>
            <option value="breaking">Breaking</option>
            <option value="match_report">Match Report</option>
            <option value="analysis">Analysis</option>
            <option value="feature">Feature</option>
            <option value="interview">Interview</option>
            <option value="opinion">Opinion</option>
          </select>
          <select className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">All categories</option>
            <option value="cricket">Cricket</option>
            <option value="football">Football</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="text-left px-3 py-2 font-medium text-gray-700 dark:text-gray-300">Title</th>
              <th className="text-left px-3 py-2 font-medium text-gray-700 dark:text-gray-300">Type</th>
              <th className="text-left px-3 py-2 font-medium text-gray-700 dark:text-gray-300">Category</th>
              <th className="text-left px-3 py-2 font-medium text-gray-700 dark:text-gray-300">State</th>
              <th className="text-left px-3 py-2 font-medium text-gray-700 dark:text-gray-300">Updated</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">Loading...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">No articles found.</td>
              </tr>
            ) : items.map((a: any) => (
              <tr key={a._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-3 py-2 max-w-[420px]"><div className="line-clamp-1 text-gray-900 dark:text-white">{a.title}</div></td>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{a.type?.replace('_',' ')}</td>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{a.category}</td>
                <td className="px-3 py-2 capitalize text-gray-700 dark:text-gray-300">{a.state}</td>
                <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{a.updatedAt ? new Date(a.updatedAt).toLocaleString() : '-'}</td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/news/${a._id}/edit`} prefetch={false} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Edit</Link>
                    <a href={`/${a.slug}`} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors" target="_blank">View</a>
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


