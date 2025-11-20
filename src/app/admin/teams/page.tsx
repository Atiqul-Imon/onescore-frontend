'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getAuthHeaders } from '@/lib/auth';
import { StatCard } from '@/components/admin/ui/StatCard';
import { ArrowUpRight, Globe2, Medal, Shield } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type TeamSummary = {
  slug: string;
  name: string;
  shortName: string;
  matchKey: string;
  flag: string;
  ranking?: { test?: number; odi?: number; t20?: number };
  updatedAt?: string;
};

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/admin/cricket/teams`, {
          cache: 'no-store',
          headers: getAuthHeaders(),
        });
        if (!res.ok) {
          throw new Error('Failed to load teams');
        }
        const json = await res.json();
        setTeams(json.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const { totalTeams, rankedTeams, topTest, topOdi } = useMemo(() => {
    const total = teams.length;
    const ranked = teams.filter((team) => team.ranking?.test || team.ranking?.odi || team.ranking?.t20).length;
    const sortedBy = (format: 'test' | 'odi') =>
      [...teams].sort((a, b) => (a.ranking?.[format] ?? 99) - (b.ranking?.[format] ?? 99))[0];
    return {
      totalTeams: total,
      rankedTeams: ranked,
      topTest: sortedBy('test'),
      topOdi: sortedBy('odi'),
    };
  }, [teams]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Team Intelligence</p>
          <h1 className="text-3xl font-semibold text-slate-900">National hubs control</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage branding, metadata, and rankings for every cricket-playing nation.
          </p>
        </div>
        <Link
          href="/admin/teams/create"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-500"
        >
          <ArrowUpRight className="h-4 w-4" />
          New team hub
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total teams"
          value={loading ? '—' : totalTeams}
          description="Active hubs across cricket nations"
          icon={<Globe2 className="h-5 w-5 text-blue-500" />}
        />
        <StatCard
          title="Ranked nations"
          value={loading ? '—' : rankedTeams}
          description="Teams with ICC rankings synced"
          icon={<Shield className="h-5 w-5 text-slate-500" />}
        />
        <StatCard
          title="Top Test nation"
          value={topTest ? topTest.shortName : '—'}
          description={topTest?.ranking?.test ? `ICC #${topTest.ranking.test}` : 'Pending data'}
          icon={<Medal className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          title="Top ODI nation"
          value={topOdi ? topOdi.shortName : '—'}
          description={topOdi?.ranking?.odi ? `ICC #${topOdi.ranking.odi}` : 'Pending data'}
          icon={<Medal className="h-5 w-5 text-emerald-500" />}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Directory</p>
            <h2 className="text-lg font-semibold text-slate-900">Cricket national teams</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {loading ? 'Loading…' : `${teams.length} teams`}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Team</th>
                <th className="px-6 py-3 text-left font-medium">Slug</th>
                <th className="px-6 py-3 text-left font-medium">Test</th>
                <th className="px-6 py-3 text-left font-medium">ODI</th>
                <th className="px-6 py-3 text-left font-medium">T20I</th>
                <th className="px-6 py-3 text-left font-medium">Updated</th>
                <th className="px-6 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-slate-500">
                    Loading team data…
                  </td>
                </tr>
              ) : teams.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-slate-500">
                    No teams found.
                  </td>
                </tr>
              ) : (
                teams.map((team) => (
                  <tr key={team.slug} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{team.flag}</span>
                        <div>
                          <p className="font-semibold text-slate-900">{team.name}</p>
                          <p className="text-xs text-slate-500">{team.shortName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{team.slug}</td>
                    <td className="px-6 py-4 text-slate-600">{team.ranking?.test ?? '—'}</td>
                    <td className="px-6 py-4 text-slate-600">{team.ranking?.odi ?? '—'}</td>
                    <td className="px-6 py-4 text-slate-600">{team.ranking?.t20 ?? '—'}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {team.updatedAt ? new Date(team.updatedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/teams/${team.slug}`}
                          className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
                        >
                          Edit
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
    </div>
  );
}

