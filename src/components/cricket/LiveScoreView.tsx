'use client';

import { Card } from '@/components/ui/Card';
import { formatTime } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Filter } from 'lucide-react';
import { logger } from '@/lib/logger';
import { getErrorMessage } from '@/lib/errors';

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
      playerName?: string; // Made optional - API may not provide names
      runs: number;
      balls: number;
      fours: number;
      sixes: number;
      strikeRate: number;
      teamName: string;
    }>;
    currentBowlers?: Array<{
      playerId?: string;
      playerName?: string; // Made optional - API may not provide names
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
    liveData?: {
      currentOver?: number;
      requiredRunRate?: number;
      currentRunRate?: number;
      runsRemaining?: number;
      ballsRemaining?: number;
      oversRemaining?: number;
    };
    result?: {
      resultText?: string;
      winner?: string;
      dataSource?: string;
    };
  };
}

export function LiveScoreView({ match }: LiveScoreViewProps) {
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';
  const [previousScore, setPreviousScore] = useState<{ home?: number; away?: number } | null>(null);
  const [scoreChanged, setScoreChanged] = useState<{ home: boolean; away: boolean }>({
    home: false,
    away: false,
  });

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

  // For completed matches, show a message that this is the completed match view
  // (This component should not be used for completed matches, but handle gracefully)
  if (isCompleted) {
    return (
      <Card
        padding="none"
        className="rounded-none sm:rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-3 sm:px-4 lg:px-6 py-4">
          <div className="flex items-center gap-3 text-white">
            <span className="font-bold text-lg">Match Completed</span>
          </div>
        </div>
        <div className="p-6 text-center text-gray-600">
          <p className="text-lg font-semibold mb-2">This match has ended</p>
          {match.result?.resultText && (
            <p className="text-base font-bold text-primary-700 mb-2">{match.result.resultText}</p>
          )}
          <p className="text-sm">{formatTime(new Date(match.startTime))}</p>
        </div>
      </Card>
    );
  }

  // For upcoming matches
  if (!isLive) {
    return (
      <Card
        padding="none"
        className="rounded-none sm:rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-3 sm:px-4 lg:px-6 py-4">
          <div className="flex items-center gap-3 text-white">
            <span className="font-bold text-lg">Match Preview</span>
          </div>
        </div>
        <div className="p-6 text-center text-gray-600">
          <p className="text-lg font-semibold mb-2">Match hasn't started yet</p>
          <p className="text-sm">{formatTime(new Date(match.startTime))}</p>
        </div>
      </Card>
    );
  }

  const homeScore = match.currentScore?.home;
  const awayScore = match.currentScore?.away;

  // CRITICAL: Do not calculate run rates locally - only use API-provided data
  // Use liveData from API if available, otherwise undefined
  const requiredRR =
    match.liveData?.requiredRunRate !== undefined && match.liveData?.requiredRunRate !== null
      ? match.liveData.requiredRunRate.toFixed(2)
      : undefined;
  const currentRR =
    match.liveData?.currentRunRate !== undefined && match.liveData?.currentRunRate !== null
      ? match.liveData.currentRunRate.toFixed(2)
      : undefined;

  // Determine if run rate is good (green) or poor (red) - only if both values are available
  const getRRColor = (rr: string | undefined, required: string | undefined) => {
    if (!rr || !required) return 'text-gray-900';
    const rrNum = parseFloat(rr);
    const reqNum = parseFloat(required);
    if (rrNum >= reqNum * 0.95) return 'text-green-600 font-bold';
    if (rrNum >= reqNum * 0.85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card
      padding="none"
      className="rounded-none sm:rounded-2xl border-2 border-primary-200/50 bg-gradient-to-br from-white via-primary-50/30 to-white shadow-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 shadow-lg">
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

      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Home Team Score */}
        <div className="border-b-2 border-gray-200 pb-3 sm:pb-4">
          <div className="flex items-center justify-between mb-2 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <span className="text-xl sm:text-2xl flex-shrink-0">{match.teams.home.flag}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base sm:text-lg text-secondary-900 truncate">
                  {match.teams.home.name}
                </h3>
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
                    ></motion.span>
                  )}
                  {homeScore.runs}
                  {homeScore.wickets !== undefined && (
                    <span className="text-lg sm:text-xl text-gray-600 font-normal">
                      /{homeScore.wickets}
                    </span>
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
                <h3 className="font-bold text-base sm:text-lg text-secondary-900 truncate">
                  {match.teams.away.name}
                </h3>
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
                    ></motion.span>
                  )}
                  {awayScore.runs}
                  {awayScore.wickets !== undefined && (
                    <span className="text-lg sm:text-xl text-gray-600 font-normal">
                      /{awayScore.wickets}
                    </span>
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
              {/* Target, Runs Remaining, and Run Rates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {match.target && (
                  <div className="px-2 lg:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-primary-100 to-primary-50 border-2 border-primary-300 shadow-sm">
                    <span className="text-xs text-gray-600 block">Target</span>
                    <span className="text-sm font-bold text-primary-700">{match.target} runs</span>
                  </div>
                )}
                {match.liveData?.runsRemaining !== undefined &&
                  match.liveData.runsRemaining !== null && (
                    <div className="px-2 lg:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-300 shadow-sm">
                      <span className="text-xs text-gray-600 block">Runs Remaining</span>
                      <span className="text-sm font-bold text-orange-700">
                        {match.liveData.runsRemaining} runs
                      </span>
                    </div>
                  )}
                {requiredRR && (
                  <div className="px-2 lg:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 shadow-sm">
                    <span className="text-xs text-gray-600 block mb-0.5">Required RR</span>
                    <span className="text-sm font-bold text-gray-900 tabular-nums">
                      {requiredRR}
                    </span>
                  </div>
                )}
                {currentRR && (
                  <div
                    className={`px-2 lg:px-4 py-1.5 sm:py-2 rounded-lg border-2 shadow-sm ${getRRColor(currentRR, requiredRR).includes('green') ? 'bg-gradient-to-r from-green-100 to-green-50 border-green-300' : getRRColor(currentRR, requiredRR).includes('red') ? 'bg-gradient-to-r from-red-100 to-red-50 border-red-300' : 'bg-gradient-to-r from-blue-100 to-blue-50 border-blue-300'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs text-gray-600 block mb-0.5">Current RR</span>
                        <span
                          className={`text-sm font-bold tabular-nums ${getRRColor(currentRR, requiredRR)}`}
                        >
                          {currentRR}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Batters */}
              {match.currentBatters && match.currentBatters.length > 0 ? (
                <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-200">
                  <h4 className="text-sm sm:text-base font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary-600 rounded-full"></span>
                    Current Batters
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {match.currentBatters.map((batter, idx) => (
                      <div
                        key={batter.playerId || idx}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-bold text-sm sm:text-base text-gray-900 truncate">
                                {batter.playerName ||
                                  (batter.playerId ? `Player ${batter.playerId}` : '')}
                              </h5>
                              <span className="text-lg font-bold text-green-600 flex-shrink-0">
                                *
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          {/* Main Stats */}
                          <div className="space-y-2">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">
                                {batter.runs}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                                ({batter.balls}b)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm">
                              <span className="text-gray-600">Strike Rate</span>
                              <span className="font-bold text-emerald-600 tabular-nums">
                                {batter.strikeRate.toFixed(1)}
                              </span>
                            </div>
                          </div>

                          {/* Boundaries */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <span className="text-blue-600 font-semibold text-sm sm:text-base">
                                  4
                                </span>
                                <span className="text-xs text-gray-600">×{batter.fours}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-600 font-semibold text-sm sm:text-base">
                                  6
                                </span>
                                <span className="text-xs text-gray-600">×{batter.sixes}</span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {batter.fours + batter.sixes > 0 ? (
                                <span>
                                  {batter.fours * 4 + batter.sixes * 6} runs from boundaries
                                </span>
                              ) : (
                                <span>No boundaries</span>
                              )}
                            </div>
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
                <div className="px-2 lg:px-4 py-2 rounded-lg bg-gradient-to-r from-green-100 via-emerald-50 to-green-100 border-2 border-green-300 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <span className="text-xs text-gray-600">Partnership</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 break-words">
                      {match.partnership.runs} runs, {match.partnership.balls} balls (RR:{' '}
                      {match.partnership.runRate})
                    </span>
                  </div>
                </div>
              )}

              {/* Current Bowlers */}
              {match.currentBowlers && match.currentBowlers.length > 0 ? (
                <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-200">
                  <h4 className="text-sm sm:text-base font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-secondary-600 rounded-full"></span>
                    Current Bowlers
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {match.currentBowlers.map((bowler, idx) => (
                      <div
                        key={bowler.playerId || idx}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-sm sm:text-base text-gray-900 truncate">
                              {bowler.playerName ||
                                (bowler.playerId ? `Player ${bowler.playerId}` : '')}
                            </h5>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          {/* Bowling Figures */}
                          <div className="space-y-2">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg sm:text-xl font-bold text-gray-900 tabular-nums">
                                {bowler.overs.toFixed(1)}
                              </span>
                              <span className="text-xs text-gray-500">overs</span>
                            </div>
                            <div className="text-xs sm:text-sm font-mono font-semibold text-gray-700">
                              {bowler.overs.toFixed(1)}-{bowler.maidens}-{bowler.runs}-
                              {bowler.wickets}
                            </div>
                          </div>

                          {/* Wickets & Economy */}
                          <div className="space-y-2">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl sm:text-3xl font-bold text-red-600 tabular-nums">
                                {bowler.wickets}
                              </span>
                              <span className="text-xs text-gray-500">wickets</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm">
                              <span className="text-gray-600">Economy</span>
                              <span className="font-bold text-amber-600 tabular-nums">
                                {bowler.economy.toFixed(2)}
                              </span>
                            </div>
                            {bowler.maidens > 0 && (
                              <div className="text-xs text-gray-500">
                                {bowler.maidens} maiden{bowler.maidens > 1 ? 's' : ''}
                              </div>
                            )}
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

              {/* Live Commentary - Cricinfo Style */}
              <LiveCommentary matchId={match.matchId} matchStatus={match.status} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// Full Commentary Component for Live Tab (MatchCommentary style)
interface CommentaryEntry {
  ball: string;
  commentary: string;
  over: number;
  ballNumber: number;
  runs: number;
  wickets?: number;
  batsman?: string;
  bowler?: string;
  timestamp?: string;
  scoreboard?: string; // S1 for first innings, S2 for second innings
}

interface CommentaryData {
  firstInnings: CommentaryEntry[];
  secondInnings: CommentaryEntry[];
  all: CommentaryEntry[];
}

function LiveCommentary({ matchId, matchStatus }: { matchId: string; matchStatus?: string }) {
  const [commentaryData, setCommentaryData] = useState<CommentaryData>({
    firstInnings: [],
    secondInnings: [],
    all: [],
  });
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filterOver, setFilterOver] = useState<number | null>(null);
  const commentaryEndRef = useRef<HTMLDivElement>(null);

  // Helper function to extract integer over number (handle decimals like 19.6 -> 19)
  const getOverNumber = (over: number | undefined | null): number | null => {
    if (over === undefined || over === null || isNaN(over)) {
      return null;
    }
    const overInt = Math.floor(over);
    return overInt > 0 ? overInt : null;
  };

  // Helper function to filter and normalize commentary entries
  const normalizeCommentary = (entries: CommentaryEntry[]): CommentaryEntry[] => {
    return (
      entries
        .map((entry) => {
          const overNum = getOverNumber(entry.over);
          // More lenient validation - allow ballNumber 0-6 (inclusive)
          if (overNum === null) {
            return null;
          }
          // Allow ballNumber to be undefined or 0-6
          const ballNum = entry.ballNumber;
          if (ballNum !== undefined && ballNum !== null && (ballNum < 0 || ballNum > 6)) {
            return null;
          }
          return {
            ...entry,
            over: overNum,
            ballNumber: ballNum !== undefined && ballNum !== null ? ballNum : 0,
          };
        })
        .filter((entry): entry is CommentaryEntry => entry !== null)
        // Ensure newest is always at top (sort by over desc, then ballNumber desc)
        .sort((a, b) => {
          if (a.over !== b.over) return b.over - a.over;
          return b.ballNumber - a.ballNumber;
        })
    );
  };

  // Normalize commentary for each innings
  const validFirstInnings = normalizeCommentary(commentaryData.firstInnings);
  const validSecondInnings = normalizeCommentary(commentaryData.secondInnings);
  const validAllCommentary = normalizeCommentary(commentaryData.all);

  // Get unique overs for filter (from all commentary)
  const uniqueOvers = Array.from(new Set(validAllCommentary.map((c) => c.over))).sort(
    (a, b) => b - a
  );

  const fetchCommentary = async (isAutoRefresh = false) => {
    try {
      // Only show loading state on initial load or manual refresh, not on auto-refresh
      if (!isAutoRefresh) {
        setError(null);
        if (isInitialLoad) {
          setLoading(true);
        }
      }

      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/v1/cricket/matches/${matchId}/commentary`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        if (!isAutoRefresh) {
          throw new Error('Failed to load commentary');
        }
        return; // Silently fail on auto-refresh
      }

      const json = await response.json();

      if (json.success && json.data) {
        // Handle new structure with innings separated
        if (json.data.firstInnings !== undefined && json.data.secondInnings !== undefined) {
          // New structure: { firstInnings: [], secondInnings: [], all: [] }
          setCommentaryData({
            firstInnings: json.data.firstInnings || [],
            secondInnings: json.data.secondInnings || [],
            all: json.data.all || [],
          });
        } else if (Array.isArray(json.data)) {
          // Legacy structure: array of commentary entries
          // Group by scoreboard if available, otherwise use all
          const firstInnings: CommentaryEntry[] = [];
          const secondInnings: CommentaryEntry[] = [];
          const all: CommentaryEntry[] = [];

          json.data.forEach((entry: CommentaryEntry) => {
            all.push(entry);
            if (entry.scoreboard === 'S1') {
              firstInnings.push(entry);
            } else if (entry.scoreboard === 'S2') {
              secondInnings.push(entry);
            }
          });

          setCommentaryData({
            firstInnings,
            secondInnings,
            all,
          });
        } else {
          setCommentaryData({
            firstInnings: [],
            secondInnings: [],
            all: [],
          });
        }
      }
    } catch (err: unknown) {
      // Only show errors on initial load or manual refresh, not on auto-refresh
      if (!isAutoRefresh) {
        logger.error('Error fetching commentary', err, 'LiveCommentary');
        setError(getErrorMessage(err));
      }
    } finally {
      if (!isAutoRefresh) {
        setLoading(false);
        setIsInitialLoad(false);
      }
    }
  };

  useEffect(() => {
    // Initial load
    fetchCommentary(false);

    if (autoRefresh) {
      // Auto-refresh silently in background
      const interval = setInterval(() => {
        fetchCommentary(true); // Pass true to indicate auto-refresh
      }, 15000); // Refresh every 15 seconds
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId, autoRefresh]);

  // Auto-scroll to top (where latest commentary is) when new commentary arrives during auto-refresh
  // Only scroll if user hasn't manually scrolled away from top
  useEffect(() => {
    if (autoRefresh && validAllCommentary.length > 0) {
      const container = document.querySelector('[data-commentary-container]') as HTMLElement;
      if (container) {
        // Only auto-scroll if user is near the top (within 100px) - don't interrupt if they're reading older commentary
        const isNearTop = container.scrollTop < 100;
        if (isNearTop) {
          // Small delay to ensure DOM is updated
          setTimeout(() => {
            container.scrollTop = 0;
          }, 50);
        }
      }
    }
  }, [validAllCommentary.length, autoRefresh]);

  // Always show the commentary section, even if loading or empty
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="px-4 sm:px-6 py-2 sm:py-3 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-semibold text-sm sm:text-base text-gray-800">
              Ball-by-Ball Commentary
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {uniqueOvers.length > 0 && (
              <div className="relative">
                <select
                  value={filterOver || ''}
                  onChange={(e) => setFilterOver(e.target.value ? parseInt(e.target.value) : null)}
                  className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-md bg-white border border-gray-300 text-gray-700 appearance-none pr-6 sm:pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Overs</option>
                  {uniqueOvers.map((over) => (
                    <option key={over} value={over} className="text-gray-900">
                      {over}.0 - {over}.6
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 pointer-events-none text-gray-500" />
              </div>
            )}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="text-xs sm:text-sm font-medium hover:text-primary-600 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 touch-target"
            >
              {autoRefresh ? 'Auto: ON' : 'Auto: OFF'}
            </button>
            <button
              onClick={() => fetchCommentary(false)}
              className="p-2 sm:p-2.5 rounded-md hover:bg-gray-100 transition-colors border border-gray-300 bg-white touch-target"
              title="Refresh commentary"
            >
              <RefreshCw
                className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-600 ${loading && !isInitialLoad ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div
        data-commentary-container
        className="max-h-[600px] overflow-y-auto scrollbar-hide bg-white"
      >
        {loading && isInitialLoad && validAllCommentary.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm">Loading commentary...</p>
          </div>
        ) : error ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="mb-4 text-red-600">
              <p className="font-semibold text-sm sm:text-base">{error}</p>
            </div>
            <button
              onClick={() => fetchCommentary(false)}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm sm:text-base shadow-md touch-target"
            >
              Retry
            </button>
          </div>
        ) : validAllCommentary.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="mb-4 text-gray-500">
              <p className="font-semibold text-sm sm:text-base">No commentary available yet.</p>
              <p className="text-xs sm:text-sm mt-2 text-gray-400">
                Commentary will appear here once the match starts.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {/* Second Innings - Show first if it exists (it's the current/latest) */}
            {validSecondInnings.length > 0 && (
              <div className="border-b border-gray-200">
                <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-50">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                    2nd Innings
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {(filterOver !== null
                      ? validSecondInnings.filter((c) => c.over === filterOver)
                      : validSecondInnings
                    ).map((entry, index) => {
                      const isBoundary = entry.runs === 4 || entry.runs === 6;
                      const isWicket = entry.wickets && entry.wickets > 0;

                      return (
                        <motion.div
                          key={`2nd-${entry.over}.${entry.ballNumber}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-3 sm:p-4 sm:p-5 hover:bg-primary-50/50 transition-colors border-l-4 ${
                            isWicket
                              ? 'border-l-red-500 bg-red-50/30'
                              : isBoundary
                                ? 'border-l-primary-500 bg-primary-50/30'
                                : 'border-l-transparent hover:border-l-primary-400'
                          }`}
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-16 sm:w-20 text-right">
                              <div className="text-sm sm:text-base font-bold text-secondary-900 tabular-nums">
                                {entry.over}.{entry.ballNumber}
                              </div>
                              {entry.timestamp && (
                                <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 font-medium">
                                  {formatTime(entry.timestamp)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                                {entry.runs > 0 && (
                                  <span
                                    className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-xs font-bold border ${
                                      entry.runs === 6
                                        ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                        : entry.runs === 4
                                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                                          : 'bg-primary-100 text-primary-800 border-primary-200'
                                    }`}
                                  >
                                    {entry.runs} {entry.runs === 1 ? 'run' : 'runs'}
                                  </span>
                                )}
                                {isWicket && (
                                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-red-100 text-red-800 text-xs font-bold border border-red-300 animate-pulse">
                                    🎯 Wicket!
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-800 leading-relaxed font-medium text-sm sm:text-base">
                                {entry.commentary}
                              </p>
                              {(entry.batsman || entry.bowler) && (
                                <div className="mt-2 text-[10px] sm:text-xs text-gray-600 font-medium flex flex-wrap gap-x-2">
                                  {entry.batsman && (
                                    <span className="text-secondary-700">
                                      Batting: {entry.batsman}
                                    </span>
                                  )}
                                  {entry.batsman && entry.bowler && (
                                    <span className="text-gray-400">•</span>
                                  )}
                                  {entry.bowler && (
                                    <span className="text-secondary-700">
                                      Bowling: {entry.bowler}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* First Innings - Show below second innings */}
            {validFirstInnings.length > 0 && (
              <div className="border-b border-gray-200">
                <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-50">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                    1st Innings
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {(filterOver !== null
                      ? validFirstInnings.filter((c) => c.over === filterOver)
                      : validFirstInnings
                    ).map((entry, index) => {
                      const isBoundary = entry.runs === 4 || entry.runs === 6;
                      const isWicket = entry.wickets && entry.wickets > 0;

                      return (
                        <motion.div
                          key={`1st-${entry.over}.${entry.ballNumber}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-3 sm:p-4 sm:p-5 hover:bg-gray-50/50 transition-colors border-l-4 ${
                            isWicket
                              ? 'border-l-red-500 bg-red-50/30'
                              : isBoundary
                                ? 'border-l-primary-500 bg-primary-50/30'
                                : 'border-l-transparent hover:border-l-primary-400'
                          }`}
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-16 sm:w-20 text-right">
                              <div className="text-sm sm:text-base font-bold text-secondary-900 tabular-nums">
                                {entry.over}.{entry.ballNumber}
                              </div>
                              {entry.timestamp && (
                                <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 font-medium">
                                  {formatTime(entry.timestamp)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                                {entry.runs > 0 && (
                                  <span
                                    className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-xs font-bold border ${
                                      entry.runs === 6
                                        ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                        : entry.runs === 4
                                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                                          : 'bg-primary-100 text-primary-800 border-primary-200'
                                    }`}
                                  >
                                    {entry.runs} {entry.runs === 1 ? 'run' : 'runs'}
                                  </span>
                                )}
                                {isWicket && (
                                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-red-100 text-red-800 text-xs font-bold border border-red-300 animate-pulse">
                                    🎯 Wicket!
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-800 leading-relaxed font-medium text-sm sm:text-base">
                                {entry.commentary}
                              </p>
                              {(entry.batsman || entry.bowler) && (
                                <div className="mt-2 text-[10px] sm:text-xs text-gray-600 font-medium flex flex-wrap gap-x-2">
                                  {entry.batsman && (
                                    <span className="text-secondary-700">
                                      Batting: {entry.batsman}
                                    </span>
                                  )}
                                  {entry.batsman && entry.bowler && (
                                    <span className="text-gray-400">•</span>
                                  )}
                                  {entry.bowler && (
                                    <span className="text-secondary-700">
                                      Bowling: {entry.bowler}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
