import { Suspense } from 'react';
import { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { LiveMatchesSection } from '@/components/sections/LiveMatchesSection';
import { FeaturedContentSection } from '@/components/sections/FeaturedContentSection';
import { UpcomingFixturesSection } from '@/components/sections/UpcomingFixturesSection';
import { NewsSection } from '@/components/sections/NewsSection';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Sports Platform - Live Cricket & Football Scores',
  description: 'Get live cricket and football scores, fixtures, and user-generated content. Stay updated with real-time sports news and match updates.',
  keywords: [
    'cricket',
    'football',
    'live scores',
    'sports news',
    'match updates',
    'fixtures',
    'sports content'
  ],
  openGraph: {
    title: 'Sports Platform - Live Cricket & Football Scores',
    description: 'Get live cricket and football scores, fixtures, and user-generated content.',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sports Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sports Platform - Live Cricket & Football Scores',
    description: 'Get live cricket and football scores, fixtures, and user-generated content.',
    images: ['/og-image.jpg'],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Live Matches Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <LiveMatchesSection />
      </Suspense>
      
      {/* Upcoming Fixtures Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <UpcomingFixturesSection />
      </Suspense>
      
      {/* Featured Content Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <FeaturedContentSection />
      </Suspense>

      {/* News Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <NewsSection />
      </Suspense>
    </div>
  );
}
