import { StatLeader } from '@/lib/football/types';

interface LeagueStatLeadersProps {
  leaders: StatLeader[];
}

const metricLabels: Record<StatLeader['metric'], string> = {
  goals: 'Goals',
  assists: 'Assists',
  cleanSheets: 'Clean Sheets',
};

export function LeagueStatLeaders({ leaders }: LeagueStatLeadersProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
        <p className="text-sm text-gray-500">Latest numbers across key metrics</p>
      </div>
      <div className="grid gap-4 px-4 py-4 md:grid-cols-3">
        {leaders.map((leader) => (
          <div key={`${leader.player}-${leader.metric}`} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
            <img src={leader.crest} alt={leader.team} className="h-10 w-10 rounded-full bg-white p-2 shadow-inner" />
            <div className="space-y-1">
              <div className="text-sm font-semibold text-gray-900">{leader.player}</div>
              <div className="text-xs uppercase tracking-wide text-gray-500">{leader.team}</div>
            </div>
            <div className="ml-auto text-right">
              <span className="text-xl font-bold text-primary-600">{leader.value}</span>
              <div className="text-xs text-gray-500">{metricLabels[leader.metric]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

