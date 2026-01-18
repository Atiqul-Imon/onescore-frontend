'use client';

import { Card } from '@/components/ui/Card';
import { Trophy, Clock } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface MatchScorecardProps {
  match: {
    _id: string;
    matchId: string;
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
    status: 'live' | 'completed' | 'upcoming' | 'cancelled';
    format: string;
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
  };
}

export function MatchScorecard({ match }: MatchScorecardProps) {
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';
  const isUpcoming = match.status === 'upcoming';

  const getScoreDisplay = (side: 'home' | 'away') => {
    if (isLive && match.currentScore) {
      const score = match.currentScore[side];
      return {
        runs: score.runs,
        wickets: score.wickets,
        overs: `${score.overs}.${score.balls}`,
        full: `${score.runs}/${score.wickets} (${score.overs}.${score.balls} ov)`,
      };
    }
    if (isCompleted && match.score) {
      return {
        runs: match.score[side],
        wickets: undefined,
        overs: undefined,
        full: match.score[side].toString(),
      };
    }
    return {
      runs: 0,
      wickets: undefined,
      overs: undefined,
      full: '—',
    };
  };

  const homeScore = getScoreDisplay('home');
  const awayScore = getScoreDisplay('away');

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5" />
            <span className="font-semibold text-lg">Scorecard</span>
          </div>
          {isLive && (
            <div className="flex items-center gap-2">
              <span className="live-dot bg-white" />
              <span className="text-sm font-medium">Live</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Team 1 Score */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{match.teams.home.flag}</span>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{match.teams.home.name}</h3>
                <p className="text-sm text-gray-500">{match.teams.home.shortName}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{homeScore.runs}</div>
              {homeScore.wickets !== undefined && (
                <div className="text-sm text-gray-600">
                  {homeScore.wickets} wickets • {homeScore.overs} overs
                </div>
              )}
            </div>
          </div>
          {homeScore.overs && (
            <div className="text-sm text-gray-600 mt-2">
              Run Rate: {((homeScore.runs / parseFloat(homeScore.overs)) || 0).toFixed(2)}
            </div>
          )}
        </div>

        {/* Team 2 Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{match.teams.away.flag}</span>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{match.teams.away.name}</h3>
                <p className="text-sm text-gray-500">{match.teams.away.shortName}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{awayScore.runs}</div>
              {awayScore.wickets !== undefined && (
                <div className="text-sm text-gray-600">
                  {awayScore.wickets} wickets • {awayScore.overs} overs
                </div>
              )}
            </div>
          </div>
          {awayScore.overs && (
            <div className="text-sm text-gray-600 mt-2">
              Run Rate: {((awayScore.runs / parseFloat(awayScore.overs)) || 0).toFixed(2)}
            </div>
          )}
        </div>

        {/* Match Status */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {isUpcoming 
                  ? `Starts at ${formatTime(match.startTime)}`
                  : isLive
                  ? 'In Progress'
                  : `Completed at ${formatTime(match.startTime)}`
                }
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
              {match.format?.toUpperCase() || 'MATCH'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

