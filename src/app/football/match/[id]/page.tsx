'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Tabs } from '@/components/ui/Tabs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MatchHeaderSkeleton, LiveScoreSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { trackMatchView } from '@/lib/analytics';

interface FootballMatchDetails {
  _id: string;
  matchId: string;
  name?: string;
  teams: {
    home: {
      id: string;
      name: string;
      shortName: string;
      logo?: string;
    };
    away: {
      id: string;
      name: string;
      shortName: string;
      logo?: string;
    };
  };
  venue: {
    name: string;
    city: string;
    country: string;
    capacity?: number;
  };
  status: 'live' | 'completed' | 'upcoming' | 'cancelled';
  league?: string;
  season?: string;
  startTime: string;
  endTime?: string;
  currentScore?: {
    home: {
      runs: number; // Goals for football
    };
    away: {
      runs: number; // Goals for football
    };
  };
  score?: {
    home: number;
    away: number;
    halftime?: {
      home: number;
      away: number;
    };
  };
  events?: Array<{
    id: string;
    type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'own_goal';
    player: string;
    team: string;
    minute: number;
    description: string;
    timestamp: string;
  }>;
  series?: string;
}

export default function FootballMatchDetailPage() {
  const params = useParams();
  const matchId = params.id as string;
  const [match, setMatch] = useState<FootballMatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track match view when match data is loaded
  useEffect(() => {
    if (match?.matchId || match?._id) {
      const id = match.matchId || match._id || matchId;
      const league = match.league || match.series || undefined;
      trackMatchView(id, 'football', league);
    }
  }, [match, matchId]);

  // Fetch match details
  useEffect(() => {
    if (!matchId) return;

    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${base}/api/v1/football/matches/${matchId}`, {
          cache: 'no-store',
          next: { revalidate: 30 },
        });

        if (response.ok) {
          const json = await response.json();

          if (!json.success || json.statusCode === 404) {
            notFound();
            return;
          }

          const matchData = json.data || json;

          if (!matchData || (!matchData.matchId && !matchData._id && !matchData.id)) {
            throw new Error('Match data is invalid or empty');
          }

          setMatch(matchData);
        } else if (response.status === 404) {
          notFound();
          return;
        } else {
          throw new Error(`Failed to load match details (${response.status})`);
        }
      } catch (err: any) {
        console.error('Error fetching match details:', err);
        if (err.message && !err.message.includes('404') && !err.message.includes('not found')) {
          setError(err.message || 'Failed to load match details');
        } else {
          notFound();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();

    // Set up auto-refresh polling for live matches
    let refreshInterval: NodeJS.Timeout | null = null;

    const checkAndRefresh = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${base}/api/v1/football/matches/${matchId}`, {
          cache: 'no-store',
        });

        if (response.ok) {
          const json = await response.json();
          const updatedMatch = json.data || json;
          if (updatedMatch && updatedMatch.matchId === matchId) {
            // Only update if match is live (don't refresh completed matches)
            if (updatedMatch.status === 'live') {
              setMatch(updatedMatch);
              console.log('[FootballMatchDetail] Auto-refresh: Match data updated');
            } else {
              // Match is no longer live, stop refreshing
              if (refreshInterval) {
                clearInterval(refreshInterval);
                refreshInterval = null;
              }
            }
          }
        }
      } catch (err) {
        console.error('[FootballMatchDetail] Auto-refresh error:', err);
      }
    };

    // Start auto-refresh after initial load (every 30 seconds for live matches)
    const startRefresh = setTimeout(() => {
      refreshInterval = setInterval(checkAndRefresh, 30000); // 30 seconds
    }, 5000);

    // Cleanup on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
      clearTimeout(startRefresh);
    };
  }, [matchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MatchHeaderSkeleton />
        <div className="w-full px-0 lg:px-8">
          <div className="max-w-[1400px] mx-auto py-2 sm:py-4 lg:py-8">
            <LiveScoreSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="w-full px-0 lg:px-8">
          <div className="max-w-[1400px] mx-auto">
            <ErrorState
              title="Match Not Found"
              message={
                error || 'The match you are looking for does not exist or may have been removed.'
              }
              showHomeButton
              showBackButton
              backHref="/"
              onRetry={() => window.location.reload()}
            />
          </div>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';
  const homeScore = match.currentScore?.home?.runs ?? match.score?.home ?? 0;
  const awayScore = match.currentScore?.away?.runs ?? match.score?.away ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Match Header */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="py-4 sm:py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {match.league || 'Football Match'}
                </h1>
                {match.venue && (
                  <p className="text-sm text-gray-600 mt-1">
                    {match.venue.name}, {match.venue.city}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase ${
                    isLive
                      ? 'border-red-200 bg-red-50 text-red-700'
                      : isCompleted
                        ? 'border-gray-200 bg-gray-50 text-gray-700'
                        : 'border-blue-200 bg-blue-50 text-blue-700'
                  }`}
                >
                  {isLive && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                  {isLive ? 'LIVE' : isCompleted ? 'FULL TIME' : 'UPCOMING'}
                </span>
                <button
                  onClick={handleRefresh}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Refresh match"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Teams and Score */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-right">
                <div className="font-bold text-lg sm:text-xl text-gray-900">
                  {match.teams.home.name}
                </div>
                <div className="text-sm text-gray-600">{match.teams.home.shortName}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {homeScore} - {awayScore}
                </div>
                {isLive && match.currentScore && (
                  <div className="text-xs text-red-600 mt-1 font-semibold">LIVE</div>
                )}
                {isCompleted && <div className="text-xs text-gray-600 mt-1">Full Time</div>}
              </div>
              <div className="text-left">
                <div className="font-bold text-lg sm:text-xl text-gray-900">
                  {match.teams.away.name}
                </div>
                <div className="text-sm text-gray-600">{match.teams.away.shortName}</div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <div className="w-full px-0 lg:px-8">
        <div className="max-w-[1400px] mx-auto py-2 sm:py-4 lg:py-8">
          <Tabs
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'events', label: 'Events' },
            ]}
            defaultTab="overview"
          >
            {(activeTab) => {
              if (activeTab === 'overview') {
                return (
                  <div className="space-y-6">
                    {/* Match Information */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Match Information
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">League</div>
                          <div className="font-semibold text-gray-900">{match.league || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Venue</div>
                          <div className="font-semibold text-gray-900">
                            {match.venue.name}, {match.venue.city}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Start Time</div>
                          <div className="font-semibold text-gray-900">
                            {new Date(match.startTime).toLocaleString()}
                          </div>
                        </div>
                        {match.endTime && (
                          <div>
                            <div className="text-sm text-gray-600">End Time</div>
                            <div className="font-semibold text-gray-900">
                              {new Date(match.endTime).toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    {match.score?.halftime && (
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                          Score Breakdown
                        </h2>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-sm text-gray-600">Half Time</div>
                            <div className="font-bold text-xl text-gray-900">
                              {match.score.halftime.home} - {match.score.halftime.away}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Full Time</div>
                            <div className="font-bold text-xl text-gray-900">
                              {homeScore} - {awayScore}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (activeTab === 'events') {
                return (
                  <div className="space-y-4">
                    {match.events && match.events.length > 0 ? (
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Match Events</h2>
                        <div className="space-y-3">
                          {match.events
                            .sort((a, b) => b.minute - a.minute)
                            .map((event) => (
                              <div
                                key={event.id}
                                className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-200"
                              >
                                <div className="flex-shrink-0 w-12 text-center">
                                  <div className="text-sm font-semibold text-gray-900">
                                    {event.minute}'
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">{event.player}</div>
                                  <div className="text-sm text-gray-600">{event.description}</div>
                                </div>
                                <div className="flex-shrink-0">
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                                      event.type === 'goal'
                                        ? 'bg-green-100 text-green-800'
                                        : event.type === 'yellow_card'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : event.type === 'red_card'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}
                                  >
                                    {event.type.replace('_', ' ').toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-600">
                        <p>No events available for this match yet.</p>
                      </div>
                    )}
                  </div>
                );
              }

              return null;
            }}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
