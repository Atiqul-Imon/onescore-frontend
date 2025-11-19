import { CalendarDays, MapPin, Trophy } from 'lucide-react';
import { Container, Button } from '@/components/ui';
import { LeagueMeta, LeagueFixture } from '@/lib/football/types';

interface LeagueHeroProps {
  meta: LeagueMeta;
  nextFixture?: LeagueFixture;
}

export function LeagueHero({ meta, nextFixture }: LeagueHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-800 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-12 left-24 h-28 w-28 rounded-full border border-white/60" />
        <div className="absolute top-32 right-32 h-20 w-20 rounded-full border border-white/60" />
        <div className="absolute bottom-20 left-1/3 h-24 w-24 rounded-full border border-white/60" />
      </div>

      <Container size="xl" className="relative z-10 py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-5">
            <div className="flex items-center gap-3">
              <img src={meta.crest} alt={meta.name} className="h-16 w-16 rounded-full bg-white p-2 shadow-inner" />
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide backdrop-blur">
                  <Trophy className="h-3.5 w-3.5 text-emerald-300" />
                  {meta.nation}
                </span>
                <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{meta.name}</h1>
              </div>
            </div>
            <p className="text-lg text-blue-100/90">{meta.description}</p>
            {meta.founded && (
              <p className="text-sm text-blue-100/70">
                Established {meta.founded}. Unrivalled coverage from opening whistle to title celebrations.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400">
                View Live Standings
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Fixture Calendar
              </Button>
            </div>
          </div>

          {nextFixture && (
            <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-emerald-200">Next Highlighted Fixture</p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                {nextFixture.homeTeam} vs {nextFixture.awayTeam}
              </h3>
              <p className="text-sm text-blue-100/80">{nextFixture.matchweek}</p>
              <div className="mt-4 space-y-2 text-sm text-blue-100/80">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-emerald-300" />
                  {new Date(nextFixture.kickoff).toLocaleString('en-IN', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-300" />
                  {nextFixture.venue}
                </div>
                {nextFixture.broadcast && (
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    Live on {nextFixture.broadcast}
                  </div>
                )}
              </div>
              <p className="mt-4 text-xs text-blue-100/80">
                Track lineups, momentum swings, xG flow, and tactical talking points in real-time.
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

