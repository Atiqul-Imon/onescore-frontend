'use client';

import { Card } from '@/components/ui/Card';
import { Trophy, Clock, Users, Target } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface LiveScoreViewProps {
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
    matchNote?: string;
    target?: number;
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
  };
}

export function LiveScoreView({ match }: LiveScoreViewProps) {
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';

  if (!isLive && !isCompleted) {
    return (
      <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-6 py-4">
          <div className="flex items-center gap-3 text-white">
            <Clock className="h-5 w-5 text-primary-100" />
            <span className="font-bold text-lg">Match Preview</span>
          </div>
        </div>
        <div className="p-6 text-center text-gray-600">
          <p className="text-lg font-semibold mb-2">Match hasn't started yet</p>
          <p className="text-sm">
            {formatTime(new Date(match.startTime))}
          </p>
        </div>
      </Card>
    );
  }

  const homeScore = match.currentScore?.home;
  const awayScore = match.currentScore?.away;

  // Calculate required run rate if chasing
  const calculateRRR = () => {
    if (!isLive || !homeScore || !awayScore || !match.target) return null;
    
    const runsNeeded = match.target - awayScore.runs;
    const ballsRemaining = (20 * 6) - ((awayScore.overs * 6) + awayScore.balls);
    
    if (ballsRemaining <= 0) return null;
    
    return ((runsNeeded / ballsRemaining) * 6).toFixed(2);
  };

  const requiredRR = calculateRRR();
  const currentRR = homeScore && awayScore && awayScore.overs > 0
    ? ((awayScore.runs / ((awayScore.overs * 6) + awayScore.balls)) * 6).toFixed(2)
    : null;

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-6 py-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-primary-100" />
            <span className="font-bold text-lg">Live Score</span>
          </div>
          {isLive && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30">
              <span className="live-dot bg-white animate-pulse" />
              <span className="text-sm font-semibold">LIVE</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Home Team Score */}
        <div className="border-b-2 border-gray-200 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{match.teams.home.flag}</span>
              <div>
                <h3 className="font-bold text-lg text-secondary-900">{match.teams.home.name}</h3>
                <p className="text-xs text-gray-600">{match.teams.home.shortName}</p>
              </div>
            </div>
            {homeScore && (
              <div className="text-right">
                <div className="text-3xl font-bold text-secondary-900">
                  {homeScore.runs}
                  {homeScore.wickets !== undefined && (
                    <span className="text-xl text-gray-600 font-normal">/{homeScore.wickets}</span>
                  )}
                </div>
                {homeScore.overs > 0 && (
                  <div className="text-sm text-gray-600 mt-1">
                    {homeScore.overs}.{homeScore.balls} overs
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Away Team Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{match.teams.away.flag}</span>
              <div>
                <h3 className="font-bold text-lg text-secondary-900">{match.teams.away.name}</h3>
                <p className="text-xs text-gray-600">{match.teams.away.shortName}</p>
              </div>
            </div>
            {awayScore && (
              <div className="text-right">
                <div className="text-3xl font-bold text-secondary-900">
                  {awayScore.runs}
                  {awayScore.wickets !== undefined && (
                    <span className="text-xl text-gray-600 font-normal">/{awayScore.wickets}</span>
                  )}
                </div>
                {awayScore.overs > 0 && (
                  <div className="text-sm text-gray-600 mt-1">
                    {awayScore.overs}.{awayScore.balls} overs
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Live Match Info - Cricinfo Style */}
          {isLive && awayScore && (
            <div className="mt-4 space-y-3">
              {/* Target and Run Rates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {match.target && (
                  <div className="px-4 py-2 rounded-lg bg-primary-50 border border-primary-200">
                    <span className="text-xs text-gray-600 block">Target</span>
                    <span className="text-sm font-bold text-primary-700">{match.target} runs</span>
                  </div>
                )}
                {requiredRR && (
                  <div className="px-4 py-2 rounded-lg bg-gray-50">
                    <span className="text-xs text-gray-600 block">Required RR</span>
                    <span className="text-sm font-semibold text-gray-900">{requiredRR}</span>
                  </div>
                )}
                {currentRR && (
                  <div className="px-4 py-2 rounded-lg bg-gray-50">
                    <span className="text-xs text-gray-600 block">Current RR</span>
                    <span className="text-sm font-semibold text-gray-900">{currentRR}</span>
                  </div>
                )}
              </div>

              {/* Current Batters */}
              {match.currentBatters && match.currentBatters.length > 0 ? (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-primary-600" />
                    <span className="text-sm font-semibold text-gray-700">Current Batters</span>
                  </div>
                  <div className="space-y-2">
                    {match.currentBatters.map((batter, idx) => (
                      <div key={batter.playerId || idx} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-gray-900">{batter.playerName}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">*</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            <span className="font-medium">{batter.runs}</span> ({batter.balls}b) • {batter.fours}x4 • {batter.sixes}x6 • SR <span className="font-semibold">{batter.strikeRate.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500 text-center py-2">
                    Current batters information will appear here once available
                  </div>
                </div>
              )}

              {/* Partnership */}
              {match.partnership && (
                <div className="px-4 py-2 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Partnership</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {match.partnership.runs} runs, {match.partnership.balls} balls (RR: {match.partnership.runRate})
                    </span>
                  </div>
                </div>
              )}

              {/* Last Wicket */}
              {match.lastWicket && (
                <div className="px-4 py-2 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Last Wicket</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {match.lastWicket.playerName} {match.lastWicket.runs} ({match.lastWicket.balls}b)
                      {match.lastWicket.fowScore !== undefined && ` • FOW: ${match.lastWicket.fowScore}/${match.currentScore?.away?.wickets || 0}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Current Bowlers */}
              {match.currentBowlers && match.currentBowlers.length > 0 ? (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4 text-primary-600" />
                    <span className="text-sm font-semibold text-gray-700">Current Bowlers</span>
                  </div>
                  <div className="space-y-2">
                    {match.currentBowlers.map((bowler, idx) => (
                      <div key={bowler.playerId || idx} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <span className="font-semibold text-sm text-gray-900">{bowler.playerName}</span>
                          <div className="text-xs text-gray-600 mt-1">
                            <span className="font-medium">{bowler.overs.toFixed(1)}</span>-{bowler.maidens}-<span className="font-medium">{bowler.runs}</span>-<span className="font-semibold text-primary-700">{bowler.wickets}</span> • Econ <span className="font-semibold">{bowler.economy.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500 text-center py-2">
                    Current bowlers information will appear here once available
                  </div>
                </div>
              )}

              {/* Match Note */}
              {match.matchNote && (
                <div className="px-4 py-2 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-700">{match.matchNote}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

