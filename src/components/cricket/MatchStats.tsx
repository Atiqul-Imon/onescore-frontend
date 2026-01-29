'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';

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

  // Render batting section for a team (Cricinfo-style mobile)
  const renderBattingSection = (teamBatting: BattingStat[], teamName: string, isHome: boolean) => {
    if (teamBatting.length === 0) return null;

    return (
      <div className="mb-6 last:mb-0">
        <h3 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200 px-3 sm:px-0">
          {matchId && isHome ? (
            <Link 
              href={`/cricket/match/${matchId}/team/${encodeURIComponent(teams.home.name.toLowerCase().replace(/\s+/g, '-'))}`}
              className="hover:text-primary-600 transition-colors"
            >
              {teamName}
            </Link>
          ) : matchId && !isHome ? (
            <Link 
              href={`/cricket/teams/${encodeURIComponent(teams.away.name.toLowerCase().replace(/\s+/g, '-'))}`}
              className="hover:text-primary-600 transition-colors"
            >
              {teamName}
            </Link>
          ) : (
            <span>{teamName}</span>
          )}
        </h3>
        
        {/* Mobile: Card-based layout (Cricinfo style) */}
        <div className="sm:hidden bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700 uppercase">
              <span>Batting</span>
              <div className="flex gap-2">
                <span className="w-7 text-right">R</span>
                <span className="w-7 text-right">B</span>
                <span className="w-6 text-right">4s</span>
                <span className="w-6 text-right">6s</span>
                <span className="w-10 text-right">SR</span>
              </div>
            </div>
          </div>
          {teamBatting.map((player, index) => (
            <div 
              key={player.playerId || index} 
              className={`px-3 py-2.5 border-b border-gray-100 last:border-b-0 ${!player.isOut ? 'bg-blue-50' : ''}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-semibold text-gray-900 text-sm truncate">{player.playerName}</span>
                    {!player.isOut && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium whitespace-nowrap">not out</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center flex-shrink-0">
                  <span className="font-bold text-gray-900 text-sm tabular-nums w-7 text-right">{player.runs}</span>
                  <span className="text-gray-600 text-sm tabular-nums w-7 text-right">{player.balls}</span>
                  <span className="text-gray-600 text-sm tabular-nums w-6 text-right">{player.fours}</span>
                  <span className="text-gray-600 text-sm tabular-nums w-6 text-right">{player.sixes}</span>
                  <span className="font-semibold text-gray-700 text-sm tabular-nums w-10 text-right">{player.strikeRate.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Table layout */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Batter</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">R</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">B</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">4s</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">6s</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {teamBatting.map((player, index) => (
                <tr key={player.playerId || index} className={!player.isOut ? 'bg-blue-50' : ''}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{player.playerName}</span>
                      {!player.isOut && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">not out</span>
                      )}
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className="font-bold text-gray-900 text-sm tabular-nums">{player.runs}</span>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-600 text-sm tabular-nums">{player.balls}</td>
                  <td className="text-right py-3 px-4 text-gray-600 text-sm tabular-nums">{player.fours}</td>
                  <td className="text-right py-3 px-4 text-gray-600 text-sm tabular-nums">{player.sixes}</td>
                  <td className="text-right py-3 px-4">
                    <span className="font-semibold text-gray-700 text-sm tabular-nums">{player.strikeRate.toFixed(1)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render bowling section for a team (Cricinfo-style mobile)
  const renderBowlingSection = (teamBowling: BowlingStat[], teamName: string, isHome: boolean) => {
    if (teamBowling.length === 0) return null;

    return (
      <div className="mb-6 last:mb-0">
        <h3 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 pb-2 border-b border-gray-200 px-3 sm:px-0">
          {matchId && isHome ? (
            <Link 
              href={`/cricket/match/${matchId}/team/${encodeURIComponent(teams.home.name.toLowerCase().replace(/\s+/g, '-'))}`}
              className="hover:text-primary-600 transition-colors"
            >
              {teamName}
            </Link>
          ) : matchId && !isHome ? (
            <Link 
              href={`/cricket/teams/${encodeURIComponent(teams.away.name.toLowerCase().replace(/\s+/g, '-'))}`}
              className="hover:text-primary-600 transition-colors"
            >
              {teamName}
            </Link>
          ) : (
            <span>{teamName}</span>
          )}
        </h3>
        
        {/* Mobile: Card-based layout (Cricinfo style) */}
        <div className="sm:hidden bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700 uppercase">
              <span>Bowling</span>
              <div className="flex gap-2">
                <span className="w-7 text-right">O</span>
                <span className="w-6 text-right">M</span>
                <span className="w-7 text-right">R</span>
                <span className="w-7 text-right">W</span>
                <span className="w-10 text-right">Econ</span>
              </div>
            </div>
          </div>
          {teamBowling.map((player, index) => (
            <div 
              key={player.playerId || index} 
              className="px-3 py-2.5 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0 pr-2">
                  <span className="font-semibold text-gray-900 text-sm">{player.playerName}</span>
                </div>
                <div className="flex gap-2 items-center flex-shrink-0">
                  <span className="text-gray-600 text-sm tabular-nums w-7 text-right">{player.overs.toFixed(1)}</span>
                  <span className="text-gray-600 text-sm tabular-nums w-6 text-right">{player.maidens}</span>
                  <span className="text-gray-600 text-sm tabular-nums w-7 text-right">{player.runs}</span>
                  <span className="font-bold text-gray-900 text-sm tabular-nums w-7 text-right">{player.wickets}</span>
                  <span className="font-semibold text-gray-700 text-sm tabular-nums w-10 text-right">{player.economy.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Table layout */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Bowler</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">O</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">M</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">R</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">W</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Econ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {teamBowling.map((player, index) => (
                <tr key={player.playerId || index} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900 text-sm">{player.playerName}</span>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-600 text-sm tabular-nums">{player.overs.toFixed(1)}</td>
                  <td className="text-right py-3 px-4 text-gray-600 text-sm tabular-nums">{player.maidens}</td>
                  <td className="text-right py-3 px-4 text-gray-600 text-sm tabular-nums">{player.runs}</td>
                  <td className="text-right py-3 px-4">
                    <span className="font-bold text-gray-900 text-sm tabular-nums">{player.wickets}</span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className="font-semibold text-gray-700 text-sm tabular-nums">{player.economy.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Batting Statistics */}
      {validBatting.length > 0 && (
        <Card className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden" padding="none">
          <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <span className="font-bold text-base">Batting Statistics</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {renderBattingSection(homeBatting, teams.home.name, true)}
            {renderBattingSection(awayBatting, teams.away.name, false)}
          </div>
        </Card>
      )}

      {/* Bowling Statistics */}
      {validBowling.length > 0 && (
        <Card className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden" padding="none">
          <div className="bg-gradient-to-r from-secondary-800 via-secondary-900 to-secondary-800 px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <span className="font-bold text-base">Bowling Statistics</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {renderBowlingSection(homeBowling, teams.home.name, true)}
            {renderBowlingSection(awayBowling, teams.away.name, false)}
          </div>
        </Card>
      )}
    </div>
  );
}
