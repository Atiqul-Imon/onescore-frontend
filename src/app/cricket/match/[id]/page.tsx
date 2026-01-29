'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { MatchScorecard } from '@/components/cricket/MatchScorecard';
import { MatchCommentary } from '@/components/cricket/MatchCommentary';
import { MatchInfo } from '@/components/cricket/MatchInfo';
import { MatchStats } from '@/components/cricket/MatchStats';
import { LiveScoreView } from '@/components/cricket/LiveScoreView';
import { CompletedMatchView } from '@/components/cricket/CompletedMatchView';
import { MatchHeader } from '@/components/cricket/MatchHeader';
import { Tabs } from '@/components/ui/Tabs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MatchHeaderSkeleton, LiveScoreSkeleton, ScorecardSkeleton } from '@/components/ui/Skeleton';
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

  // Initial fetch and WebSocket setup
  useEffect(() => {
    if (!matchId) return;

    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${base}/api/v1/cricket/matches/${matchId}`, {
          cache: 'no-store',
          next: { revalidate: 30 },
        });

        // Check status first
        if (response.status === 404) {
          notFound();
          return;
        }

        if (!response.ok) {
          // Try to get error message from response
          try {
            const errorJson = await response.json();
            throw new Error(errorJson.message || 'Failed to load match details');
          } catch {
            throw new Error(`Failed to load match details (${response.status})`);
          }
        }

        const json = await response.json();
        
        // Handle case where response indicates not found
        if (!json.success || json.statusCode === 404) {
          notFound();
          return;
        }
        
        // Handle case where data might be at root level (TransformInterceptor wraps it)
        const matchData = json.data || json;
        
        // Check if we have actual match data
        if (!matchData || (!matchData.matchId && !matchData._id && !matchData.id)) {
          throw new Error('Match data is invalid or empty');
        }

        setMatch(matchData);
      } catch (err: any) {
        console.error('Error fetching match details:', err);
        setError(err.message || 'Failed to load match details');
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
        <Container size="2xl" className="py-8">
          <div className="space-y-6">
            <LiveScoreSkeleton />
            <ScorecardSkeleton />
          </div>
        </Container>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container size="2xl">
          <ErrorState
            title="Match Not Found"
            message={error || 'The match you are looking for does not exist or may have been removed.'}
            showHomeButton
            showBackButton
            backHref="/"
            onRetry={() => window.location.reload()}
          />
        </Container>
      </div>
    );
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Match Header */}
      <MatchHeader match={match} onRefresh={handleRefresh} />

      {/* Main Content */}
      <Container size="2xl" className="py-4 sm:py-6 lg:py-8">
        {/* Main Content Grid */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Left Column - Tabs with Scorecard, Stats & Commentary */}
          <div className="lg:col-span-2">
            <Tabs
              tabs={[
                { id: 'live', label: match.status === 'completed' ? 'Summary' : 'Live' },
                { id: 'scorecard', label: 'Scorecard' },
                ...(match.status === 'live' ? [{ id: 'commentary', label: 'Commentary' }] : []),
              ]}
              defaultTab="live"
            >
              {(activeTab) => {
                if (activeTab === 'live') {
                  // Show completed match view for completed matches, live view for live matches
                  if (match.status === 'completed') {
                    return <CompletedMatchView match={match} />;
                  }
                  // Live tab: Show clean, focused live score view
                  return <LiveScoreView match={match} />;
                }
                if (activeTab === 'scorecard') {
                  // Scorecard tab: Show detailed statistics
                  // Use currentBatters/currentBowlers as fallback for live matches
                  const battingData = match.batting || (match.currentBatters ? match.currentBatters.map((b: any) => ({
                    ...b,
                    isOut: false, // Current batters are not out
                  })) : undefined);
                  const bowlingData = match.bowling || match.currentBowlers;
                  
                  return (
                    <div className="space-y-4 sm:space-y-6 overflow-x-hidden">
                      {(battingData || bowlingData) ? (
                        <MatchStats 
                          batting={battingData} 
                          bowling={bowlingData}
                          teams={match.teams}
                          matchId={matchId}
                        />
                      ) : (
                        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">
                          <p className="mb-2">Player statistics are not available yet.</p>
                          <p className="text-sm text-gray-500">
                            {match.status === 'live' 
                              ? 'Statistics will appear as players bat and bowl during the match.'
                              : 'Statistics will be available once the match progresses.'}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }
                if (activeTab === 'commentary' && match.status === 'live') {
                  return <MatchCommentary matchId={matchId} />;
                }
                return null;
              }}
            </Tabs>
          </div>

          {/* Right Column - Match Info */}
          <div className="lg:col-span-1">
            <MatchInfo match={match} />
          </div>
        </div>
      </Container>
    </div>
  );
}

