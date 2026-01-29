'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Target, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface BattingStat {
  playerId?: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  matches: number;
  strikeRate: string;
  average: string;
}

interface BowlingStat {
  playerId?: string;
  playerName: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  matches: number;
  economy: string;
  average: string;
}

interface TeamMatchStatsProps {
  teamName: string;
}

export function TeamMatchStats({ teamName }: TeamMatchStatsProps) {
  const [batting, setBatting] = useState<BattingStat[]>([]);
  const [bowling, setBowling] = useState<BowlingStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        setLoading(true);
        const encodedTeamName = encodeURIComponent(teamName.toLowerCase().replace(/\s+/g, '-'));
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/cricket/teams/${encodedTeamName}/matches`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch team statistics');
        }

        const data = await response.json();
        if (data.success && data.data) {
          setBatting(data.data.batting || []);
          setBowling(data.data.bowling || []);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching team stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (teamName) {
      fetchTeamStats();
    }
  }, [teamName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <p>Failed to load team statistics: {error}</p>
      </div>
    );
  }

  if (batting.length === 0 && bowling.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">
        <p>No match statistics available for this team yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Batting Statistics */}
      {batting.length > 0 && (
        <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-6 py-4">
            <div className="flex items-center gap-3 text-white">
              <Target className="h-5 w-5 text-primary-100" />
              <span className="font-bold text-lg">Top Batsmen</span>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Player</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">M</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">R</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">B</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">4s</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">6s</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">SR</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Avg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {batting.map((player, index) => (
                    <tr key={player.playerId || index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">{player.playerName}</span>
                      </td>
                      <td className="text-right py-3 px-4 text-gray-600">{player.matches}</td>
                      <td className="text-right py-3 px-4">
                        <span className="font-bold text-secondary-900">{player.runs}</span>
                      </td>
                      <td className="text-right py-3 px-4 text-gray-600">{player.balls}</td>
                      <td className="text-right py-3 px-4 text-gray-600">{player.fours}</td>
                      <td className="text-right py-3 px-4 text-gray-600">{player.sixes}</td>
                      <td className="text-right py-3 px-4">
                        <span className="font-semibold text-primary-700">{player.strikeRate}</span>
                      </td>
                      <td className="text-right py-3 px-4 text-gray-600">{player.average}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* Bowling Statistics */}
      {bowling.length > 0 && (
        <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-secondary-800 via-secondary-900 to-secondary-800 px-6 py-4">
            <div className="flex items-center gap-3 text-white">
              <TrendingUp className="h-5 w-5 text-primary-400" />
              <span className="font-bold text-lg">Top Bowlers</span>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Player</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">M</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">O</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">M</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">R</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">W</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Econ</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wide">Avg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bowling.map((player, index) => (
                    <tr key={player.playerId || index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">{player.playerName}</span>
                      </td>
                      <td className="text-right py-3 px-4 text-gray-600">{player.matches}</td>
                      <td className="text-right py-3 px-4 text-gray-600">{player.overs.toFixed(1)}</td>
                      <td className="text-right py-3 px-4 text-gray-600">{player.maidens}</td>
                      <td className="text-right py-3 px-4 text-gray-600">{player.runs}</td>
                      <td className="text-right py-3 px-4">
                        <span className="font-bold text-secondary-900">{player.wickets}</span>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="font-semibold text-primary-700">{player.economy}</span>
                      </td>
                      <td className="text-right py-3 px-4 text-gray-600">{player.average}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}







