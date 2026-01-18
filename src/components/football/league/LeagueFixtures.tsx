import { format } from 'date-fns';
import { LeagueFixture } from '@/lib/football/types';

interface LeagueFixturesProps {
  fixtures: LeagueFixture[];
}

export function LeagueFixtures({ fixtures }: LeagueFixturesProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Fixtures</h2>
          <p className="text-sm text-gray-500">Kick-off times adapted for IST</p>
        </div>
        <span className="text-xs uppercase tracking-wide text-gray-400">Next 3</span>
      </div>
      <div className="divide-y divide-gray-100">
        {fixtures.map((fixture) => (
          <div key={fixture.id} className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="flex flex-col items-center gap-1 text-sm text-gray-500">
                <span className="text-xs uppercase tracking-wide text-gray-400">Kick-off</span>
                <span className="rounded-md bg-primary-50 px-2 py-1 text-xs font-semibold text-primary-600">
                  {format(new Date(fixture.kickoff), 'EEE, MMM d')}
                </span>
                <span>{format(new Date(fixture.kickoff), 'HH:mm')}</span>
              </div>
              <div className="flex flex-col gap-2 text-sm font-medium text-gray-800">
                <div className="flex items-center gap-2">
                  <img src={fixture.homeCrest} alt={fixture.homeTeam} className="h-6 w-6 rounded-full bg-white p-1 shadow-inner" />
                  <span>{fixture.homeTeam}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-xs uppercase tracking-wide">vs</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={fixture.awayCrest} alt={fixture.awayTeam} className="h-6 w-6 rounded-full bg-white p-1 shadow-inner" />
                  <span>{fixture.awayTeam}</span>
                </div>
              </div>
            </div>
            <div className="w-full text-sm text-gray-500 md:w-1/3">
              <div className="font-medium text-gray-700">{fixture.venue}</div>
              {fixture.broadcast && <div>Live on {fixture.broadcast}</div>}
              {fixture.matchweek && <div className="text-xs uppercase tracking-wide text-gray-400">{fixture.matchweek}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

