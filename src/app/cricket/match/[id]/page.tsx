'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { MatchScorecard } from '@/components/cricket/MatchScorecard';
import { MatchCommentary } from '@/components/cricket/MatchCommentary';
import { MatchInfo } from '@/components/cricket/MatchInfo';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

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
}

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.id as string;
  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        if (response.status === 404) {
          notFound();
        }

        if (!response.ok) {
          throw new Error('Failed to load match details');
        }

        const json = await response.json();
        
        if (!json.success || !json.data) {
          throw new Error(json.message || 'Failed to load match details');
        }

        setMatch(json.data);
      } catch (err: any) {
        console.error('Error fetching match details:', err);
        setError(err.message || 'Failed to load match details');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();

    // Auto-refresh every 30 seconds for live matches
    const interval = setInterval(() => {
      if (match?.status === 'live') {
        fetchMatchDetails();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [matchId, match?.status]);

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
      <Container size="2xl" className="py-8">
        {/* Match Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>{match.series || 'Cricket Match'}</span>
            <span>•</span>
            <span>{match.format?.toUpperCase() || 'MATCH'}</span>
            {match.status === 'live' && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5 text-red-600 font-semibold">
                  <span className="live-dot bg-red-500" />
                  LIVE
                </span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {match.teams.home.name} vs {match.teams.away.name}
          </h1>
          <p className="text-gray-600 mt-1">
            {match.venue.name}, {match.venue.city}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Scorecard & Info */}
          <div className="lg:col-span-2 space-y-6">
            <MatchScorecard match={match} />
            {match.status === 'live' && <MatchCommentary matchId={matchId} />}
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

