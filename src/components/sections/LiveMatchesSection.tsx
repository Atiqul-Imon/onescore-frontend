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

// Demo matches for when no real data is available (demo mode)
const demoLiveMatches: Match[] = [
  {
    _id: 'demo-1',
    matchId: 'demo-1',
    teams: {
      home: { name: 'India', shortName: 'IND', flag: '🇮🇳' },
      away: { name: 'Australia', shortName: 'AUS', flag: '🇦🇺' },
    },
    status: 'live',
    currentScore: {
      home: { runs: 187, wickets: 4, overs: 18.3 },
      away: { runs: 165, wickets: 6, overs: 20.0 },
    },
    format: 'T20I',
    venue: { name: 'Melbourne Cricket Ground', city: 'Melbourne' },
    startTime: new Date().toISOString(),
  },
  {
    _id: 'demo-2',
    matchId: 'demo-2',
    teams: {
      home: { name: 'England', shortName: 'ENG', flag: '🏴' },
      away: { name: 'Pakistan', shortName: 'PAK', flag: '🇵🇰' },
    },
    status: 'live',
    currentScore: {
      home: { runs: 142, wickets: 2, overs: 15.2 },
      away: { runs: 0, wickets: 0, overs: 0 },
    },
    format: 'ODI',
    venue: { name: 'Lord\'s Cricket Ground', city: 'London' },
    startTime: new Date().toISOString(),
  },
  {
    _id: 'demo-3',
    matchId: 'demo-3',
    teams: {
      home: { name: 'New Zealand', shortName: 'NZ', flag: '🇳🇿' },
      away: { name: 'South Africa', shortName: 'SA', flag: '🇿🇦' },
    },
    status: 'live',
    currentScore: {
      home: { runs: 89, wickets: 1, overs: 12.4 },
      away: { runs: 234, wickets: 8, overs: 50.0 },
    },
    format: 'ODI',
    venue: { name: 'Eden Park', city: 'Auckland' },
    startTime: new Date().toISOString(),
  },
  {
    _id: 'demo-4',
    matchId: 'demo-4',
    teams: {
      home: { name: 'Bangladesh', shortName: 'BAN', flag: '🇧🇩' },
      away: { name: 'Sri Lanka', shortName: 'SL', flag: '🇱🇰' },
    },
    status: 'live',
    currentScore: {
      home: { runs: 156, wickets: 3, overs: 16.5 },
      away: { runs: 0, wickets: 0, overs: 0 },
    },
    format: 'T20I',
    venue: { name: 'Sher-e-Bangla National Stadium', city: 'Dhaka' },
    startTime: new Date().toISOString(),
  },
];

export function LiveMatchesSection() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showingUpcoming, setShowingUpcoming] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

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
        setIsDemoMode(false);
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
            setIsDemoMode(false);
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
            setIsDemoMode(false);
            setLoading(false);
            return;
          }
        }
      }

      // If all fetches failed or returned no data, use demo matches
      if (allLiveMatches.length === 0) {
        setMatches(demoLiveMatches);
        setIsDemoMode(true);
        setShowingUpcoming(false);
        setLoading(false);
        return;
      }

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
      
      // Show demo matches if there's an error or no connection (demo mode)
      if (isConnectionError || process.env.NODE_ENV === 'development') {
        setMatches(demoLiveMatches);
        setIsDemoMode(true);
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
            {isDemoMode && (
              <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                Demo
              </span>
            )}
          </div>
              <h2 className="heading-2 mt-5 text-gray-900">
                {matches.length > 0 && matches[0]?.status === 'completed'
                  ? 'Recent Results'
                  : showingUpcoming 
                  ? 'Upcoming Matches' 
                  : 'Live Matches'}
              </h2>
              <p className="section-lede mt-4 text-gray-600">
                {isDemoMode 
                  ? 'Showing demo matches. Real-time data will appear when live matches are available.'
                  : matches.length > 0 && matches[0]?.status === 'completed'
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
                          <Trophy className="h-4 w-4 text-primary-500" />
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
