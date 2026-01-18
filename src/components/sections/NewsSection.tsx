import { ArticleCard } from '@/components/news/ArticleCard';
import { Container } from '@/components/ui/Container';

export async function NewsSection() {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${base}/api/v1/news?limit=6`, { next: { revalidate: 0 }, cache: 'no-store' });
    if (!res.ok) {
      return (
        <section className="section-padding bg-gray-100">
          <Container size="lg">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-600">
              Unable to load news. Please check back later.
            </div>
          </Container>
        </section>
      );
    }
    const data = await res.json();
    const items = data?.data?.items || [];

  return (
    <section className="section-padding bg-gray-100">
      <Container size="lg">
        <div className="flex items-center justify-between mb-8">
          <h2 className="heading-2">Latest News</h2>
          <a href="/news" className="text-sm text-primary-600 hover:text-primary-700 hover:underline transition-standard">View all</a>
        </div>
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
      </Container>
    </section>
  );
  } catch (error) {
    return (
      <section className="section-padding bg-gray-100">
        <Container size="lg">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-600">
            Unable to load news. Please check back later.
          </div>
        </Container>
      </section>
    );
  }
}
