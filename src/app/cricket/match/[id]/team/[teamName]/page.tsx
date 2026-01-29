'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ArrowLeft, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface BattingStat {
  playerId?: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  teamName: string;
}

interface BowlingStat {
  playerId?: string;
  playerName: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  teamName: string;
}

interface MatchDetails {
  _id: string;
  matchId: string;
  name?: string;
  teams: {
    home: { name: string; shortName: string; flag: string };
    away: { name: string; shortName: string; flag: string };
  };
  status: 'live' | 'completed' | 'upcoming' | 'cancelled';
  format: string;
  series?: string;
  startTime: string;
}

export default function TeamMatchStatsPage() {
  const params = useParams();
  const matchId = params.id as string;
  const teamName = decodeURIComponent(params.teamName as string).replace(/-/g, ' ');

  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [batting, setBatting] = useState<BattingStat[]>([]);
  const [bowling, setBowling] = useState<BowlingStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        setLoading(true);
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        // Fetch match details
        const matchResponse = await fetch(`${apiBase}/api/v1/cricket/matches/${matchId}?t=${Date.now()}`);
        if (!matchResponse.ok) {
          throw new Error('Match not found');
        }
        const matchData = await matchResponse.json();
        setMatch(matchData);

        // Filter stats for this team
        if (matchData.batting) {
          const teamBatting = matchData.batting.filter(
            (b: BattingStat) => b.teamName && b.teamName.toLowerCase() === teamName.toLowerCase()
          );
          setBatting(teamBatting);
        }

        if (matchData.bowling) {
          const teamBowling = matchData.bowling.filter(
            (b: BowlingStat) => b.teamName && b.teamName.toLowerCase() === teamName.toLowerCase()
          );
          setBowling(teamBowling);
        }

        // Verify team exists in match
        const isValidTeam = 
          matchData.teams?.home?.name?.toLowerCase() === teamName.toLowerCase() ||
          matchData.teams?.away?.name?.toLowerCase() === teamName.toLowerCase();

        if (!isValidTeam) {
          setError('Team not found in this match');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching team stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (matchId && teamName) {
      fetchTeamStats();
    }
  }, [matchId, teamName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !match) {
    return notFound();
  }

  const team = match.teams.home.name.toLowerCase() === teamName.toLowerCase() 
    ? match.teams.home 
    : match.teams.away;

  return (
    <div className="min-h-screen bg-gray-50">
      <Container size="2xl" className="py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/cricket/match/${matchId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Match
          </Link>
          
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl">{team.flag}</span>
              <div>
                <h1 className="text-2xl font-bold">{team.name}</h1>
                <p className="text-primary-100 text-sm">{match.name || `${match.teams.home.name} vs ${match.teams.away.name}`}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <span className="px-3 py-1 bg-white/20 rounded-full">{match.format}</span>
              {match.series && <span className="px-3 py-1 bg-white/20 rounded-full">{match.series}</span>}
              <span className="px-3 py-1 bg-white/20 rounded-full capitalize">{match.status}</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          {/* Batting Statistics */}
          {batting.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-6 py-4">
                  <div className="flex items-center gap-3 text-white">
                    <Target className="h-5 w-5 text-primary-100" />
                    <span className="font-bold text-lg">Batting Statistics</span>
                  </div>
                </div>

                <div className="p-6">
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
                        {batting.map((player, index) => (
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
              </Card>
            </motion.div>
          )}

          {/* Bowling Statistics */}
          {bowling.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-secondary-800 via-secondary-900 to-secondary-800 px-6 py-4">
                  <div className="flex items-center gap-3 text-white">
                    <TrendingUp className="h-5 w-5 text-primary-400" />
                    <span className="font-bold text-lg">Bowling Statistics</span>
                  </div>
                </div>

                <div className="p-6">
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
                        {bowling.map((player, index) => (
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
              </Card>
            </motion.div>
          )}

          {batting.length === 0 && bowling.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <p className="text-gray-600">No statistics available for this team in this match yet.</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}







