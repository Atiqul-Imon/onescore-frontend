import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  LeagueHero,
  LeagueStandingsTable,
  LeagueFixtures,
  LeagueResults,
  LeagueStatLeaders,
  LeagueInsights,
} from '@/components/football';
import { Container, Card } from '@/components/ui';
import { getLeagueOverview, getLeagueHubData } from '@/lib/football/mockData';
import type { LeagueSlug } from '@/lib/football/types';

type Params = { slug: LeagueSlug };

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getLeagueOverview().map((league) => ({ slug: league.slug }));
}

export function generateMetadata({ params }: any): Metadata {
  const league = getLeagueOverview().find((item) => item.slug === params.slug);
  if (!league) return {};

  return {
    title: `${league.name} Hub`,
    description: `Live standings, fixtures, results, and analysis for ${league.name}.`,
  };
}

export default function LeagueHubPage({ params }: any) {
  const slug = params.slug as LeagueSlug;
  const leagueExists = getLeagueOverview().some((item) => item.slug === slug);
  if (!leagueExists) notFound();

  const data = getLeagueHubData(slug);
  if (!data) notFound();

  const [nextFixture] = data.fixtures;

  return (
    <div className="bg-gray-100">
      <LeagueHero meta={data.meta} nextFixture={nextFixture} />

      <Container size="xl" className="py-12 space-y-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <LeagueStandingsTable standings={data.standings} leagueName={data.meta.name} />
            <LeagueFixtures fixtures={data.fixtures} />
            <LeagueResults results={data.results} />
          </div>
          <div className="space-y-6">
            <LeagueStatLeaders leaders={data.statLeaders} />
            <LeagueInsights insights={data.insights} />
          </div>
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="heading-3">Latest Stories</h2>
            <p className="text-sm text-gray-600">
              Curated coverage from our newsroom across match previews, tactical explainers, and form guides.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {data.news.map((story) => (
              <Card key={story.id} variant="interactive" padding="lg" className="h-full">
                <div className="space-y-2">
                  {story.tag && (
                    <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
                      {story.tag}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{story.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{story.summary}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    {new Date(story.publishedAt).toLocaleDateString()}
                  </p>
                  <Link
                    href={story.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-standard"
                  >
                    Read Story →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}

