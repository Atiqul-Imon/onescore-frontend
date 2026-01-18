import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  CricketLeagueHero,
  CricketLeagueStandingsTable,
  CricketLeagueFixtures,
  CricketLeagueResults,
  CricketLeagueStatLeaders,
  CricketLeagueInsights,
  CricketLeagueNews,
} from '@/components/cricket';
import { Container } from '@/components/ui';
import { getCricketLeagueOverview, getCricketLeagueHubData } from '@/lib/cricket/mockData';
import type { CricketLeagueSlug } from '@/lib/cricket/types';

type Params = { slug: CricketLeagueSlug };

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getCricketLeagueOverview().map((league) => ({ slug: league.slug }));
}

export function generateMetadata({ params }: any): Metadata {
  const league = getCricketLeagueOverview().find((item) => item.slug === params.slug);
  if (!league) return {};

  return {
    title: `${league.name} Cricket Hub`,
    description: `Live standings, fixtures, player leaders, and insights for the ${league.name}.`,
  };
}

export default function CricketLeagueHubPage({ params }: any) {
  const slug = params.slug as CricketLeagueSlug;
  const leagueExists = getCricketLeagueOverview().some((item) => item.slug === slug);
  if (!leagueExists) notFound();

  const data = getCricketLeagueHubData(slug);
  if (!data) notFound();

  const [nextFixture] = data.fixtures;

  return (
    <div className="bg-gray-100">
      <CricketLeagueHero meta={data.meta} nextFixture={nextFixture} />

      <Container size="xl" className="py-12 space-y-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CricketLeagueStandingsTable standings={data.standings} leagueName={data.meta.name} />
            <CricketLeagueFixtures fixtures={data.fixtures} />
            <CricketLeagueResults results={data.results} />
          </div>
          <div className="space-y-6">
            <CricketLeagueStatLeaders leaders={data.statLeaders} />
            <CricketLeagueInsights insights={data.insights} />
          </div>
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="heading-3">Latest Stories</h2>
            <p className="text-sm text-gray-600">
              Match previews, tactical angles, injury updates, and strategy notebooks curated for this league.
            </p>
          </div>
          <CricketLeagueNews news={data.news} />
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Continue exploring cricket</h3>
            <p className="text-sm text-gray-600">
              Return to the cricket dashboard or dive into fan discussions on Crowd Threads.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/cricket"
              className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-standard"
            >
              Cricket Dashboard
            </Link>
            <Link
              href="/threads?topic=cricket"
              className="inline-flex items-center justify-center rounded-lg border border-primary-500 px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-standard"
            >
              Join Crowd Threads
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

