import { Suspense } from 'react';
import { Metadata } from 'next';
import { HeroSectionWrapper } from '@/components/sections/HeroSectionWrapper';
import { LiveMatchesSection } from '@/components/sections/LiveMatchesSection';
import { FeaturedContentSection } from '@/components/sections/FeaturedContentSection';
import { NewsSection } from '@/components/sections/NewsSection';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const metadata: Metadata = {
  title: 'ScoreNews - Live Cricket & Football Scores',
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
    title: 'ScoreNews - Live Cricket & Football Scores',
    description: 'Get live cricket and football scores, fixtures, and user-generated content.',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ScoreNews',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScoreNews - Live Cricket & Football Scores',
    description: 'Get live cricket and football scores, fixtures, and user-generated content.',
    images: ['/og-image.jpg'],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <Suspense fallback={
        <section className="section-padding bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="glass-panel h-[420px] animate-pulse bg-white/5"></div>
          </div>
        </section>
      }>
        <HeroSectionWrapper />
      </Suspense>
      
      {/* Live Matches Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <LiveMatchesSection />
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
