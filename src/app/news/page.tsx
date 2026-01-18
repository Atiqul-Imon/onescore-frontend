import { ArticleCard } from '@/components/news/ArticleCard';
import { PageLayout } from '@/components/layout/PageLayout';

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
