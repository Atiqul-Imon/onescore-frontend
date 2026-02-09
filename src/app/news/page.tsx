import { Metadata } from 'next';
import { ArticleCard } from '@/components/news/ArticleCard';
import { PageLayout } from '@/components/layout/PageLayout';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  title: 'Latest Sports News - ScoreNews',
  description:
    'Real-time sports coverage, analysis, and match reports. Stay updated with the latest cricket and football news, match reports, and expert analysis.',
  keywords: [
    'sports news',
    'cricket news',
    'football news',
    'sports articles',
    'match reports',
    'sports analysis',
    'sports coverage',
    'latest sports news',
    'cricket updates',
    'football updates',
    'sports journalism',
    'scorenews',
  ],
  alternates: {
    canonical: `${siteUrl}/news`,
  },
  openGraph: {
    title: 'Latest Sports News - ScoreNews',
    description:
      'Real-time sports coverage, analysis, and match reports. Stay updated with the latest cricket and football news.',
    type: 'website',
    url: `${siteUrl}/news`,
    siteName: 'ScoreNews',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Latest Sports News - ScoreNews',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest Sports News - ScoreNews',
    description: 'Real-time sports coverage, analysis, and match reports.',
    images: [`${siteUrl}/og-image.jpg`],
  },
};

async function getNews() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const res = await fetch(`${base}/api/v1/news`, { next: { revalidate: 0 } });
  if (!res.ok) return null;
  return res.json();
}

export default async function NewsPage() {
  const data = await getNews();
  const items = data?.data?.items || [];

  return (
    <PageLayout
      title="Latest News"
      description="Real-time sports coverage, analysis, and match reports."
      size="xl"
      className="min-h-screen"
    >
      {items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-600">
          No news articles yet. Please check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((article: any) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
