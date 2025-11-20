'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAuthHeaders } from '@/lib/auth';
import { Activity, AlertTriangle, Clock, Rocket, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/admin/ui/StatCard';
import Link from 'next/link';

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
          fetch(`${base}/api/admin/logs?lines=80`, { cache: 'no-store', headers: getAuthHeaders() }),
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

  const k = kpis || {};
  const activity = useMemo(
    () =>
      logs
        ? logs
            .split('\n')
            .filter((line) => line.trim().length > 5)
            .slice(-10)
            .reverse()
        : [],
    [logs],
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
        Preparing command center…
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Operations Overview</p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Realtime command dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">
              Monitor editorial pipelines, live content velocity, and platform health at a glance.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/news/create"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"
            >
              <Rocket className="h-4 w-4 text-emerald-500" />
              Launch Story
            </Link>
            <Link
              href="/admin/teams/create"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"
            >
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Add Team Hub
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Articles shipped"
          value={k.publishedToday ?? '—'}
          description="Last 24 hours vs rolling avg"
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
        />
        <StatCard
          title="Review queue"
          value={k.pendingReview ?? '—'}
          description="Stories awaiting editorial approval"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          title="Scheduled drops"
          value={k.scheduled ?? '—'}
          description="Ready to go live this week"
          icon={<Rocket className="h-5 w-5 text-indigo-500" />}
        />
        <StatCard
          title="Total users"
          value={k.totalUsers ?? '—'}
          description="Verified audience across products"
          icon={<Activity className="h-5 w-5 text-pink-500" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Editorial health</h2>
                <p className="text-sm text-slate-500">
                  Combined signal from newsroom, QA queue, and publishing cadence.
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">
                Stable
              </span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Average turnaround</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {k.avgReviewHours ?? '—'}h
                </p>
                <p className="text-xs text-slate-500">From draft to publish</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Incidents</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{k.incidents24h ?? 0}</p>
                <p className="text-xs text-slate-500">Last 24 hours</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Fast lanes</span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { title: 'New article', description: 'Spin up a newsroom draft', href: '/admin/news/create' },
                { title: 'Review queue', description: 'Approve or request edits', href: '/admin/news?state=in_review' },
                { title: 'Team update', description: 'Refresh hub data', href: '/admin/teams' },
              ].map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:border-slate-300"
                >
                  <p className="text-sm font-semibold text-slate-900">{action.title}</p>
                  <p className="mt-2 text-xs text-slate-500">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
              <Link
                href="/api/admin/logs"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                target="_blank"
                rel="noreferrer"
              >
                View logs
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {activity.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                  No activity in the last few minutes.
                </div>
              ) : (
                activity.map((line, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                    <span className="rounded-full bg-white p-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    </span>
                    <p className="flex-1">{line}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Editorial SLA</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <div className="flex items-center justify-between">
                <span>Cricket longform</span>
                <span className="font-semibold text-slate-900">{k.cricketLongformSLA ?? '6h'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Football match reports</span>
                <span className="font-semibold text-slate-900">{k.footballReportSLA ?? '90m'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Breaking news alerts</span>
                <span className="font-semibold text-slate-900">{k.breakingAlertSLA ?? '15m'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



