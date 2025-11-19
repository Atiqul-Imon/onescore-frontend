'use client';

import { useEffect, useState } from 'react';
import { getAuthHeaders } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<any>({});
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const [kpiRes, logRes] = await Promise.all([
          fetch(`${base}/api/admin/kpis`, { cache: 'no-store', headers: getAuthHeaders() }),
          fetch(`${base}/api/admin/logs?lines=100`, { cache: 'no-store', headers: getAuthHeaders() }),
        ]);
        if (kpiRes.ok) {
          const k = await kpiRes.json();
          setKpis(k?.data || {});
        }
        if (logRes.ok) {
          const l = await logRes.json();
          setLogs(l?.data || '');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-900 dark:text-white">Loading...</div>;
  }

  const k = kpis || {};
  
  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Articles Today</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{k.publishedToday ?? '-'}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Pending Review</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{k.pendingReview ?? '-'}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Scheduled</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{k.scheduled ?? '-'}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Users</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{k.totalUsers ?? '-'}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Logs</h2>
          <a className="text-sm text-blue-600 dark:text-blue-400 hover:underline" href="/api/admin/logs" target="_blank" rel="noopener noreferrer">Open Full</a>
        </div>
        <pre className="text-xs overflow-x-auto whitespace-pre-wrap max-h-80 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-3 rounded">{logs || 'No logs found.'}</pre>
      </div>
    </div>
  );
}



