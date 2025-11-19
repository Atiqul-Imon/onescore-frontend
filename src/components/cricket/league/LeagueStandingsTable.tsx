import { CricketStanding } from '@/lib/cricket/types';

interface CricketStandingsProps {
  standings: CricketStanding[];
  leagueName: string;
}

export function CricketLeagueStandingsTable({ standings, leagueName }: CricketStandingsProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Points Table</h2>
          <p className="text-sm text-gray-500">Top five teams in the {leagueName}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
          Updated moments ago
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Pos</th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-right">M</th>
              <th className="px-4 py-3 text-right">W</th>
              <th className="px-4 py-3 text-right">L</th>
              <th className="px-4 py-3 text-right">T</th>
              <th className="px-4 py-3 text-right">NR</th>
              <th className="px-4 py-3 text-right">NRR</th>
              <th className="px-4 py-3 text-right">Pts</th>
              <th className="px-4 py-3 text-right">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {standings.map((row) => (
              <tr key={row.team} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-left text-gray-500">{row.position}</td>
                <td className="px-4 py-3 text-left font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <img src={row.crest} alt={row.team} className="h-6 w-6 rounded-full bg-white p-1 shadow-inner" />
                    {row.team}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">{row.matches}</td>
                <td className="px-4 py-3 text-right">{row.wins}</td>
                <td className="px-4 py-3 text-right">{row.losses}</td>
                <td className="px-4 py-3 text-right">{row.ties}</td>
                <td className="px-4 py-3 text-right">{row.noResult}</td>
                <td className="px-4 py-3 text-right">{row.netRunRate.toFixed(3)}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{row.points}</td>
                <td className="px-4 py-3 text-right text-xs text-gray-500">{row.form}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-gray-200 px-4 py-3 text-xs text-gray-500">
        NRR = Net Run Rate. Last five indicates most recent results (left to right).
      </div>
    </div>
  );
}

