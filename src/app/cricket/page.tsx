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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  title: 'Cricket - Live Scores, Matches & Series',
  description:
    'Get live cricket scores, match updates, series information, and tournament details. Stay updated with the latest cricket news and results.',
  keywords: [
    'cricket',
    'live cricket scores',
    'cricket matches',
    'cricket series',
    'cricket tournaments',
    'cricket news',
    'cricket fixtures',
    'cricket results',
    'cricket commentary',
    'cricket live',
    'cricket updates',
    'international cricket',
    'cricket leagues',
  ],
  alternates: {
    canonical: `${siteUrl}/cricket`,
  },
  openGraph: {
    title: 'Cricket - Live Scores, Matches & Series | ScoreNews',
    description:
      'Get live cricket scores, match updates, series information, and tournament details. Stay updated with the latest cricket news and results.',
    type: 'website',
    url: `${siteUrl}/cricket`,
    siteName: 'ScoreNews',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Cricket Live Scores and Updates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cricket - Live Scores, Matches & Series | ScoreNews',
    description:
      'Get live cricket scores, match updates, series information, and tournament details.',
    images: [`${siteUrl}/og-image.jpg`],
  },
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
