import Link from 'next/link';
import { Container, Card } from '@/components/ui';
import { getCricketLeagueOverview } from '@/lib/cricket/mockData';
import { ArrowRight } from 'lucide-react';

export function CricketLeagueTeasers() {
  const leagues = getCricketLeagueOverview().slice(0, 4);

  return (
    <section className="section-padding">
      <Container size="2xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="heading-3">Tournament Command Centres</h2>
            <p className="body-text-sm text-gray-600">
              Jump into a hub for fixtures, points tables, form guides, and tactical notebooks.
            </p>
          </div>
          <Link
            href="/cricket/leagues"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition-standard"
          >
            View all leagues <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {leagues.map((league) => (
            <Card key={league.slug} className="h-full border border-gray-200 shadow-sm hover:shadow-md transition-standard">
              <Link href={`/cricket/leagues/${league.slug}`} className="block h-full">
                <div className="flex h-full flex-col gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <img src={league.crest} alt={league.name} className="h-10 w-10 rounded-full bg-white p-2 shadow-inner" />
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{league.name}</h3>
                      <p className="text-xs uppercase tracking-wide text-emerald-600">
                        {league.nation} · {league.format}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">{league.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    Open hub <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

