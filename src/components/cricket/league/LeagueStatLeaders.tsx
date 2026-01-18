import { CricketStatLeader, CricketStatMetric } from '@/lib/cricket/types';
import { ArrowUpRight } from 'lucide-react';

const metricLabels: Record<CricketStatMetric, string> = {
  runs: 'Most Runs',
  wickets: 'Most Wickets',
  strikeRate: 'Best Strike Rate',
  economy: 'Best Economy',
};

interface CricketLeagueStatLeadersProps {
  leaders: CricketStatLeader[];
}

export function CricketLeagueStatLeaders({ leaders }: CricketLeagueStatLeadersProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Stat Leaders</h2>
          <p className="text-sm text-gray-500">Current MVP shortlist based on performance data</p>
        </div>
      </div>
      <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {leaders.map((leader) => (
          <div
            key={`${leader.metric}-${leader.player}`}
            className="rounded-xl border border-gray-100 bg-gradient-to-br from-white via-white to-primary-50/40 p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <img src={leader.crest} alt={leader.team} className="h-10 w-10 rounded-full bg-white p-1 shadow-inner" />
              <div>
                <p className="text-xs uppercase tracking-wide text-primary-600">{metricLabels[leader.metric]}</p>
                <h3 className="text-sm font-semibold text-gray-900">{leader.player}</h3>
                <p className="text-xs text-gray-500">{leader.team}</p>
              </div>
            </div>
              <p className="mt-4 text-2xl font-bold text-gray-900">{leader.value}</p>
            {leader.note && <p className="text-xs text-gray-500">{leader.note}</p>}
            <button className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-500">
              View full leaderboard <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

