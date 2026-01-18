import { Metadata } from 'next';
import Link from 'next/link';
import { FootballHero, FootballLiveMatches, FootballLeagues, FootballSpotlight } from '@/components/football';
import { Container, Card, Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

const editorialHighlights = [
  {
    title: 'Five midfield maestros dictating Europe this month',
    excerpt: 'From Rodri’s orchestration to Barella’s verticality—our analysts break down the players redefining control.',
    href: '/news/football/midfield-maestros',
  },
  {
    title: 'Data Notebook: Decoding Xabi Alonso’s unbeaten Leverkusen run',
    excerpt: 'Expected threat maps, possession value models, and tactical tweaks that have Leverkusen flying.',
    href: '/news/football/xabi-alonso-leverkusen',
  },
  {
    title: 'Inside the Premier League relegation battle',
    excerpt: 'Simulations, injury dashboards, and fixture difficulty rating for the six clubs fighting to survive.',
    href: '/news/football/epl-relegation-battle',
  },
];

export const metadata: Metadata = {
  title: 'Football - Live Scores, Matches & Analysis',
  description:
    'Follow global football with live scores, upcoming fixtures, top league coverage, tactical analysis, and exclusive editorial features.',
};

export default function FootballPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <FootballHero />
      <FootballLiveMatches />
      <FootballLeagues />
      <FootballSpotlight />

      <section className="section-padding bg-white">
        <Container size="xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="heading-2">Editorial Highlights</h2>
              <p className="body-text text-gray-600">
                Deep dives and storytelling crafted by our newsroom. Daily features, driven by data and first-hand insight, across the football world.
              </p>
            </div>
            <Button variant="outline" className="self-start md:self-auto">
              View All Football Stories
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {editorialHighlights.map((story) => (
              <Card key={story.title} variant="interactive" className="h-full">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wide text-primary-600">Analysis</p>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{story.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{story.excerpt}</p>
                  <Link href={story.href} className="inline-flex">
                    <Button variant="ghost" className="px-0 text-primary-600 hover:text-primary-700">
                      Read Story
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
