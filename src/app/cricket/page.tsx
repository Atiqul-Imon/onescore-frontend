import { Suspense } from 'react';
import { Metadata } from 'next';
import {
  CricketHero,
  LiveCricketMatches,
  CricketSeries,
  CricketFixtures,
  CricketResults,
  CricketLeagueTeasers,
} from '@/components/cricket';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Cricket - Live Scores, Matches & Series',
  description: 'Get live cricket scores, match updates, series information, and tournament details. Stay updated with the latest cricket news and results.',
  keywords: [
    'cricket',
    'live cricket scores',
    'cricket matches',
    'cricket series',
    'cricket tournaments',
    'cricket news'
  ],
};

export default function CricketPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cricket Hero Section */}
      <CricketHero />
      
      <CricketLeagueTeasers />

      <Suspense fallback={<LoadingSpinner />}>
        <LiveCricketMatches />
      </Suspense>
      
      {/* Cricket Series */}
      <Suspense fallback={<LoadingSpinner />}>
        <CricketSeries />
      </Suspense>
      
      {/* Upcoming Fixtures */}
      <Suspense fallback={<LoadingSpinner />}>
        <CricketFixtures />
      </Suspense>
      
      {/* Recent Results */}
      <Suspense fallback={<LoadingSpinner />}>
        <CricketResults />
      </Suspense>
    </div>
  );
}
