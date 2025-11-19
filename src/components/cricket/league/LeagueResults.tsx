import { CricketResult } from '@/lib/cricket/types';
import { Trophy } from 'lucide-react';

interface CricketLeagueResultsProps {
  results: CricketResult[];
}

export function CricketLeagueResults({ results }: CricketLeagueResultsProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recent Results</h2>
          <p className="text-sm text-gray-500">Completed fixtures with top performers</p>
        </div>
      </div>
      <ul className="divide-y divide-gray-100">
        {results.map((match) => (
          <li key={match.id} className="flex flex-col gap-4 px-4 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 text-sm text-gray-900">
              <p className="text-xs uppercase tracking-wide text-emerald-600">{match.matchNumber}</p>
              <div className="flex items-center gap-3">
                <img src={match.homeCrest} alt={match.homeTeam} className="h-7 w-7 rounded-full bg-white p-1 shadow" />
                <div className="font-medium">
                  {match.homeTeam}
                  <span className="text-gray-400"> vs </span>
                  {match.awayTeam}
                </div>
                <img src={match.awayCrest} alt={match.awayTeam} className="h-7 w-7 rounded-full bg-white p-1 shadow" />
              </div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {match.format} {match.dayNight ? '· Day/Night' : ''}
              </p>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="font-medium text-gray-900">{match.resultSummary}</p>
              {match.playerOfMatch && (
                <p className="flex items-center gap-2 text-xs text-emerald-600">
                  <Trophy className="h-4 w-4" />
                  Player of the Match: {match.playerOfMatch}
                </p>
              )}
              <p className="text-xs text-gray-500">
                {new Date(match.kickoff).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
                {' · '}
                {match.venue}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

