import Link from 'next/link';
import { Container, Card, Button } from '@/components/ui';
import { Trophy, Users, TrendingUp, CalendarDays } from 'lucide-react';

const leagues = [
  {
    slug: 'premier-league',
    name: 'Premier League',
    nation: 'England',
    description: 'Live standings, title race metrics, top scorer chart, and tactical breakdowns every matchweek.',
    highlight: 'Pep vs Klopp rivalry renews this weekend.',
    icon: Trophy,
  },
  {
    slug: 'la-liga',
    name: 'La Liga',
    nation: 'Spain',
    description: 'El Clásico analysis, young talent radar, and power rankings across Spain’s elite clubs.',
    highlight: 'Keep an eye on the Girona fairy tale.',
    icon: TrendingUp,
  },
  {
    slug: 'serie-a',
    name: 'Serie A',
    nation: 'Italy',
    description: 'Detailed coverage on tactical shifts, defensive mastery, and Champions League qualifying race.',
    highlight: 'Title battle between Inter and Juventus heats up.',
    icon: Users,
  },
  {
    slug: 'uefa-champions-league',
    name: 'UEFA Champions League',
    nation: 'Europe',
    description: 'Midweek night tracker with lineups, xG insights, expected points, and knockout simulators.',
    highlight: 'Quarter-final draw coming up Monday.',
    icon: CalendarDays,
  },
];

export function FootballLeagues() {
  return (
    <section className="section-padding bg-white">
      <Container size="xl">
        <div className="mb-10 text-center">
          <h2 className="heading-2">Major Leagues At A Glance</h2>
          <p className="body-text text-gray-600">
            Data-rich dashboards updated daily. Explore tables, form guides, and narrative-driven coverage across Europe.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {leagues.map((league) => (
            <Card key={league.name} padding="lg" className="flex h-full flex-col gap-4 border-slate-200/80">
              <div className="flex items-center gap-3 text-emerald-600">
                <league.icon className="w-6 h-6" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{league.nation}</p>
                  <h3 className="text-lg font-semibold text-gray-900">{league.name}</h3>
                </div>
              </div>
              <p className="body-text text-gray-600">{league.description}</p>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-700">
                {league.highlight}
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-gray-400">Updated 5 mins ago</span>
                <Link href={`/football/leagues/${league.slug}`} className="inline-flex">
                  <Button variant="outline">Open Hub</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

