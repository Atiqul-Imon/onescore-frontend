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
  // Filter out entries with no meaningful data
  const validBatting = (batting || []).filter(b => (b.runs > 0 || b.balls > 0));
  const validBowling = (bowling || []).filter(b => (b.wickets > 0 || b.overs > 0));
  
  if (validBatting.length === 0 && validBowling.length === 0) {
    return null;
  }

  // Group batting by team
  const homeBatting = validBatting.filter(b => b.teamName === teams.home.name);
  const awayBatting = validBatting.filter(b => b.teamName === teams.away.name);
  
  // Group bowling by team
  const homeBowling = validBowling.filter(b => b.teamName === teams.home.name);
  const awayBowling = validBowling.filter(b => b.teamName === teams.away.name);

  return (
    <div className="space-y-6">
      {/* Batting Statistics */}
      {validBatting.length > 0 && (
        <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-6 py-4">
            <div className="flex items-center gap-3 text-white">
              <Target className="h-5 w-5 text-primary-100" />
              <span className="font-bold text-lg">Batting Statistics</span>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Home Team Batting */}
            {homeBatting.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 pb-2 border-b-2 border-gray-200">
                  {matchId ? (
                    <Link 
                      href={`/cricket/match/${matchId}/team/${encodeURIComponent(teams.home.name.toLowerCase().replace(/\s+/g, '-'))}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {teams.home.name}
                    </Link>
                  ) : (
                    teams.home.name
                  )}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Batter</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">R</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">B</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">4s</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">6s</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">SR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {homeBatting.map((player, index) => (
                        <tr key={player.playerId || index} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{player.playerName}</span>
                              {!player.isOut && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                  not out
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className="font-bold text-secondary-900">{player.runs}</span>
                          </td>
                          <td className="text-right py-3 px-4 text-gray-600">{player.balls}</td>
                          <td className="text-right py-3 px-4 text-gray-600">{player.fours}</td>
                          <td className="text-right py-3 px-4 text-gray-600">{player.sixes}</td>
                          <td className="text-right py-3 px-4">
                            <span className="font-semibold text-primary-700">{player.strikeRate.toFixed(1)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Away Team Batting */}
            {awayBatting.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 pb-2 border-b-2 border-gray-200">
                  <Link 
                    href={`/cricket/teams/${encodeURIComponent(teams.away.name.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {teams.away.name}
                  </Link>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Batter</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">R</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">B</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">4s</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">6s</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">SR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {awayBatting.map((player, index) => (
                        <tr key={player.playerId || index} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{player.playerName}</span>
                              {!player.isOut && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                  not out
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className="font-bold text-secondary-900">{player.runs}</span>
                          </td>
                          <td className="text-right py-3 px-4 text-gray-600">{player.balls}</td>
                          <td className="text-right py-3 px-4 text-gray-600">{player.fours}</td>
                          <td className="text-right py-3 px-4 text-gray-600">{player.sixes}</td>
                          <td className="text-right py-3 px-4">
                            <span className="font-semibold text-primary-700">{player.strikeRate.toFixed(1)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Bowling Statistics */}
      {validBowling.length > 0 && (
        <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-secondary-800 via-secondary-900 to-secondary-800 px-6 py-4">
            <div className="flex items-center gap-3 text-white">
              <TrendingUp className="h-5 w-5 text-primary-400" />
              <span className="font-bold text-lg">Bowling Statistics</span>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Home Team Bowling */}
            {homeBowling.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 pb-2 border-b-2 border-gray-200">
                  {matchId ? (
                    <Link 
                      href={`/cricket/match/${matchId}/team/${encodeURIComponent(teams.home.name.toLowerCase().replace(/\s+/g, '-'))}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {teams.home.name}
                    </Link>
                  ) : (
                    teams.home.name
                  )}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Bowler</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">O</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">M</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">R</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">W</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Econ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {homeBowling.map((player, index) => (
                        <tr key={player.playerId || index} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-semibold text-gray-900">{player.playerName}</span>
                          </td>
                          <td className="text-right py-3 px-4 text-gray-600">{player.overs.toFixed(1)}</td>
                          <td className="text-right py-3 px-4 text-gray-600">{player.maidens}</td>
                          <td className="text-right py-3 px-4 text-gray-600">{player.runs}</td>
                          <td className="text-right py-3 px-4">
                            <span className="font-bold text-secondary-900">{player.wickets}</span>
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className="font-semibold text-primary-700">{player.economy.toFixed(2)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Away Team Bowling */}
            {awayBowling.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 pb-2 border-b-2 border-gray-200">
                  <Link 
                    href={`/cricket/teams/${encodeURIComponent(teams.away.name.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {teams.away.name}
                  </Link>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Bowler</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">O</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">M</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">R</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">W</th>
                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Econ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {awayBowling.map((player, index) => (
                        <tr key={player.playerId || index} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-semibold text-gray-900">{player.playerName}</span>
                          </td>
                          <td className="text-right py-3 px-4 text-gray-600">{player.overs.toFixed(1)}</td>
                          <td className="text-right py-3 px-4 text-gray-600">{player.maidens}</td>
                          <td className="text-right py-3 px-4 text-gray-600">{player.runs}</td>
                          <td className="text-right py-3 px-4">
                            <span className="font-bold text-secondary-900">{player.wickets}</span>
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className="font-semibold text-primary-700">{player.economy.toFixed(2)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

