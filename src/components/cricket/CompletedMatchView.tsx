'use client';

import { Card } from '@/components/ui/Card';

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
    batting?: Array<{
      playerId?: string;
      playerName?: string;
      runs: number;
      balls: number;
      fours: number;
      sixes: number;
      strikeRate: number;
      isOut: boolean;
      dismissedBy?: string;
      teamName: string;
      fowScore?: number;
      fowBalls?: number;
    }>;
    bowling?: Array<{
      playerId?: string;
      playerName?: string;
      overs: number;
      maidens: number;
      runs: number;
      wickets: number;
      economy: number;
      teamName: string;
    }>;
    lastWicket?: {
      playerName?: string;
      runs: number;
      balls: number;
      fowScore?: number;
      fowBalls?: number;
    };
    partnership?: {
      runs: number;
      balls: number;
      runRate: string;
    };
    manOfMatchId?: string;
    round?: string;
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
      {/* Match Summary - Combined Result & Innings */}
      <Card
        padding="none"
        className="rounded-none sm:rounded-2xl border-2 border-primary-300/60 bg-gradient-to-br from-primary-50/80 via-white to-blue-50/50 shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-blue-700 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 shadow-lg">
          <div className="flex items-center justify-between text-white">
            <span className="font-bold text-lg sm:text-xl">Match Summary</span>
            {match.series && (
              <span className="text-xs sm:text-sm text-primary-100 truncate max-w-[200px] sm:max-w-none">
                {match.series}
              </span>
            )}
          </div>
        </div>

        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Winner Announcement */}
          <div className="text-center pb-4 border-b-2 border-primary-200">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-900">
              {match.result?.resultText || `${winner.name} won by ${marginText}`}
            </h2>
            {/* Only show matchNote if it's different from resultText (additional context) */}
            {match.matchNote &&
              match.result?.resultText &&
              match.matchNote !== match.result.resultText &&
              !match.matchNote.includes(match.result.resultText) && (
                <p className="text-sm sm:text-base text-gray-700 mt-2">{match.matchNote}</p>
              )}
          </div>

          {/* Innings Table - Compact and Efficient */}
          {match.innings && match.innings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2 sm:py-3 px-2 lg:px-4 font-bold text-gray-900">
                      Team
                    </th>
                    <th className="text-right py-2 sm:py-3 px-2 lg:px-4 font-bold text-gray-900">
                      Score
                    </th>
                    <th className="text-right py-2 sm:py-3 px-2 lg:px-4 font-bold text-gray-900">
                      Overs
                    </th>
                    {match.innings && match.innings.some((i) => i.runRate && i.runRate > 0) && (
                      <th className="text-right py-2 sm:py-3 px-2 lg:px-4 font-bold text-gray-900">
                        RR
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {match.innings.map((inning, index) => {
                    const isWinnerInning = inning.team === winner.name;
                    const teamData =
                      inning.team === match.teams.home.name ? match.teams.home : match.teams.away;
                    return (
                      <tr
                        key={index}
                        className={`border-b border-gray-200 ${
                          isWinnerInning ? 'bg-green-50' : 'bg-white'
                        } hover:bg-gray-50 transition-colors`}
                      >
                        <td className="py-2 sm:py-3 px-2 lg:px-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div>
                              <div className="font-bold text-gray-900">{inning.team}</div>
                              <div className="text-xs text-gray-600">
                                {match.format?.toUpperCase()} • Innings {inning.number}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-2 sm:py-3 px-2 lg:px-4">
                          <div className="font-bold text-lg sm:text-xl text-gray-900">
                            {inning.runs}/{inning.wickets}
                          </div>
                        </td>
                        <td className="text-right py-3 px-3 sm:px-4 text-gray-700">
                          {inning.overs !== undefined ? inning.overs.toFixed(1) : '—'}
                        </td>
                        {match.innings && match.innings.some((i) => i.runRate && i.runRate > 0) && (
                          <td className="text-right py-3 px-3 sm:px-4 text-gray-700">
                            {inning.runRate && inning.runRate > 0 ? inning.runRate.toFixed(2) : '—'}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Fallback if innings data not available - show final scores */
            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-xl bg-gradient-to-br from-green-100 via-emerald-50 to-green-100 border-2 border-green-300 shadow-md px-2 lg:px-5 py-3 sm:py-4 lg:py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-gray-900">
                        {winner.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">{winner.shortName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-green-700">
                      {winnerScore?.runs || (homeFinal > awayFinal ? homeFinal : awayFinal)}
                      {winnerScore?.wickets !== undefined && (
                        <span className="text-xl sm:text-2xl text-gray-600 font-normal">
                          /{winnerScore.wickets}
                        </span>
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
              <div className="rounded-xl bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-100 border-2 border-blue-300 shadow-md px-2 lg:px-5 py-3 sm:py-4 lg:py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-gray-900">{loser.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{loser.shortName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-700">
                      {loserScore?.runs || (homeFinal > awayFinal ? awayFinal : homeFinal)}
                      {loserScore?.wickets !== undefined && (
                        <span className="text-xl sm:text-2xl text-gray-600 font-normal">
                          /{loserScore.wickets}
                        </span>
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
          )}

          {/* Match Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-gray-200">
            {match.tossWon && (
              <div className="px-2 lg:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 shadow-sm">
                <span className="text-xs text-gray-600 block mb-1">Toss</span>
                <span className="text-sm font-semibold text-gray-900">
                  {match.elected
                    ? `${match.tossWon} choose to ${match.elected.charAt(0).toUpperCase() + match.elected.slice(1)} First`
                    : `${match.tossWon} won the toss`}
                </span>
              </div>
            )}
            {match.round && (
              <div className="px-2 lg:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-50 border-2 border-indigo-300 shadow-sm">
                <span className="text-xs text-gray-600 block mb-1">Round</span>
                <span className="text-sm font-semibold text-gray-900 truncate">{match.round}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Batting Scorecard */}
      {match.batting && match.batting.length > 0 && (
        <Card
          padding="none"
          className="rounded-none sm:rounded-2xl border-2 border-primary-200/60 bg-gradient-to-br from-white via-primary-50/30 to-white shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 text-white">
              <span className="font-bold text-base sm:text-lg">Batting Scorecard</span>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {/* Group by team */}
              {[match.teams.home, match.teams.away].map((team) => {
                const teamBatting = (match.batting || []).filter((b) => b.teamName === team.name);
                if (teamBatting.length === 0) return null;

                return (
                  <div key={team.name} className="space-y-2">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-gray-200">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900">{team.name}</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-2 font-semibold text-gray-700">
                              Batter
                            </th>
                            <th className="text-right py-1.5 sm:py-2 px-1.5 lg:px-2 font-semibold text-gray-700">
                              R
                            </th>
                            <th className="text-right py-1.5 sm:py-2 px-1.5 lg:px-2 font-semibold text-gray-700">
                              B
                            </th>
                            <th className="text-right py-1.5 sm:py-2 px-1.5 lg:px-2 font-semibold text-gray-700">
                              4s
                            </th>
                            <th className="text-right py-1.5 sm:py-2 px-1.5 lg:px-2 font-semibold text-gray-700">
                              6s
                            </th>
                            <th className="text-right py-1.5 sm:py-2 px-1.5 lg:px-2 font-semibold text-gray-700">
                              SR
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamBatting.map((batter, idx) => (
                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-1.5 sm:py-2 px-1.5 lg:px-2">
                                <span className="font-medium text-gray-900">
                                  {batter.playerName ||
                                    (batter.playerId ? `Player ${batter.playerId}` : 'Unknown')}
                                </span>
                                {!batter.isOut && (
                                  <span className="text-green-600 font-bold ml-1">*</span>
                                )}
                                {batter.dismissedBy && (
                                  <span className="text-xs text-gray-500 block">
                                    b {batter.dismissedBy}
                                  </span>
                                )}
                              </td>
                              <td className="text-right py-2 px-2 font-medium">
                                {batter.runs || 0}
                              </td>
                              <td className="text-right py-2 px-2 text-gray-600">
                                {batter.balls || 0}
                              </td>
                              <td className="text-right py-2 px-2 text-gray-600">
                                {batter.fours || 0}
                              </td>
                              <td className="text-right py-2 px-2 text-gray-600">
                                {batter.sixes || 0}
                              </td>
                              <td className="text-right py-2 px-2 text-gray-600">
                                {batter.strikeRate ? batter.strikeRate.toFixed(1) : '0.0'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Bowling Scorecard */}
      {match.bowling && match.bowling.length > 0 && (
        <Card
          padding="none"
          className="rounded-none sm:rounded-2xl border-2 border-secondary-200/60 bg-gradient-to-br from-white via-secondary-50/30 to-white shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-secondary-600 via-secondary-700 to-secondary-600 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 text-white">
              <span className="font-bold text-base sm:text-lg">Bowling Scorecard</span>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {/* Group by team */}
              {[match.teams.home, match.teams.away].map((team) => {
                const teamBowling = (match.bowling || []).filter((b) => b.teamName === team.name);
                if (teamBowling.length === 0) return null;

                return (
                  <div key={team.name} className="space-y-2">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-gray-200">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900">{team.name}</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-2 font-semibold text-gray-700">
                              Bowler
                            </th>
                            <th className="text-right py-2 px-2 font-semibold text-gray-700">O</th>
                            <th className="text-right py-2 px-2 font-semibold text-gray-700">M</th>
                            <th className="text-right py-2 px-2 font-semibold text-gray-700">R</th>
                            <th className="text-right py-2 px-2 font-semibold text-gray-700">W</th>
                            <th className="text-right py-2 px-2 font-semibold text-gray-700">
                              Econ
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamBowling.map((bowler, idx) => (
                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-1.5 sm:py-2 px-1.5 lg:px-2">
                                <span className="font-medium text-gray-900">
                                  {bowler.playerName ||
                                    (bowler.playerId ? `Player ${bowler.playerId}` : 'Unknown')}
                                </span>
                              </td>
                              <td className="text-right py-2 px-2 font-medium">
                                {bowler.overs.toFixed(1)}
                              </td>
                              <td className="text-right py-2 px-2 text-gray-600">
                                {bowler.maidens || 0}
                              </td>
                              <td className="text-right py-2 px-2 text-gray-600">
                                {bowler.runs || 0}
                              </td>
                              <td className="text-right py-2 px-2 font-semibold text-primary-700">
                                {bowler.wickets || 0}
                              </td>
                              <td className="text-right py-2 px-2 text-gray-600">
                                {bowler.economy ? bowler.economy.toFixed(2) : '0.00'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Partnership Info */}
      {match.partnership && (
        <Card
          padding="none"
          className="rounded-none sm:rounded-2xl border-2 border-green-200/60 bg-gradient-to-br from-white via-green-50/30 to-white shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 text-white">
              <span className="font-bold text-base sm:text-lg">Match Highlights</span>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Partnership</span>
                <span className="text-sm font-bold text-gray-900">
                  {match.partnership.runs} runs, {match.partnership.balls} balls (RR:{' '}
                  {match.partnership.runRate})
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
