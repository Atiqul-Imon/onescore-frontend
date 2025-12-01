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
  const [showingUpcoming, setShowingUpcoming] = useState(false);

  useEffect(() => {
    fetchMatches();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchMatches();
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Fetch both cricket and football live matches
      const [cricketLiveRes, footballLiveRes] = await Promise.allSettled([
        fetch(`${base}/api/cricket/matches/live`, {
          cache: 'no-store',
          next: { revalidate: 30 },
        }),
        fetch(`${base}/api/football/matches/live`, {
          cache: 'no-store',
          next: { revalidate: 30 },
        }),
      ]);

      let allLiveMatches: Match[] = [];
      
      // Process cricket live matches
      if (cricketLiveRes.status === 'fulfilled' && cricketLiveRes.value.ok) {
        const cricketJson = await cricketLiveRes.value.json();
        if (cricketJson.success && cricketJson.data && cricketJson.data.length > 0) {
          const cricketMatches = cricketJson.data.filter((match: Match) => 
            match.format && !match.league
          );
          allLiveMatches = [...allLiveMatches, ...cricketMatches];
        }
      }
      
      // Process football live matches
      if (footballLiveRes.status === 'fulfilled' && footballLiveRes.value.ok) {
        const footballJson = await footballLiveRes.value.json();
        if (footballJson.success && footballJson.data && footballJson.data.length > 0) {
          const footballMatches = footballJson.data.filter((match: Match) => 
            match.league && !match.format
          );
          allLiveMatches = [...allLiveMatches, ...footballMatches];
        }
      }
      
      if (allLiveMatches.length > 0) {
        // Sort by status: live first
        allLiveMatches.sort((a, b) => {
          if (a.status === 'live' && b.status !== 'live') return -1;
          if (a.status !== 'live' && b.status === 'live') return 1;
          return 0;
        });
        setMatches(allLiveMatches);
        setShowingUpcoming(false);
        setLoading(false);
        return;
      }

      // If no live matches, try upcoming matches first
      const fixturesRes = await fetch(`${base}/api/cricket/matches/fixtures?limit=6`, {
        cache: 'no-store',
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (fixturesRes.ok) {
        const fixturesJson = await fixturesRes.json();
        
        if (fixturesJson.success && fixturesJson.data) {
          // Handle both direct array and nested fixtures property
          const fixturesData = Array.isArray(fixturesJson.data) 
            ? fixturesJson.data 
            : fixturesJson.data.fixtures || [];
          
          // Filter to show only cricket matches
          const cricketFixtures = fixturesData.filter((match: Match) => 
            match.format && !match.league
          );
          
          if (cricketFixtures.length > 0) {
            setMatches(cricketFixtures);
            setShowingUpcoming(true);
            setLoading(false);
            return;
          }
        }
      }

      // If no upcoming matches, fetch completed matches
      const resultsRes = await fetch(`${base}/api/cricket/matches/results?limit=6`, {
        cache: 'no-store',
        next: { revalidate: 3600 }, // Cache for 1 hour (completed matches don't change)
      });

      if (resultsRes.ok) {
        const resultsJson = await resultsRes.json();
        
        if (resultsJson.success && resultsJson.data) {
          const resultsData = resultsJson.data.results || [];
          
          // Filter to show only cricket matches
          const cricketResults = resultsData.filter((match: Match) => 
            match.format && !match.league
          );
          
          if (cricketResults.length > 0) {
            setMatches(cricketResults);
            setShowingUpcoming(false); // Not upcoming, but completed
            setLoading(false);
            return;
          }
        }
      }

      // If all fetches failed or returned no data
      setMatches([]);
      setShowingUpcoming(false);
    } catch (err: any) {
      const isConnectionError = err.message?.includes('Failed to fetch') || 
                               err.message?.includes('ERR_CONNECTION_REFUSED') ||
                               err.message?.includes('NetworkError');
      
      // In production, log all errors for monitoring
      // In development, only log non-connection errors
      if (process.env.NODE_ENV === 'production' || !isConnectionError) {
        console.error('Error fetching matches:', err);
      }
      
      // Only set error for non-connection issues (or in production)
      if (isConnectionError && process.env.NODE_ENV === 'development') {
        // Backend not available in dev - show empty state silently
        setMatches([]);
        setError(null);
        setShowingUpcoming(false);
      } else {
        // Production or real error - show error message
        setError(err.message || 'Failed to fetch matches');
        setMatches([]);
        setShowingUpcoming(false);
      }
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
        if (status === 'completed') return 'View Recap';
        return 'View Details';
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
            {showingUpcoming ? 'Upcoming' : 'Live Tracker'}
          </div>
              <h2 className="heading-2 mt-5 text-gray-900">
                {showingUpcoming 
                  ? 'Upcoming Matches' 
                  : matches.length > 0 && matches[0]?.status === 'completed'
                  ? 'Recent Results'
                  : 'Live Matches'}
              </h2>
              <p className="section-lede mt-4 text-gray-600">
                {showingUpcoming 
                  ? 'Check out the exciting matches coming up. Stay tuned for live action!'
                  : matches.length > 0 && matches[0]?.status === 'completed'
                  ? 'Catch up on the latest match results and highlights from recent games.'
                  : 'Follow every wicket, goal, and decisive moment. Updated in near real-time from our match center.'}
              </p>
        </motion.div>

        {matches.length === 0 && !loading ? (
          <div className="surface-panel text-center p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Clock className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="heading-4 mb-2">No matches available right now</h3>
            <p className="body-text text-gray-600">
              Check back later or explore our fixture calendar to plan what to watch next.
            </p>
          </div>
        ) : matches.length > 0 ? (
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
                      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusBadgeClasses[match.status] || statusBadgeClasses['upcoming']}`}>
                        {match.status === 'live' && <span className="live-dot bg-red-500" />}
                        {statusPillLabel[match.status] || statusPillLabel['upcoming']}
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
                        const isFootball = !!match.league && !match.format;
                        
                        // For cricket: runs/wickets, for football: goals (stored in runs field)
                        const scoreDisplay = currentInnings
                          ? isFootball
                            ? currentInnings.runs?.toString() || '0'
                            : `${currentInnings.runs}/${currentInnings.wickets}`
                          : typeof finalScore === 'number'
                          ? finalScore.toString()
                          : '—';
                        const subline = currentInnings
                          ? isFootball
                            ? 'Live'
                            : `${currentInnings.overs} ov`
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
        ) : null}

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
