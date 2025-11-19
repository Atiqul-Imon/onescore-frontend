import Link from 'next/link';
import { Metadata } from 'next';
import { PageLayout } from '@/components/layout';
import { Card, Button, Container } from '@/components/ui';
import { getLeagueOverview } from '@/lib/football/mockData';
import { ArrowRight, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Football Leagues - Hubs & Coverage',
  description:
    'Explore Premier League, La Liga, Serie A, and UEFA Champions League hubs with standings, fixtures, and curated analysis.',
};

export default function FootballLeaguesOverviewPage() {
  const leagues = getLeagueOverview();

  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-800 text-white">
        <Container size="xl" className="py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              <Search className="w-4 h-4 text-emerald-300" />
              League Hubs
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              Pick a league. Dive deep into standings, stories, and matchdays.
            </h1>
            <p className="mt-4 text-lg text-blue-100/90">
              These hubs curate everything about your favourite competitions—fixture calendars, results, stats, and
              newsroom features—all in one dashboard.
            </p>
          </div>
        </Container>
      </section>

      <PageLayout
        title="Leagues We Cover"
        description="Choose a competition to open its dedicated hub with live standings, match insights, and editorial coverage."
        size="xl"
        className="bg-gray-100"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {leagues.map((league) => (
            <Card key={league.slug} variant="interactive" padding="lg" className="flex h-full flex-col gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={league.crest}
                  alt={league.name}
                  className="h-12 w-12 rounded-full bg-white p-2 shadow-inner"
                />
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{league.nation}</p>
                  <h2 className="text-lg font-semibold text-gray-900">{league.name}</h2>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-4">{league.description}</p>
              <div className="mt-auto">
                <Link href={`/football/leagues/${league.slug}`} className="inline-flex w-full">
                  <Button variant="outline" className="w-full">
                    Open Hub
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </PageLayout>
    </div>
  );
}

