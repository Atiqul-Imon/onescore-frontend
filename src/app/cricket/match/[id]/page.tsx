'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { LazyMatchScorecard, LazyMatchCommentary, LazyMatchStats } from '@/components/cricket/lazy';
import { MatchInfo } from '@/components/cricket/MatchInfo';
import { LiveScoreView } from '@/components/cricket/LiveScoreView';
import { CompletedMatchView } from '@/components/cricket/CompletedMatchView';
import { MatchHeader } from '@/components/cricket/MatchHeader';
import { CommunityMatchInfo } from '@/components/cricket/CommunityMatchInfo';
import { useLocalMatch } from '@/hooks/useLocalMatches';
import { isLocalMatch } from '@/lib/cricket/match-utils';
import { Tabs } from '@/components/ui/Tabs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  MatchHeaderSkeleton,
  LiveScoreSkeleton,
  ScorecardSkeleton,
} from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useSocket } from '@/contexts/SocketContext';

interface MatchDetails {
  _id: string;
  matchId: string;
  name?: string;
  teams: {
    home: {
      id: string;
      name: string;
      shortName: string;
      flag: string;
    };
    away: {
      id: string;
      name: string;
      shortName: string;
      flag: string;
    };
  };
  venue: {
    name: string;
    city: string;
    country: string;
  };
  status: 'live' | 'completed' | 'upcoming' | 'cancelled';
  format: string;
  series?: string;
  startTime: string;
  currentScore?: {
    home: {
      runs: number;
      wickets: number;
      overs: number;
      balls: number;
    };
    away: {
      runs: number;
      wickets: number;
      overs: number;
      balls: number;
    };
  };
  score?: {
    home: number;
    away: number;
  };
  innings?: Array<{
    number: number;
    team: string;
    runs: number;
    wickets: number;
    overs: number;
    balls: number;
    runRate: number;
  }>;
  players?: Array<{
    id: string;
    name: string;
    team: string;
    role: string;
    runs?: number;
    balls?: number;
    wickets?: number;
    overs?: number;
    economy?: number;
  }>;
  matchNote?: string;
  round?: string;
  tossWon?: string;
  elected?: string;
  target?: number;
  endingAt?: string;
  batting?: Array<{
    playerId?: string;
    playerName: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    isOut: boolean;
    teamName: string;
  }>;
  bowling?: Array<{
    playerId?: string;
    playerName: string;
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
    teamName: string;
  }>;
  currentBatters?: Array<{
    playerId?: string;
    playerName: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    teamName: string;
  }>;
  currentBowlers?: Array<{
    playerId?: string;
    playerName: string;
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
    teamName: string;
  }>;
  partnership?: {
    runs: number;
    balls: number;
    runRate: string;
  };
  lastWicket?: {
    playerName: string;
    runs: number;
    balls: number;
    fowScore?: number;
    fowBalls?: number;
  };
  result?: {
    winner: 'home' | 'away';
    winnerName: string;
    margin: number;
    marginType: 'runs' | 'wickets';
    resultText: string;
  };
}

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.id as string;
  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket, isConnected } = useSocket();

  // Try to fetch as local match if official API fails
  const { match: localMatch, loading: localLoading } = useLocalMatch(
    error && error.includes('404') ? matchId : null
  );

  // Initial fetch and WebSocket setup
  useEffect(() => {
    if (!matchId) return;

    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        // Check if this is a local match (starts with "LOCAL-")
        const isLocalMatchId = matchId.startsWith('LOCAL-');

        let matchData = null;
        let lastError: Error | null = null;

        // Strategy: For local match IDs, try local endpoint first, then official
        // For non-local IDs, try official first, then local as fallback

        if (isLocalMatchId) {
          // Try local matches API first for local match IDs
          try {
            const localResponse = await fetch(`${base}/api/v1/cricket/local/matches/${matchId}`, {
              cache: 'no-store',
              next: { revalidate: 30 },
            });

            if (localResponse.ok) {
              const localJson = await localResponse.json();
              if (localJson.success && localJson.data) {
                matchData = localJson.data;
              } else {
                lastError = new Error('Local match data is invalid');
              }
            } else if (localResponse.status === 404) {
              // Local match not found - try official endpoint as fallback
              lastError = new Error('Local match not found');
            } else {
              lastError = new Error(`Failed to load local match (${localResponse.status})`);
            }
          } catch (localErr: any) {
            console.error('Error fetching local match:', localErr);
            lastError = localErr;
          }
        }

        // If not found in local matches (or not a local match ID), try official endpoint
        if (!matchData) {
          try {
            const response = await fetch(`${base}/api/v1/cricket/matches/${matchId}`, {
              cache: 'no-store',
              next: { revalidate: 30 },
            });

            if (response.ok) {
              const json = await response.json();

              // Handle case where response indicates not found
              if (!json.success || json.statusCode === 404) {
                // If this is not a local match ID, show not found
                if (!isLocalMatchId) {
                  notFound();
                  return;
                }
                // If it is a local match ID, we already tried local endpoint
                throw lastError || new Error('Match not found');
              }

              // Handle case where data might be at root level (TransformInterceptor wraps it)
              matchData = json.data || json;

              // Check if we have actual match data
              if (!matchData || (!matchData.matchId && !matchData._id && !matchData.id)) {
                throw new Error('Match data is invalid or empty');
              }
            } else if (response.status === 404) {
              // If official endpoint returns 404
              if (!isLocalMatchId) {
                // For non-local IDs, try local endpoint as fallback
                try {
                  const localResponse = await fetch(
                    `${base}/api/v1/cricket/local/matches/${matchId}`,
                    {
                      cache: 'no-store',
                    }
                  );
                  if (localResponse.ok) {
                    const localJson = await localResponse.json();
                    if (localJson.success && localJson.data) {
                      matchData = localJson.data;
                    } else {
                      notFound();
                      return;
                    }
                  } else {
                    notFound();
                    return;
                  }
                } catch {
                  notFound();
                  return;
                }
              } else {
                // For local match IDs, we already tried local endpoint, so show not found
                notFound();
                return;
              }
            } else {
              throw new Error(`Failed to load match details (${response.status})`);
            }
          } catch (officialErr: any) {
            // If we have a lastError from local match attempt, use that
            if (lastError && isLocalMatchId) {
              throw lastError;
            }
            throw officialErr;
          }
        }

        if (matchData) {
          setMatch(matchData);
        } else {
          throw lastError || new Error('Match data not found');
        }
      } catch (err: any) {
        console.error('Error fetching match details:', err);
        // Don't show error if it's a 404 - let notFound() handle it
        if (err.message && !err.message.includes('404') && !err.message.includes('not found')) {
          setError(err.message || 'Failed to load match details');
        } else {
          notFound();
        }
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchMatchDetails();

    // Set up WebSocket subscription for live matches (WebSocket only, no polling)
    if (socket) {
      // Listen for match updates from WebSocket
      const handleMatchUpdate = (updatedMatch: MatchDetails) => {
        console.log('[MatchDetail] WebSocket update received:', updatedMatch);
        if (updatedMatch.matchId === matchId) {
          setMatch(updatedMatch);
        }
      };

      socket.on('match-update', handleMatchUpdate);

      // Subscribe to match updates (subscribe immediately if connected, or wait for connection)
      let connectHandler: (() => void) | null = null;

      if (isConnected) {
        socket.emit('subscribe:match', { matchId, sport: 'cricket' });
        console.log('[MatchDetail] Subscribed to WebSocket for match:', matchId);
      } else {
        // Wait for connection then subscribe
        connectHandler = () => {
          console.log('[MatchDetail] WebSocket connected, subscribing to match');
          socket.emit('subscribe:match', { matchId, sport: 'cricket' });
        };
        socket.on('connect', connectHandler);
      }

      // Cleanup on unmount
      return () => {
        socket.off('match-update', handleMatchUpdate);
        if (connectHandler) {
          socket.off('connect', connectHandler);
        }
        if (isConnected) {
          socket.emit('unsubscribe:match', { matchId, sport: 'cricket' });
        }
      };
    } else {
      // WebSocket will be available once SocketContext initializes
      // No action needed - SocketContext handles connection
    }
  }, [matchId, socket, isConnected]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MatchHeaderSkeleton />
        <div className="w-full px-0 lg:px-8">
          <div className="max-w-[1400px] mx-auto py-2 sm:py-4 lg:py-8">
            <div className="space-y-6">
              <LiveScoreSkeleton />
              <ScorecardSkeleton />
            </div>
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

  // Check if this is a local match
  const isLocal = match && (isLocalMatch(match as any) || localMatch);
  const displayMatch = localMatch && !match ? localMatch : match;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Match Header */}
      <MatchHeader match={displayMatch} onRefresh={handleRefresh} />

      {/* Main Content */}
      <div className="w-full px-0 lg:px-8">
        <div className="max-w-[1400px] mx-auto py-2 sm:py-4 lg:py-8">
          {/* Community Match Info - Show for local matches */}
          {isLocal && displayMatch && (
            <div className="mb-4 sm:mb-6">
              <CommunityMatchInfo match={displayMatch as any} />
            </div>
          )}
          {/* Main Content Grid */}
          <div
            className={`grid gap-4 sm:gap-6 ${displayMatch?.status === 'completed' ? 'lg:grid-cols-1' : 'lg:grid-cols-3'}`}
          >
            {/* Left Column - Tabs with Scorecard, Stats & Commentary */}
            <div
              className={displayMatch?.status === 'completed' ? 'lg:col-span-1' : 'lg:col-span-2'}
            >
              <Tabs
                tabs={[
                  { id: 'live', label: displayMatch?.status === 'completed' ? 'Summary' : 'Live' },
                  { id: 'scorecard', label: 'Scorecard' },
                ]}
                defaultTab="live"
              >
                {(activeTab) => {
                  if (activeTab === 'live') {
                    // Show completed match view for completed matches, live view for live matches
                    if (displayMatch?.status === 'completed') {
                      return <CompletedMatchView match={displayMatch} />;
                    }
                    // Live tab: Show clean, focused live score view
                    return <LiveScoreView match={displayMatch} />;
                  }
                  if (activeTab === 'scorecard') {
                    // Scorecard tab: Show detailed statistics
                    // Use currentBatters/currentBowlers as fallback for live matches
                    const matchData = displayMatch as MatchDetails;
                    const battingData =
                      matchData?.batting ||
                      (matchData?.currentBatters
                        ? matchData.currentBatters.map((b: any) => ({
                            ...b,
                            isOut: false, // Current batters are not out
                          }))
                        : undefined);
                    const bowlingData = matchData?.bowling || matchData?.currentBowlers;

                    return (
                      <div className="space-y-4 sm:space-y-6 overflow-x-hidden">
                        {battingData || bowlingData ? (
                          <LazyMatchStats
                            batting={battingData}
                            bowling={bowlingData}
                            teams={matchData?.teams}
                            matchId={matchId}
                          />
                        ) : (
                          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">
                            <p className="mb-2">Player statistics are not available yet.</p>
                            <p className="text-sm text-gray-500">
                              {matchData?.status === 'live'
                                ? 'Statistics will appear as players bat and bowl during the match.'
                                : 'Statistics will be available once the match progresses.'}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              </Tabs>
            </div>

            {/* Right Column - Match Info (Only for live/upcoming matches) */}
            {displayMatch?.status !== 'completed' && (
              <div className="lg:col-span-1">
                <MatchInfo match={displayMatch} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
