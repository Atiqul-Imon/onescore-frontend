import { LeagueStanding } from '@/lib/football/types';

interface LeagueStandingsTableProps {
  standings: LeagueStanding[];
  leagueName: string;
}

export function LeagueStandingsTable({ standings, leagueName }: LeagueStandingsTableProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Standings</h2>
          <p className="text-sm text-gray-500">Top performers in the {leagueName}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
          Updated 5 mins ago
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">
                Pos
              </th>
              <th scope="col" className="px-4 py-3 text-left">
                Team
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                P
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                W
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                D
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                L
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                GF
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                GA
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                GD
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Pts
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Form
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {standings.map((team) => (
              <tr key={team.team} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-left text-gray-500">{team.position}</td>
                <td className="px-4 py-3 text-left font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <img src={team.crest} alt={team.team} className="h-6 w-6 rounded-full bg-white p-1 shadow-inner" />
                    <span>{team.team}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">{team.played}</td>
                <td className="px-4 py-3 text-right">{team.won}</td>
                <td className="px-4 py-3 text-right">{team.drawn}</td>
                <td className="px-4 py-3 text-right">{team.lost}</td>
                <td className="px-4 py-3 text-right">{team.goalsFor}</td>
                <td className="px-4 py-3 text-right">{team.goalsAgainst}</td>
                <td className="px-4 py-3 text-right">{team.goalDifference}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{team.points}</td>
                <td className="px-4 py-3 text-right text-xs text-gray-500">{team.form}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 px-4 py-3 text-xs text-gray-500">
        Champions League spots highlighted. Full table and xG tables coming soon.
      </div>
    </div>
  );
}

