'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Trophy, Target, TrendingUp } from 'lucide-react';

interface BattingStat {
  playerId?: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissedBy?: string;
  teamId?: string;
  teamName: string;
  fowScore?: number;
  fowBalls?: number;
}

interface BowlingStat {
  playerId?: string;
  playerName: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  teamId?: string;
  teamName: string;
}

interface MatchStatsProps {
  batting?: BattingStat[];
  bowling?: BowlingStat[];
  teams: {
    home: { name: string; shortName: string };
    away: { name: string; shortName: string };
  };
  matchId?: string;
}

export function MatchStats({ batting, bowling, teams, matchId }: MatchStatsProps) {
  // Debug logging
  console.log('[MatchStats] Received props:', {
    battingCount: batting?.length || 0,
    bowlingCount: bowling?.length || 0,
    batting: batting,
    bowling: bowling,
    teams: teams,
  });

  // Filter out entries with no meaningful data
  const validBatting = (batting || []).filter(b => (b.runs > 0 || b.balls > 0));
  const validBowling = (bowling || []).filter(b => (b.wickets > 0 || b.overs > 0));
  
  console.log('[MatchStats] Filtered data:', {
    validBattingCount: validBatting.length,
    validBowlingCount: validBowling.length,
  });
  
  if (validBatting.length === 0 && validBowling.length === 0) {
    // Show a helpful message instead of returning null
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">
        <p className="mb-2">Player statistics are not available yet.</p>
        <p className="text-sm text-gray-500">
          {batting?.length || bowling?.length 
            ? 'Statistics will appear once players have meaningful data (runs, balls, wickets, or overs).'
            : 'Statistics will be available once the match progresses and data is collected.'}
        </p>
      </div>
    );
  }

  // Group batting by team
  const homeBatting = validBatting.filter(b => b.teamName === teams.home.name);
  const awayBatting = validBatting.filter(b => b.teamName === teams.away.name);
  
  // Group bowling by team
  const homeBowling = validBowling.filter(b => b.teamName === teams.home.name);
  const awayBowling = validBowling.filter(b => b.teamName === teams.away.name);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Batting Statistics */}
      {validBatting.length > 0 && (
        <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3 text-white">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary-100 flex-shrink-0" />
              <span className="font-bold text-base sm:text-lg">Batting Statistics</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Home Team Batting */}
            {homeBatting.length > 0 && (
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 sm:mb-4 pb-2 border-b-2 border-gray-200">
                  {matchId ? (
                    <Link 
                      href={`/cricket/match/${matchId}/team/${encodeURIComponent(teams.home.name.toLowerCase().replace(/\s+/g, '-'))}`}
                      className="hover:text-primary-600 transition-colors break-words"
                    >
                      {teams.home.name}
                    </Link>
                  ) : (
                    <span className="break-words">{teams.home.name}</span>
                  )}
                </h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Batter</th>
                          <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">R</th>
                          <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">B</th>
                          <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">4s</th>
                          <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">6s</th>
                          <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">SR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {homeBatting.map((player, index) => (
                          <tr 
                            key={player.playerId || index} 
                            className={`hover:bg-gray-50 transition-colors ${!player.isOut ? 'bg-green-50/50' : ''}`}
                          >
                            <td className="py-3 sm:py-4 px-3 sm:px-4 bg-white sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
                              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                                <span className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{player.playerName}</span>
                                {!player.isOut && (
                                  <span className="text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-green-500 text-white font-bold flex-shrink-0 animate-pulse">
                                    *
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4">
                              <span className="font-bold text-secondary-900 text-sm sm:text-base tabular-nums">{player.runs}</span>
                            </td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm tabular-nums">{player.balls}</td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm tabular-nums">{player.fours}</td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm tabular-nums">{player.sixes}</td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4">
                              <span className="font-semibold text-primary-700 text-xs sm:text-sm tabular-nums">{player.strikeRate.toFixed(1)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Away Team Batting */}
            {awayBatting.length > 0 && (
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 sm:mb-4 pb-2 border-b-2 border-gray-200">
                  <Link 
                    href={`/cricket/teams/${encodeURIComponent(teams.away.name.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="hover:text-primary-600 transition-colors break-words"
                  >
                    {teams.away.name}
                  </Link>
                </h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0 scrollbar-hide">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 sticky left-0 z-20 min-w-[140px]">Batter</th>
                          <th className="text-right py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[50px]">R</th>
                          <th className="text-right py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[50px]">B</th>
                          <th className="text-right py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[50px]">4s</th>
                          <th className="text-right py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[50px]">6s</th>
                          <th className="text-right py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[60px]">SR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {awayBatting.map((player, index) => (
                          <tr 
                            key={player.playerId || index} 
                            className={`hover:bg-gray-50 transition-colors ${!player.isOut ? 'bg-green-50/50' : ''}`}
                          >
                            <td className="py-3 sm:py-4 px-3 sm:px-4 bg-white sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
                              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                                <span className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{player.playerName}</span>
                                {!player.isOut && (
                                  <span className="text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-green-500 text-white font-bold flex-shrink-0 animate-pulse">
                                    *
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4">
                              <span className="font-bold text-secondary-900 text-sm sm:text-base tabular-nums">{player.runs}</span>
                            </td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm tabular-nums">{player.balls}</td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm tabular-nums">{player.fours}</td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm tabular-nums">{player.sixes}</td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4">
                              <span className="font-semibold text-primary-700 text-xs sm:text-sm tabular-nums">{player.strikeRate.toFixed(1)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Bowling Statistics */}
      {validBowling.length > 0 && (
        <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-secondary-800 via-secondary-900 to-secondary-800 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3 text-white">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary-400 flex-shrink-0" />
              <span className="font-bold text-base sm:text-lg">Bowling Statistics</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Home Team Bowling */}
            {homeBowling.length > 0 && (
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 sm:mb-4 pb-2 border-b-2 border-gray-200">
                  {matchId ? (
                    <Link 
                      href={`/cricket/match/${matchId}/team/${encodeURIComponent(teams.home.name.toLowerCase().replace(/\s+/g, '-'))}`}
                      className="hover:text-primary-600 transition-colors break-words"
                    >
                      {teams.home.name}
                    </Link>
                  ) : (
                    <span className="break-words">{teams.home.name}</span>
                  )}
                </h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0 scrollbar-hide">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 sticky left-0 z-20 min-w-[140px]">Bowler</th>
                          <th className="text-right py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[50px]">O</th>
                          <th className="text-right py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[50px]">M</th>
                          <th className="text-right py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[50px]">R</th>
                          <th className="text-right py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[50px]">W</th>
                          <th className="text-right py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[60px]">Econ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {homeBowling.map((player, index) => (
                          <tr key={player.playerId || index} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 sm:py-4 px-3 sm:px-4 bg-white sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
                              <span className="font-semibold text-gray-900 text-xs sm:text-sm truncate block">{player.playerName}</span>
                            </td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm tabular-nums">{player.overs.toFixed(1)}</td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm tabular-nums">{player.maidens}</td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm tabular-nums">{player.runs}</td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4">
                              <span className="font-bold text-secondary-900 text-sm sm:text-base tabular-nums">{player.wickets}</span>
                            </td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4">
                              <span className="font-semibold text-primary-700 text-xs sm:text-sm tabular-nums">{player.economy.toFixed(2)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Away Team Bowling */}
            {awayBowling.length > 0 && (
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 sm:mb-4 pb-2 border-b-2 border-gray-200">
                  <Link 
                    href={`/cricket/teams/${encodeURIComponent(teams.away.name.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="hover:text-primary-600 transition-colors break-words"
                  >
                    {teams.away.name}
                  </Link>
                </h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0 scrollbar-hide">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 sticky left-0 z-20 min-w-[140px]">Bowler</th>
                          <th className="text-right py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[50px]">O</th>
                          <th className="text-right py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[50px]">M</th>
                          <th className="text-right py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[50px]">R</th>
                          <th className="text-right py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[50px]">W</th>
                          <th className="text-right py-3 sm:py-4 px-3 sm:px-4 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[60px]">Econ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {awayBowling.map((player, index) => (
                          <tr key={player.playerId || index} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 sm:py-4 px-3 sm:px-4 bg-white sticky left-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
                              <span className="font-semibold text-gray-900 text-xs sm:text-sm truncate block">{player.playerName}</span>
                            </td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm tabular-nums">{player.overs.toFixed(1)}</td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm tabular-nums">{player.maidens}</td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm tabular-nums">{player.runs}</td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4">
                              <span className="font-bold text-secondary-900 text-sm sm:text-base tabular-nums">{player.wickets}</span>
                            </td>
                            <td className="text-right py-3 sm:py-4 px-3 sm:px-4">
                              <span className="font-semibold text-primary-700 text-xs sm:text-sm tabular-nums">{player.economy.toFixed(2)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

