'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Compass, Filter, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';

type TeamSummary = {
  slug: string;
  name: string;
  shortName: string;
  matchKey: string;
  flag: string;
  heroImage?: string;
  summary?: string;
  ranking?: { test?: number; odi?: number; t20?: number };
  captains?: { test?: string; odi?: string; t20?: string };
  coach?: string;
  fanPulse?: { rating: number; votes: number };
  colors?: { primary?: string; secondary?: string };
  iccTitles?: Array<{ name: string; year: number }>;
  updatedAt?: string;
};

type TeamsResponse = {
  success: boolean;
  data: TeamSummary[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const formats: Array<{ label: string; key: keyof NonNullable<TeamSummary['ranking']> }> = [
  { label: 'Tests', key: 'test' },
  { label: 'ODIs', key: 'odi' },
  { label: 'T20Is', key: 't20' },
];

export default function CricketTeamsPage() {
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<typeof formats[number]['key']>('test');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/cricket/teams`, { cache: 'no-store' });
        const json = (await response.json()) as TeamsResponse;
        if (!json.success) {
          throw new Error('Unable to load teams');
        }
        setTeams(json.data);
      } catch (err) {
        console.error('[cricket-teams] fetch error', err);
        setError('Unable to load teams right now. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  const sortedTeams = [...teams].sort((a, b) => {
    const rankA = a.ranking?.[selectedFormat] ?? Number.POSITIVE_INFINITY;
    const rankB = b.ranking?.[selectedFormat] ?? Number.POSITIVE_INFINITY;
    return rankA - rankB;
  });

  return (
    <div className="bg-slate-950 text-white">
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 sm:py-20">
        <Container size="2xl" className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
            <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-emerald-500/30 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/30 blur-[120px]" />
          </div>

          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Cricket nations</p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <h1 className="heading-1 !text-white leading-tight">Team intelligence hub</h1>
              <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                12 full-member nations
              </span>
            </div>
            <p className="text-base sm:text-lg text-white/80 max-w-3xl">
              Dive into Cricinfo-grade archives for each cricketing powerhouse: news streams, fixtures, fan pulse, history and stat leaders – all refreshed from our live data lake.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              Select a format to reshuffle ICC rankings instantly.
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              {formats.map((format) => (
                <button
                  key={format.key}
                  onClick={() => setSelectedFormat(format.key)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-standard ${
                    selectedFormat === format.key
                      ? 'bg-white text-slate-900'
                      : 'border border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  {format.label}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section-padding bg-white text-slate-900">
        <Container size="2xl">
          {error && (
            <div className="mb-8 rounded-3xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="h-72 animate-pulse rounded-3xl bg-slate-200" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedTeams.map((team) => (
                <Link
                  key={team.slug}
                  href={`/cricket/teams/${team.slug}`}
                  className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl"
                  style={{
                    borderColor: team.colors?.primary ? `${team.colors.primary}33` : undefined,
                  }}
                >
                  <div className="absolute inset-0 opacity-60">
                    {team.heroImage ? (
                      <Image
                        src={team.heroImage}
                        alt={team.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                    )}
                  </div>
                  <div className="relative z-10 flex h-full flex-col justify-between bg-gradient-to-b from-black/30 via-black/60 to-black/80 p-6 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{team.flag}</span>
                          <p className="text-sm uppercase tracking-[0.4em] text-white/70">{team.shortName}</p>
                        </div>
                        <h2 className="mt-2 text-2xl font-semibold">{team.name}</h2>
                        <p className="mt-2 text-sm text-white/80 line-clamp-2">{team.summary}</p>
                      </div>
                      <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                        #{team.ranking?.[selectedFormat] ?? '—'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-xs text-white/70">
                      <div>
                        <p className="font-semibold text-white">Captains</p>
                        <p>Tests: {team.captains?.test ?? '—'}</p>
                        <p>ODIs: {team.captains?.odi ?? '—'}</p>
                        <p>T20Is: {team.captains?.t20 ?? '—'}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-white">Coach</p>
                        <p>{team.coach ?? 'TBA'}</p>
                      </div>
                      <div className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1 font-semibold text-emerald-200">
                        <Compass className="h-3.5 w-3.5" />
                        Explore
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-600">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Data coverage</p>
              <p className="text-base text-slate-900">News, fixtures, stats and history for each nation – updated every 5 minutes.</p>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-full border border-slate-900 px-5 py-2 text-sm font-semibold text-slate-900 transition-standard hover:bg-slate-900 hover:text-white"
            >
              Latest newsroom
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}

