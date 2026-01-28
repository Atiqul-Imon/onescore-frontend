'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
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

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Fetch both cricket and football live matches
      // Use timestamp to bypass backend cache for real-time updates
      const timestamp = Date.now();
      if (process.env.NODE_ENV === 'development') {
        console.log('[LiveMatchesSection] Fetching matches at', new Date().toLocaleTimeString());
      }
      const [cricketLiveRes, footballLiveRes] = await Promise.allSettled([
        fetch(`${base}/api/v1/cricket/matches/live?t=${timestamp}`, {
          cache: 'no-store',
          next: { revalidate: 0 },
        }),
        fetch(`${base}/api/v1/football/matches/live?t=${timestamp}`, {
          cache: 'no-store',
          next: { revalidate: 0 },
        }),
      ]);

      let allLiveMatches: Match[] = [];
      
      // Process cricket live matches
      if (cricketLiveRes.status === 'fulfilled' && cricketLiveRes.value.ok) {
        const cricketJson = await cricketLiveRes.value.json();
        // Handle both array response and object with data property
        const cricketData = Array.isArray(cricketJson) ? cricketJson : (cricketJson.data || cricketJson);
        const cricketMatches = Array.isArray(cricketData) ? cricketData : [];
        
        if (cricketMatches.length > 0) {
          const filteredCricketMatches = cricketMatches.filter((match: Match) => 
            match.format && !match.league
          );
          allLiveMatches = [...allLiveMatches, ...filteredCricketMatches];
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`[LiveMatchesSection] Found ${filteredCricketMatches.length} cricket live matches`);
          }
        }
      } else if (cricketLiveRes.status === 'rejected') {
        console.error('[LiveMatchesSection] Failed to fetch cricket live matches:', cricketLiveRes.reason);
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
      
      // Fetch upcoming matches to show alongside live matches (especially those starting soon)
      let upcomingMatches: Match[] = [];
      try {
        const fixturesRes = await fetch(`${base}/api/v1/cricket/matches/fixtures?limit=10`, {
          cache: 'no-store',
          next: { revalidate: 300 },
        });

        if (fixturesRes.ok) {
          const fixturesJson = await fixturesRes.json();
          if (fixturesJson.success && fixturesJson.data) {
            const fixturesData = Array.isArray(fixturesJson.data) 
              ? fixturesJson.data 
              : fixturesJson.data.fixtures || [];
            const cricketFixtures = fixturesData
              .filter((match: Match) => match.format && !match.league)
              .map((match: Match) => ({ ...match, status: 'upcoming' as const }));
            
            // Filter upcoming matches to show only those starting within next 6 hours
            const now = new Date();
            const sixHoursFromNow = new Date(now.getTime() + 6 * 60 * 60 * 1000);
            upcomingMatches = cricketFixtures.filter((match: Match) => {
              if (!match.startTime) return false;
              const matchStart = new Date(match.startTime);
              return matchStart > now && matchStart <= sixHoursFromNow;
            });

            // Sort upcoming matches by start time (soonest first)
            upcomingMatches.sort((a, b) => {
              const dateA = new Date(a.startTime || 0).getTime();
              const dateB = new Date(b.startTime || 0).getTime();
              return dateA - dateB;
            });
          }
        }
      } catch (upcomingError) {
        console.error('Error fetching upcoming matches:', upcomingError);
      }

      // Combine live and upcoming matches
      const combinedMatches = [...allLiveMatches, ...upcomingMatches];
      
      if (combinedMatches.length > 0) {
        // Sort: live matches first, then by start time
        combinedMatches.sort((a, b) => {
          // Live matches always come first
          if (a.status === 'live' && b.status !== 'live') return -1;
          if (a.status !== 'live' && b.status === 'live') return 1;
          
          // For live matches, sort by start time (most recent first)
          if (a.status === 'live' && b.status === 'live') {
            const dateA = new Date(a.startTime || 0).getTime();
            const dateB = new Date(b.startTime || 0).getTime();
            return dateB - dateA;
          }
          
          // For upcoming matches, sort by start time (soonest first)
          if (a.status === 'upcoming' && b.status === 'upcoming') {
            const dateA = new Date(a.startTime || 0).getTime();
            const dateB = new Date(b.startTime || 0).getTime();
            return dateA - dateB;
          }
          
          return 0;
        });
        
        setMatches(combinedMatches);
        setShowingUpcoming(combinedMatches.some(m => m.status === 'upcoming'));
        setLoading(false);
        return;
      }

      // If no live matches, fetch completed matches first (Cricinfo style)
      const resultsRes = await fetch(`${base}/api/v1/cricket/matches/results?limit=6`, {
        cache: 'no-store',
        next: { revalidate: 3600 }, // Cache for 1 hour (completed matches don't change)
      });

      if (resultsRes.ok) {
        const resultsJson = await resultsRes.json();
        
        if (resultsJson.success && resultsJson.data) {
          // Handle both direct array and nested results property
          const resultsData = Array.isArray(resultsJson.data) 
            ? resultsJson.data 
            : resultsJson.data.results || [];
          
          // Filter to show only cricket matches
          const cricketResults = resultsData
            .filter((match: Match) => match.format && !match.league)
            .map((match: Match) => ({ ...match, status: 'completed' as const }))
            .sort((a: Match, b: Match) => {
              // Sort by start time (most recent first)
              const dateA = new Date(a.startTime || 0).getTime();
              const dateB = new Date(b.startTime || 0).getTime();
              return dateB - dateA;
            });
          
          if (cricketResults.length > 0) {
            setMatches(cricketResults);
            setShowingUpcoming(false);
            setLoading(false);
            return;
          }
        }
      }

      // If no completed matches, try upcoming matches
      const fixturesRes = await fetch(`${base}/api/v1/cricket/matches/fixtures?limit=6`, {
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

      // If all fetches failed or returned no data, show empty state
      setMatches([]);
      setShowingUpcoming(false);
      setLoading(false);
    } catch (err: any) {
      const isConnectionError = err.message?.includes('Failed to fetch') || 
                               err.message?.includes('ERR_CONNECTION_REFUSED') ||
                               err.message?.includes('NetworkError');
      
      // In production, log all errors for monitoring
      // In development, only log non-connection errors
      if (process.env.NODE_ENV === 'production' || !isConnectionError) {
        console.error('Error fetching matches:', err);
      }
      
      // Show error message instead of demo matches
      setError(err.message || 'Failed to fetch matches');
      setMatches([]);
      setShowingUpcoming(false);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchMatches();
    
    // Auto-refresh every 15 seconds
    const interval = setInterval(() => {
      fetchMatches();
    }, 15000);
    
    return () => clearInterval(interval);
  }, [fetchMatches]);

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
              <TrendingUp className="h-3.5 w-3.5 text-primary-600" />
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
            <TrendingUp className="h-3.5 w-3.5 text-primary-600" />
            {matches.length > 0 && matches[0]?.status === 'completed'
              ? 'Recent Results'
              : showingUpcoming 
              ? 'Upcoming' 
              : 'Live Tracker'}
          </div>
              <h2 className="heading-2 mt-5 text-gray-900">
                {matches.length > 0 && matches[0]?.status === 'completed'
                  ? 'Recent Results'
                  : showingUpcoming 
                  ? 'Upcoming Matches' 
                  : 'Live Matches'}
              </h2>
              <p className="section-lede mt-4 text-gray-600">
                {matches.length > 0 && matches[0]?.status === 'completed'
                  ? 'Catch up on the latest match results and highlights from recent games.'
                  : showingUpcoming 
                  ? 'Check out the exciting matches coming up. Stay tuned for live action!'
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
                  className={`h-full rounded-2xl border border-gray-100 bg-white/90 p-4 sm:p-6 shadow-lg ring-1 ${statusAccentRing[match.status]}`}
                >
                  <div className="flex flex-col gap-4 sm:gap-5">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      <span className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-full border px-2 sm:px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusBadgeClasses[match.status] || statusBadgeClasses['upcoming']}`}>
                        {match.status === 'live' && <span className="live-dot bg-red-500" />}
                        <span className="hidden xs:inline">{statusPillLabel[match.status] || statusPillLabel['upcoming']}</span>
                        <span className="xs:hidden">{match.status === 'live' ? 'LIVE' : match.status === 'upcoming' ? 'UP' : 'END'}</span>
                      </span>
                      <div className="text-right text-xs sm:text-sm text-gray-500 flex-shrink-0">
                        <div className="hidden sm:block">{formatTime(match.startTime)}</div>
                        <div className="text-xs text-gray-400">
                          {formatRelativeTime(match.startTime)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
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
                          <div key={side} className="flex items-center justify-between gap-2 sm:gap-3">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                              <span className="text-xl sm:text-2xl flex-shrink-0">{team.flag}</span>
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{team.name}</div>
                                <div className="text-xs sm:text-sm text-gray-500">{team.shortName}</div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-xl sm:text-2xl font-bold text-gray-900">{scoreDisplay}</div>
                              <div className="text-xs sm:text-sm text-gray-500">{subline}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-gray-700">
                        <span className="inline-flex items-center gap-1.5 sm:gap-2">
                          <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-500 flex-shrink-0" />
                          <span className="truncate">{match.format || match.league || 'Match'}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-500">
                          <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{match.venue.name}</span>
                        </span>
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-wide text-gray-400 truncate">
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
