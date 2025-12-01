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
    fetchMatches();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchMatches();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Fetch live matches first
      const liveRes = await fetch(`${base}/api/football/matches/live`, {
        cache: 'no-store',
      });

      if (liveRes.ok) {
        const liveJson = await liveRes.json();
        if (liveJson.success && liveJson.data && liveJson.data.length > 0) {
          const transformedMatches = liveJson.data.map((match: any) => ({
            id: match.matchId || match._id,
            competition: match.league || 'Football Match',
            status: match.status === 'live' ? 'live' : match.status === 'completed' ? 'final' : 'upcoming',
            kickoff: match.startTime,
            venue: match.venue?.name || 'Unknown Venue',
            country: match.venue?.country || match.venue?.city || 'Unknown',
            teams: {
              home: {
                name: match.teams.home.name,
                short: match.teams.home.shortName,
                crest: match.teams.home.logo || '',
              },
              away: {
                name: match.teams.away.name,
                short: match.teams.away.shortName,
                crest: match.teams.away.logo || '',
              },
            },
            score: {
              home: match.currentScore?.home?.runs || match.score?.home || null,
              away: match.currentScore?.away?.runs || match.score?.away || null,
              minute: match.status === 'live' ? 'Live' : undefined,
            },
          }));
          setMatches(transformedMatches);
          setLoading(false);
          return;
        }
      }

      // If no live matches, fetch upcoming
      const fixturesRes = await fetch(`${base}/api/football/matches/fixtures?limit=6`, {
        cache: 'no-store',
      });

      if (fixturesRes.ok) {
        const fixturesJson = await fixturesRes.json();
        if (fixturesJson.success && fixturesJson.data) {
          const fixturesData = Array.isArray(fixturesJson.data) 
            ? fixturesJson.data 
            : fixturesJson.data.fixtures || [];
          
          const transformedMatches = fixturesData.map((match: any) => ({
            id: match.matchId || match._id,
            competition: match.league || 'Football Match',
            status: 'upcoming' as const,
            kickoff: match.startTime,
            venue: match.venue?.name || 'Unknown Venue',
            country: match.venue?.country || match.venue?.city || 'Unknown',
            teams: {
              home: {
                name: match.teams.home.name,
                short: match.teams.home.shortName,
                crest: match.teams.home.logo || '',
              },
              away: {
                name: match.teams.away.name,
                short: match.teams.away.shortName,
                crest: match.teams.away.logo || '',
              },
            },
            score: { home: null, away: null },
          }));
          setMatches(transformedMatches);
          setLoading(false);
          return;
        }
      }

      // Fallback to empty or mock data if API fails
      setMatches([]);
    } catch (error) {
      console.error('Error fetching football matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

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

