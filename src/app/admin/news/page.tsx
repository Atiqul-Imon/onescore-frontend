'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getAuthHeaders } from '@/lib/auth';
import { StatCard } from '@/components/admin/ui/StatCard';
import { FileText, Filter, Layers3, PenSquare, Repeat, Tag } from 'lucide-react';

export default function AdminNewsList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
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
        qs.set('limit', '30');
        const res = await fetch(`${base}/api/v1/news?${qs.toString()}`, {
          cache: 'no-store',
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setItems(data?.data?.items || []);
        } else {
          setItems([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [state, searchParams]);

  const counts = useMemo(() => {
    const tally: Record<string, number> = {};
    items.forEach((item) => {
      tally[item.state] = (tally[item.state] || 0) + 1;
    });
    return tally;
  }, [items]);

  const updateState = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('state', value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Editorial control</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Newsroom pipeline</h1>
          <p className="mt-2 text-sm text-slate-500">
            Track every story from draft to publish with live state, ownership, and freshness.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            <Filter className="h-4 w-4" />
            <select
              value={state}
              onChange={(e) => updateState(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-900 outline-none"
            >
              {[
                { value: 'draft', label: 'Draft' },
                { value: 'in_review', label: 'In Review' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'published', label: 'Published' },
                { value: 'archived', label: 'Archived' },
              ].map((option) => (
                <option key={option.value} value={option.value} className="text-slate-900">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <Link
            href="/admin/news/create"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow"
          >
            <PenSquare className="h-4 w-4" />
            New Article
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Drafts"
          value={counts.draft ?? '—'}
          description="Awaiting first editorial touch"
          icon={<Layers3 className="h-5 w-5 text-slate-500" />}
        />
        <StatCard
          title="In review"
          value={counts.in_review ?? '—'}
          description="Editors reviewing content"
          icon={<FileText className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          title="Scheduled"
          value={counts.scheduled ?? '—'}
          description="Ready for timed release"
          icon={<Repeat className="h-5 w-5 text-indigo-500" />}
        />
        <StatCard
          title="Published"
          value={counts.published ?? '—'}
          description="Live stories with distribution"
          icon={<Tag className="h-5 w-5 text-primary-500" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Queue</p>
              <h2 className="text-lg font-semibold text-slate-900">
                {state.replace('_', ' ')} stories
              </h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {loading ? 'Loading…' : `${items.length} visible`}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Title</th>
                  <th className="px-6 py-3 text-left font-medium">Type</th>
                  <th className="px-6 py-3 text-left font-medium">Category</th>
                  <th className="px-6 py-3 text-left font-medium">Updated</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-slate-500">
                      Loading newsroom queue…
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-slate-500">
                      No stories in this lane.
                    </td>
                  </tr>
                ) : (
                  items.map((article) => (
                    <tr key={article._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{article.title}</p>
                        <p className="text-xs text-slate-500">
                          {article.author?.name || 'No author'} ·{' '}
                          {article.updatedAt ? new Date(article.updatedAt).toLocaleString() : '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {article.type?.replace('_', ' ') || '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-600 capitalize">{article.category}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {article.updatedAt ? new Date(article.updatedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/news/${article._id}/edit`}
                            prefetch={false}
                            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/${article.slug}`}
                            target="_blank"
                            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Queue snapshot</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Stories in lane</span>
                <strong className="text-slate-900">{loading ? '—' : items.length}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Unique authors</span>
                <strong className="text-slate-900">
                  {loading ? '—' : new Set(items.map((i) => i.author?._id || 'unknown')).size}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Most recent update</span>
                <strong className="text-slate-900">
                  {loading || items.length === 0
                    ? '—'
                    : new Date(items[0].updatedAt || items[0].createdAt).toLocaleTimeString()}
                </strong>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            <p className="font-semibold text-slate-700">Need more visibility?</p>
            <p className="mt-1">
              Coming soon: Kanban mode, ownership filters, and SLA breach alerts. Drop ideas in the
              product backlog thread.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


