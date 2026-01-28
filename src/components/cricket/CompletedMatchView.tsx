'use client';

import { Card } from '@/components/ui/Card';
import { Trophy, Award, Target, TrendingUp, CheckCircle2 } from 'lucide-react';

interface CompletedMatchViewProps {
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
    matchNote?: string;
    tossWon?: string;
    elected?: string;
    target?: number;
    result?: {
      winner: 'home' | 'away';
      winnerName: string;
      margin: number;
      marginType: 'runs' | 'wickets';
      resultText: string;
    };
  };
}

export function CompletedMatchView({ match }: CompletedMatchViewProps) {
  const homeScore = match.currentScore?.home;
  const awayScore = match.currentScore?.away;
  const homeFinal = match.score?.home || homeScore?.runs || 0;
  const awayFinal = match.score?.away || awayScore?.runs || 0;

  // Use stored result if available (calculated from backend), otherwise calculate fallback
  let winner: { name: string; shortName: string; flag: string };
  let loser: { name: string; shortName: string; flag: string };
  let winnerScore: any;
  let loserScore: any;
  let marginText: string;

  if (match.result && match.result.resultText) {
    // Use stored result from backend
    winner = match.result.winner === 'home' ? match.teams.home : match.teams.away;
    loser = match.result.winner === 'home' ? match.teams.away : match.teams.home;
    winnerScore = match.result.winner === 'home' ? homeScore : awayScore;
    loserScore = match.result.winner === 'home' ? awayScore : homeScore;
    marginText = match.result.resultText.replace(`${match.result.winnerName} won by `, '');
  } else {
    // Fallback calculation (shouldn't happen if backend is working correctly)
    const homeWon = homeFinal > awayFinal;
    winner = homeWon ? match.teams.home : match.teams.away;
    loser = homeWon ? match.teams.away : match.teams.home;
    winnerScore = homeWon ? homeScore : awayScore;
    loserScore = homeWon ? awayScore : homeScore;
    const margin = Math.abs(homeFinal - awayFinal);
    
    // Fallback logic
    const winnerWickets = winnerScore?.wickets ?? 10;
    if (winnerWickets < 10) {
      const wicketsRemaining = 10 - winnerWickets;
      marginText = `${wicketsRemaining} wicket${wicketsRemaining !== 1 ? 's' : ''}`;
    } else {
      marginText = `${margin} runs`;
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Match Result Summary - Cricinfo Style */}
      <Card className="rounded-2xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 via-white to-primary-50 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary-100 flex-shrink-0" />
            <span className="font-bold text-lg sm:text-xl">Match Result</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Winner Announcement */}
          <div className="text-center pb-4 border-b-2 border-primary-200">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-900">
                {match.result?.resultText || `${winner.name} won by ${marginText}`}
              </h2>
            </div>
            {match.matchNote && (
              <p className="text-sm sm:text-base text-gray-700 mt-2">{match.matchNote}</p>
            )}
          </div>

          {/* Final Scores */}
          <div className="space-y-3 sm:space-y-4">
            {/* Winner Score */}
            <div className="rounded-xl bg-green-50 border-2 border-green-200 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl">{winner.flag}</span>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900">{winner.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{winner.shortName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-green-700">
                    {winnerScore?.runs || (homeFinal > awayFinal ? homeFinal : awayFinal)}
                    {winnerScore?.wickets !== undefined && (
                      <span className="text-xl sm:text-2xl text-gray-600 font-normal">/{winnerScore.wickets}</span>
                    )}
                  </div>
                  {winnerScore?.overs > 0 && (
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                      ({winnerScore.overs}.{winnerScore.balls} overs)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Loser Score */}
            <div className="rounded-xl bg-gray-50 border-2 border-gray-200 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl">{loser.flag}</span>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900">{loser.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{loser.shortName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-700">
                    {loserScore?.runs || (homeFinal > awayFinal ? awayFinal : homeFinal)}
                    {loserScore?.wickets !== undefined && (
                      <span className="text-xl sm:text-2xl text-gray-600 font-normal">/{loserScore.wickets}</span>
                    )}
                  </div>
                  {loserScore?.overs > 0 && (
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                      ({loserScore.overs}.{loserScore.balls} overs)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-gray-200">
            {match.tossWon && (
              <div className="px-3 sm:px-4 py-2 rounded-lg bg-blue-50 border border-blue-200">
                <span className="text-xs text-gray-600 block mb-1">Toss</span>
                <span className="text-sm font-semibold text-gray-900">
                  {match.tossWon} {match.elected ? `(${match.elected})` : ''}
                </span>
              </div>
            )}
            {match.series && (
              <div className="px-3 sm:px-4 py-2 rounded-lg bg-purple-50 border border-purple-200">
                <span className="text-xs text-gray-600 block mb-1">Series</span>
                <span className="text-sm font-semibold text-gray-900 truncate">{match.series}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Innings Breakdown - Cricinfo Style */}
      {match.innings && match.innings.length > 0 && (
        <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-secondary-800 via-secondary-900 to-secondary-800 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3 text-white">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary-400 flex-shrink-0" />
              <span className="font-bold text-base sm:text-lg">Innings Breakdown</span>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {match.innings.map((inning, index) => {
                const isWinnerInning = inning.team === winner.name;
                return (
                  <div
                    key={index}
                    className={`rounded-xl border-2 p-4 sm:p-5 ${
                      isWinnerInning
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-gray-900">
                          {inning.team}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {match.format?.toUpperCase()} • Innings {inning.number}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {inning.runs}/{inning.wickets}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mt-1">
                          {inning.overs.toFixed(1)} overs
                          {inning.runRate > 0 && (
                            <span> • RR: {inning.runRate.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

