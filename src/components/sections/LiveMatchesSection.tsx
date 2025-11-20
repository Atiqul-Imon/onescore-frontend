'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Users, Trophy, TrendingUp } from 'lucide-react';
import { LoadingMatchCard } from '@/components/ui/LoadingSpinner';
import { Container, Button, Card } from '@/components/ui';
import { formatTime, formatRelativeTime } from '@/lib/utils';

interface Match {
  _id: string;
  matchId: string;
  detailUrl?: string;
  teams: {
    home: {
      name: string;
      shortName: string;
      flag: string;
    };
    away: {
      name: string;
      shortName: string;
      flag: string;
    };
  };
  venue: {
    name: string;
    city: string;
  };
  status: 'live' | 'completed' | 'upcoming';
  startTime: string;
  currentScore?: {
    home: {
      runs: number;
      wickets: number;
      overs: number;
    };
    away: {
      runs: number;
      wickets: number;
      overs: number;
    };
  };
  score?: {
    home: number;
    away: number;
  };
  format?: string;
  league?: string;
}

export function LiveMatchesSection() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLiveMatches();
  }, []);

  const fetchLiveMatches = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API calls
      const mockMatches: Match[] = [
        {
          _id: '1',
          matchId: 'cricket-1',
          detailUrl: '/cricket/leagues/world-test-championship',
          teams: {
            home: {
              name: 'India',
              shortName: 'IND',
              flag: '🇮🇳'
            },
            away: {
              name: 'Australia',
              shortName: 'AUS',
              flag: '🇦🇺'
            }
          },
          venue: {
            name: 'Melbourne Cricket Ground',
            city: 'Melbourne'
          },
          status: 'live',
          startTime: new Date().toISOString(),
          currentScore: {
            home: { runs: 245, wickets: 3, overs: 45.2 },
            away: { runs: 198, wickets: 7, overs: 40.0 }
          },
          format: 'ODI'
        },
        {
          _id: '2',
          matchId: 'football-1',
          detailUrl: '/football/leagues/premier-league',
          teams: {
            home: {
              name: 'Manchester United',
              shortName: 'MUN',
              flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
            },
            away: {
              name: 'Liverpool',
              shortName: 'LIV',
              flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
            }
          },
          venue: {
            name: 'Old Trafford',
            city: 'Manchester'
          },
          status: 'live',
          startTime: new Date().toISOString(),
          score: { home: 2, away: 1 },
          league: 'Premier League'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMatches(mockMatches);
    } catch (err) {
      setError('Failed to fetch live matches');
    } finally {
      setLoading(false);
    }
  };

  const statusBadgeClasses: Record<Match['status'], string> = {
    live: 'bg-red-50 text-red-600 border-red-100',
    upcoming: 'bg-blue-50 text-blue-700 border-blue-100',
    completed: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const statusPillLabel: Record<Match['status'], string> = {
    live: 'Live now',
    upcoming: 'Upcoming',
    completed: 'Completed',
  };

  const statusAccentRing: Record<Match['status'], string> = {
    live: 'ring-red-100',
    upcoming: 'ring-blue-100',
    completed: 'ring-gray-100',
  };

  const getCtaLabel = (status: Match['status']) => {
    if (status === 'live') return 'Watch Live';
    if (status === 'upcoming') return 'Match Center';
    return 'View Recap';
  };

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-b from-white via-gray-50 to-white">
        <Container size="2xl">
          <div className="mb-12 text-center">
            <div className="eyebrow mx-auto w-max gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              Live Tracker
            </div>
            <h2 className="heading-2 mt-5">Live Matches</h2>
            <p className="section-lede mt-3 text-gray-600">
              Real-time scores and broadcast-ready insights for cricket and football.
            </p>
          </div>
          <div className="card-grid-3">
            {[1, 2, 3].map((i) => (
              <LoadingMatchCard key={i} />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding bg-gradient-to-b from-white via-gray-50 to-white">
        <Container size="2xl">
          <div className="surface-panel text-center p-10">
            <h2 className="heading-2 mb-4">Live Matches</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gradient-to-b from-white via-gray-50 to-white">
      <Container size="2xl">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="eyebrow mx-auto w-max gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            Live Tracker
          </div>
          <h2 className="heading-2 mt-5 text-gray-900">Live Matches</h2>
          <p className="section-lede mt-4 text-gray-600">
            Follow every wicket, goal, and decisive moment. Updated in near real-time from our match center.
          </p>
        </motion.div>

        {matches.length === 0 ? (
          <div className="surface-panel text-center p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Clock className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="heading-4 mb-2">No live matches right now</h3>
            <p className="body-text text-gray-600">
              Check back later or explore our fixture calendar to plan what to watch next.
            </p>
          </div>
        ) : (
          <div className="card-grid-3">
            {matches.map((match, index) => (
              <motion.div
                key={match._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  variant="interactive"
                  className={`h-full rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-lg ring-1 ${statusAccentRing[match.status]}`}
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusBadgeClasses[match.status]}`}>
                        {match.status === 'live' && <span className="live-dot bg-red-500" />}
                        {statusPillLabel[match.status]}
                      </span>
                      <div className="text-right text-sm text-gray-500">
                        <div>{formatTime(match.startTime)}</div>
                        <div className="text-xs text-gray-400">
                          {formatRelativeTime(match.startTime)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {(['home', 'away'] as Array<'home' | 'away'>).map((side) => {
                        const team = match.teams[side];
                        const currentInnings = match.currentScore ? match.currentScore[side] : undefined;
                        const finalScore = typeof match.score?.[side] === 'number' ? match.score[side] : undefined;
                        const scoreDisplay = currentInnings
                          ? `${currentInnings.runs}/${currentInnings.wickets}`
                          : typeof finalScore === 'number'
                          ? finalScore.toString()
                          : '—';
                        const subline = currentInnings
                          ? `${currentInnings.overs} ov`
                          : match.status === 'upcoming'
                          ? 'Awaiting start'
                          : match.status === 'completed'
                          ? 'Full time'
                          : 'On air';

                        return (
                          <div key={side} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{team.flag}</span>
                              <div>
                                <div className="font-semibold text-gray-900">{team.name}</div>
                                <div className="text-sm text-gray-500">{team.shortName}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">{scoreDisplay}</div>
                              <div className="text-sm text-gray-500">{subline}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                      <div className="flex items-center justify-between text-gray-700">
                        <span className="inline-flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-emerald-500" />
                          {match.format || match.league || 'Match'}
                        </span>
                        <span className="inline-flex items-center gap-2 text-gray-500">
                          <Users className="h-4 w-4 text-gray-400" />
                          {match.venue.name}
                        </span>
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-wide text-gray-400">
                        {match.venue.city}
                      </div>
                    </div>

                    <div>
                      {match.detailUrl ? (
                        <Button fullWidth asChild>
                          <Link href={match.detailUrl}>
                            {getCtaLabel(match.status)}
                          </Link>
                        </Button>
                      ) : (
                        <Button fullWidth disabled>
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {matches.length > 0 && (
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button variant="outline" asChild>
              <Link href="/fixtures" className="inline-flex items-center gap-2">
                View All Matches
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
