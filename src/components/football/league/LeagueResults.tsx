import { LeagueResult } from '@/lib/football/types';

interface LeagueResultsProps {
  results: LeagueResult[];
}

export function LeagueResults({ results }: LeagueResultsProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recent Results</h2>
          <p className="text-sm text-gray-500">Scoreline tracker from the latest matchweek</p>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {results.map((match) => (
          <div key={match.id} className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 text-sm text-gray-700 md:w-2/3">
              <div className="flex items-center gap-2">
                <img src={match.homeCrest} alt={match.homeTeam} className="h-6 w-6 rounded-full bg-white p-1 shadow-inner" />
                <span className="font-medium text-gray-900">{match.homeTeam}</span>
                <span className="text-base font-semibold text-gray-900">{match.score.home}</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={match.awayCrest} alt={match.awayTeam} className="h-6 w-6 rounded-full bg-white p-1 shadow-inner" />
                <span className="font-medium text-gray-900">{match.awayTeam}</span>
                <span className="text-base font-semibold text-gray-900">{match.score.away}</span>
              </div>
            </div>
            <div className="flex flex-col items-start text-xs text-gray-500 md:items-end md:text-right">
              <span className="uppercase tracking-wide text-gray-400">{match.matchweek}</span>
              <span>{match.venue}</span>
              {match.broadcast && <span>Live on {match.broadcast}</span>}
              <span>{new Date(match.kickoff).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

