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
import { Tabs } from '@/components/ui/Tabs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ArrowLeft, RefreshCw, Calendar, MapPin, Trophy, BarChart3, MessageSquare } from 'lucide-react';
import Link from 'next/link';
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
      <div className="min-h-screen bg-gray-50 py-12">
        <Container size="2xl">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        </Container>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container size="2xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-red-900 mb-2">Match Not Found</h2>
            <p className="text-red-700">{error || 'The match you are looking for does not exist.'}</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header Section - Cricinfo Style */}
      <div className="bg-gradient-to-b from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Container size="2xl" className="py-6">
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Match Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/70 mb-3">
              <span className="inline-flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary-400" />
                {match.series || 'Cricket Match'}
              </span>
              <span>•</span>
              <span className="px-2 py-1 rounded bg-white/10 text-white/90 font-medium">
                {match.format?.toUpperCase() || 'MATCH'}
              </span>
              {match.status === 'live' && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 font-semibold">
                    <span className="live-dot bg-red-500 animate-pulse" />
                    LIVE
                  </span>
                </>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {match.teams.home.name} <span className="text-white/60 font-normal">vs</span> {match.teams.away.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {match.venue.name}, {match.venue.city}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(match.startTime).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Main Content */}
      <Container size="2xl" className="py-8">
        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Tabs with Scorecard, Stats & Commentary */}
          <div className="lg:col-span-2">
            <Tabs
              tabs={[
                { id: 'live', label: 'Live', icon: <Trophy className="h-4 w-4" /> },
                { id: 'scorecard', label: 'Scorecard', icon: <BarChart3 className="h-4 w-4" /> },
                ...(match.status === 'live' ? [{ id: 'commentary', label: 'Commentary', icon: <MessageSquare className="h-4 w-4" /> }] : []),
              ]}
              defaultTab="live"
            >
              {(activeTab) => {
                if (activeTab === 'live') {
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
                    <div className="space-y-6">
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

