'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Flag, MapPin, AlarmCheck } from 'lucide-react';
import { Container, Card, Button } from '@/components/ui';
import { format } from 'date-fns';

type MatchStatus = 'live' | 'upcoming' | 'final';

interface FootballMatch {
  id: string;
  competition: string;
  status: MatchStatus;
  kickoff: string;
  venue: string;
  country: string;
  teams: {
    home: { name: string; short: string; crest: string };
    away: { name: string; short: string; crest: string };
  };
  score: {
    home: number | null;
    away: number | null;
    minute?: string;
  };
  broadcast?: string;
}

const mockMatches: FootballMatch[] = [
  {
    id: 'fixture-1',
    competition: 'UEFA Champions League',
    status: 'live',
    kickoff: new Date().toISOString(),
    venue: 'Etihad Stadium',
    country: 'England',
    teams: {
      home: { name: 'Manchester City', short: 'MCI', crest: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg' },
      away: { name: 'Real Madrid', short: 'RMA', crest: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg' },
    },
    score: {
      home: 2,
      away: 1,
      minute: "67'",
    },
    broadcast: 'Sony LIV',
  },
  {
    id: 'fixture-2',
    competition: 'Premier League',
    status: 'upcoming',
    kickoff: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    venue: 'Anfield',
    country: 'England',
    teams: {
      home: { name: 'Liverpool', short: 'LIV', crest: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg' },
      away: { name: 'Arsenal', short: 'ARS', crest: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' },
    },
    score: { home: null, away: null },
    broadcast: 'Hotstar',
  },
  {
    id: 'fixture-3',
    competition: 'Serie A',
    status: 'final',
    kickoff: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    venue: 'San Siro',
    country: 'Italy',
    teams: {
      home: { name: 'Inter Milan', short: 'INT', crest: 'https://upload.wikimedia.org/wikipedia/en/0/05/FC_Internazionale_Milano_2021.svg' },
      away: { name: 'Juventus', short: 'JUV', crest: 'https://upload.wikimedia.org/wikipedia/en/1/15/Juventus_FC_2017_logo.svg' },
    },
    score: { home: 3, away: 2 },
    broadcast: 'FanCode',
  },
];

function formatKickoff(iso: string) {
  const date = new Date(iso);
  return `${format(date, 'EEE, MMM d')} · ${format(date, 'HH:mm')} IST`;
}

function getStatusPill(status: MatchStatus, minute?: string) {
  switch (status) {
    case 'live':
      return <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">Live {minute && <span className="text-red-300">{minute}</span>}</span>;
    case 'upcoming':
      return <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">Upcoming</span>;
    case 'final':
      return <span className="inline-flex items-center gap-2 rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-300">Full Time</span>;
    default:
      return null;
  }

}

export function FootballLiveMatches() {
  const [matches, setMatches] = useState<FootballMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMatches(mockMatches);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timeout);
  }, []);

  const items: (FootballMatch | { skeleton: true; id: string })[] = loading
    ? Array.from({ length: 3 }, (_, i) => ({ skeleton: true, id: `skeleton-${i}` }))
    : matches;

  return (
    <section className="section-padding bg-gray-100">
      <Container size="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h2 className="heading-2">Live & Upcoming Fixtures</h2>
            <p className="body-text text-gray-600">
              Track Champions League nights, Premier League blockbuster fixtures, and Serie A thrillers in one dashboard.
            </p>
          </div>
          <Button variant="outline">View Full Calendar</Button>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((match, index) => {
            const isSkeleton = 'skeleton' in match;
            const key = isSkeleton ? match.id : (match as FootballMatch).id;
            const fixture = match as FootballMatch;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card variant="interactive" padding="lg" className="h-full">
                  {isSkeleton ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 w-32 rounded bg-gray-200" />
                      <div className="h-6 w-48 rounded bg-gray-200" />
                      <div className="h-24 rounded bg-gray-200" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="font-semibold text-emerald-600">{fixture.competition}</span>
                        {getStatusPill(fixture.status, fixture.score.minute)}
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                        {[fixture.teams.home, fixture.teams.away].map((team) => (
                          <div key={team.short} className="flex w-1/2 flex-col items-center gap-2">
                            <img src={team.crest} alt={team.name} className="h-10 w-10 rounded-full bg-white p-1 shadow-inner" />
                            <div className="text-sm font-semibold text-gray-800">{team.name}</div>
                            <div className="text-xs text-gray-500">{team.short}</div>
                          </div>
                        ))}
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="text-2xl font-bold text-gray-900">
                            {fixture.score.home ?? '-'} : {fixture.score.away ?? '-'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {fixture.broadcast ?? 'Broadcast: TBD'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-emerald-500" />
                          {formatKickoff(fixture.kickoff)}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-500" />
                          {fixture.venue}
                        </div>
                        <div className="flex items-center gap-2">
                          <Flag className="w-4 h-4 text-emerald-500" />
                          {fixture.country}
                        </div>
                      </div>

                      {fixture.status === 'upcoming' && (
                        <Button variant="outline" fullWidth className="mt-4">
                          <AlarmCheck className="w-4 h-4" />
                          Set Reminder
                        </Button>
                      )}
                    </>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

