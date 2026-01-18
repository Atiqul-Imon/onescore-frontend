import Link from 'next/link';
import { Container, Button, Card } from '@/components/ui';
import { getCricketLeagueOverview } from '@/lib/cricket/mockData';
import { Goal, ArrowRight } from 'lucide-react';

export function CricketLeaguesOverview() {
  const leagues = getCricketLeagueOverview();

  return (
    <section className="section-padding bg-gray-50">
      <Container size="2xl">
        <div className="flex flex-col gap-4 text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600">
            <Goal className="h-3.5 w-3.5" />
            Tournament Hubs
          </span>
          <h2 className="heading-2">Cricket Leagues We Cover</h2>
          <p className="body-text max-w-2xl mx-auto">
            Explore franchise T20 thrills and long-form battles. Every hub includes live tables, fixtures, tactical
            insights, and broadcast details.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {leagues.map((league) => (
            <Card key={league.slug} className="h-full border border-gray-200 shadow-sm hover:shadow-md transition-standard">
              <div className="flex flex-col gap-4 p-6 h-full">
                <div className="flex items-center gap-3">
                  <img src={league.crest} alt={league.name} className="h-12 w-12 rounded-full bg-white p-2 shadow-inner" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{league.name}</h3>
                    <p className="text-sm text-gray-500">
                      {league.nation} · {league.format}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 flex-grow">{league.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {league.founded && <span>Founded {league.founded}</span>}
                  <span className="uppercase tracking-wide text-primary-600">Hub ready</span>
                </div>
                <Link href={`/cricket/leagues/${league.slug}`} className="mt-2 inline-flex">
                  <Button className="bg-primary-500 hover:bg-primary-600">
                    Open Hub <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

