import { Metadata } from 'next';
import { Container, Button } from '@/components/ui';
import { CricketLeaguesOverview } from '@/components/cricket/CricketLeagues';
import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cricket Leagues | Tournament Hubs & Live Tables',
  description:
    'Discover dedicated hubs for IPL, BBL, PSL, BPL, and the World Test Championship. Track tables, fixtures, insights, and match coverage in one place.',
};

export default function CricketLeaguesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-secondary-900 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-20 w-20 rounded-full border border-white/60" />
          <div className="absolute bottom-16 right-20 h-24 w-24 rounded-full border border-white/60" />
          <div className="absolute top-32 right-1/3 h-16 w-16 rounded-full border border-white/60" />
        </div>

        <Container size="2xl" className="relative z-10 py-16 lg:py-20">
          <div className="flex flex-col items-center gap-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-100 backdrop-blur">
              <Compass className="h-3.5 w-3.5" />
              Multi-League Navigation
            </span>
            <h1 className="heading-1 text-white drop-shadow-lg">Every Cricket League, One Command Centre</h1>
            <p className="body-text-lg max-w-3xl text-primary-100/80">
              Navigate franchise drama and international supremacy. Each hub delivers points tables, fixture schedules,
              player analytics, and insider notes curated by our newsroom.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="bg-primary-500 hover:bg-primary-400">
                <Link href="/cricket">Back to Cricket Dashboard</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/threads?topic=cricket">
                  Join Crowd Threads <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <p className="text-xs uppercase tracking-wide text-primary-200/70">
              Live data integrations rolling out soon · Desktop, tablet, and mobile optimised
            </p>
          </div>
        </Container>
      </section>

      <CricketLeaguesOverview />
    </>
  );
}

