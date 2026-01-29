'use client';

import { Card } from '@/components/ui/Card';
import { formatTime } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

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
  const [previousScore, setPreviousScore] = useState<{ home?: number; away?: number } | null>(null);
  const [scoreChanged, setScoreChanged] = useState<{ home: boolean; away: boolean }>({ home: false, away: false });

  // Track score changes for animation
  useEffect(() => {
    if (isLive && match.currentScore) {
      const currentHome = match.currentScore.home?.runs;
      const currentAway = match.currentScore.away?.runs;
      
      if (previousScore) {
        if (currentHome !== previousScore.home) {
          setScoreChanged({ ...scoreChanged, home: true });
          setTimeout(() => setScoreChanged({ ...scoreChanged, home: false }), 1000);
        }
        if (currentAway !== previousScore.away) {
          setScoreChanged({ ...scoreChanged, away: true });
          setTimeout(() => setScoreChanged({ ...scoreChanged, away: false }), 1000);
        }
      }
      
      setPreviousScore({ home: currentHome, away: currentAway });
    }
  }, [match.currentScore, isLive]);

  if (!isLive && !isCompleted) {
    return (
      <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-6 py-4">
          <div className="flex items-center gap-3 text-white">
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

  // Determine if run rate is good (green) or poor (red)
  const getRRColor = (rr: string | null, required: string | null) => {
    if (!rr || !required) return 'text-gray-900';
    const rrNum = parseFloat(rr);
    const reqNum = parseFloat(required);
    if (rrNum >= reqNum * 0.95) return 'text-green-600 font-bold';
    if (rrNum >= reqNum * 0.85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRRBadge = (rr: string | null, required: string | null) => {
    // Icon removed - return null
    return null;
  };

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between text-white gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="font-bold text-base sm:text-lg truncate">Live Score</span>
          </div>
          {isLive && (
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/20 border border-white/30 flex-shrink-0">
              <span className="live-dot bg-white animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold">LIVE</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Home Team Score */}
        <div className="border-b-2 border-gray-200 pb-3 sm:pb-4">
          <div className="flex items-center justify-between mb-2 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <span className="text-xl sm:text-2xl flex-shrink-0">{match.teams.home.flag}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base sm:text-lg text-secondary-900 truncate">{match.teams.home.name}</h3>
                <p className="text-xs text-gray-600">{match.teams.home.shortName}</p>
              </div>
            </div>
            {homeScore && (
              <motion.div 
                className="text-right flex-shrink-0"
                animate={scoreChanged.home ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-secondary-900 tabular-nums flex items-center justify-end gap-1">
                  {scoreChanged.home && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-primary-600"
                    >
                    </motion.span>
                  )}
                  {homeScore.runs}
                  {homeScore.wickets !== undefined && (
                    <span className="text-lg sm:text-xl text-gray-600 font-normal">/{homeScore.wickets}</span>
                  )}
                </div>
                {homeScore.overs > 0 && (
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    {homeScore.overs}.{homeScore.balls} overs
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Away Team Score */}
        <div>
          <div className="flex items-center justify-between mb-2 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <span className="text-xl sm:text-2xl flex-shrink-0">{match.teams.away.flag}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base sm:text-lg text-secondary-900 truncate">{match.teams.away.name}</h3>
                <p className="text-xs text-gray-600">{match.teams.away.shortName}</p>
              </div>
            </div>
            {awayScore && (
              <motion.div 
                className="text-right flex-shrink-0"
                animate={scoreChanged.away ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-secondary-900 tabular-nums flex items-center justify-end gap-1">
                  {scoreChanged.away && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-primary-600"
                    >
                    </motion.span>
                  )}
                  {awayScore.runs}
                  {awayScore.wickets !== undefined && (
                    <span className="text-lg sm:text-xl text-gray-600 font-normal">/{awayScore.wickets}</span>
                  )}
                </div>
                {awayScore.overs > 0 && (
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    {awayScore.overs}.{awayScore.balls} overs
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Live Match Info - Cricinfo Style */}
          {isLive && awayScore && (
            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {/* Target and Run Rates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {match.target && (
                  <div className="px-4 py-2 rounded-lg bg-primary-50 border border-primary-200">
                    <span className="text-xs text-gray-600 block">Target</span>
                    <span className="text-sm font-bold text-primary-700">{match.target} runs</span>
                  </div>
                )}
                {requiredRR && (
                  <div className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-xs text-gray-600 block mb-0.5">Required RR</span>
                    <span className="text-sm font-bold text-gray-900 tabular-nums">{requiredRR}</span>
                  </div>
                )}
                {currentRR && (
                  <div className={`px-4 py-2 rounded-lg border ${getRRColor(currentRR, requiredRR || null).includes('green') ? 'bg-green-50 border-green-200' : getRRColor(currentRR, requiredRR || null).includes('red') ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs text-gray-600 block mb-0.5">Current RR</span>
                        <span className={`text-sm font-bold tabular-nums ${getRRColor(currentRR, requiredRR || null)}`}>
                          {currentRR}
                        </span>
                      </div>
                      {getRRBadge(currentRR, requiredRR || null)}
                    </div>
                  </div>
                )}
              </div>

              {/* Current Batters */}
              {match.currentBatters && match.currentBatters.length > 0 ? (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">Current Batters</span>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    {match.currentBatters.map((batter, idx) => (
                      <div key={batter.playerId || idx} className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="font-semibold text-xs sm:text-sm text-gray-900 truncate">{batter.playerName}</span>
                            <span className="text-xs px-1 sm:px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium flex-shrink-0">*</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5 sm:mt-1 flex flex-wrap gap-x-1.5">
                            <span className="font-medium">{batter.runs}</span>
                            <span>({batter.balls}b)</span>
                            <span>•</span>
                            <span>{batter.fours}x4</span>
                            <span>•</span>
                            <span>{batter.sixes}x6</span>
                            <span>•</span>
                            <span>SR <span className="font-semibold">{batter.strikeRate.toFixed(1)}</span></span>
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
                <div className="px-3 sm:px-4 py-2 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <span className="text-xs text-gray-600">Partnership</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 break-words">
                      {match.partnership.runs} runs, {match.partnership.balls} balls (RR: {match.partnership.runRate})
                    </span>
                  </div>
                </div>
              )}

              {/* Last Wicket */}
              {match.lastWicket && (
                <div className="px-3 sm:px-4 py-2 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <span className="text-xs text-gray-600">Last Wicket</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 break-words">
                      {match.lastWicket.playerName} {match.lastWicket.runs} ({match.lastWicket.balls}b)
                      {match.lastWicket.fowScore !== undefined && ` • FOW: ${match.lastWicket.fowScore}/${match.currentScore?.away?.wickets || 0}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Current Bowlers */}
              {match.currentBowlers && match.currentBowlers.length > 0 ? (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">Current Bowlers</span>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    {match.currentBowlers.map((bowler, idx) => (
                      <div key={bowler.playerId || idx} className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-xs sm:text-sm text-gray-900 truncate block">{bowler.playerName}</span>
                          <div className="text-xs text-gray-600 mt-0.5 sm:mt-1 flex flex-wrap gap-x-1.5">
                            <span className="font-medium">{bowler.overs.toFixed(1)}</span>
                            <span>-{bowler.maidens}-</span>
                            <span className="font-medium">{bowler.runs}</span>
                            <span>-</span>
                            <span className="font-semibold text-primary-700">{bowler.wickets}</span>
                            <span>•</span>
                            <span>Econ <span className="font-semibold">{bowler.economy.toFixed(2)}</span></span>
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
                <div className="px-3 sm:px-4 py-2 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs sm:text-sm text-blue-700 break-words">{match.matchNote}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

