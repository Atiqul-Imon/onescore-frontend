import { CricketFixture } from '@/lib/cricket/types';
import { CalendarDays, Clock, MapPin } from 'lucide-react';

interface CricketLeagueFixturesProps {
  fixtures: CricketFixture[];
}

export function CricketLeagueFixtures({ fixtures }: CricketLeagueFixturesProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Fixtures</h2>
          <p className="text-sm text-gray-500">Time zone adjusted to your browser locale</p>
        </div>
      </div>
      <ul className="divide-y divide-gray-100">
        {fixtures.map((fixture) => (
          <li key={fixture.id} className="flex flex-col gap-4 px-4 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">{fixture.matchNumber}</p>
              <div className="flex items-center gap-3">
                <img src={fixture.homeCrest} alt={fixture.homeTeam} className="h-7 w-7 rounded-full bg-white p-1 shadow" />
                <div className="text-sm font-medium text-gray-900">
                  {fixture.homeTeam}
                  <span className="text-gray-400"> vs </span>
                  {fixture.awayTeam}
                </div>
                <img src={fixture.awayCrest} alt={fixture.awayTeam} className="h-7 w-7 rounded-full bg-white p-1 shadow" />
              </div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {fixture.format} {fixture.dayNight ? '· Day/Night' : ''}
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary-500" />
                {new Date(fixture.kickoff).toLocaleString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  weekday: 'short',
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary-500" />
                {new Date(fixture.kickoff).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="h-4 w-4 text-primary-500" />
                {fixture.venue}
              </div>
              {fixture.broadcast && (
                <div className="text-xs text-primary-600">Live on {fixture.broadcast}</div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

