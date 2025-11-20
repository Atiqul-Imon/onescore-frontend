'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAuthHeaders } from '@/lib/auth';

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Admin</p>
          <h1 className="text-2xl font-semibold text-gray-900">Cricket teams</h1>
          <p className="text-sm text-gray-600">Manage hub content for each cricket nation.</p>
        </div>
        <Link
          href="/admin/teams/create"
          className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          New team
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Team</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Slug</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Ranking (Tests)</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Ranking (ODIs)</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Ranking (T20Is)</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Updated</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">Loading teams…</td>
              </tr>
            ) : teams.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No teams found.</td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr key={team.slug} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium text-gray-900">
                      <span>{team.flag}</span>
                      {team.name}
                    </div>
                    <p className="text-xs text-gray-500">{team.shortName}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{team.slug}</td>
                  <td className="px-4 py-3 text-gray-700">{team.ranking?.test ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{team.ranking?.odi ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{team.ranking?.t20 ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {team.updatedAt ? new Date(team.updatedAt).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/teams/${team.slug}`}
                      className="rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

