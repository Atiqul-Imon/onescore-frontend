import { MetadataRoute } from 'next';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function getAllNewsArticles(): Promise<
  Array<{
    url: string;
    lastModified: Date;
    changeFrequency: 'daily' | 'weekly' | 'monthly';
    priority: number;
  }>
> {
  try {
    // Fetch all published articles for sitemap
    const res = await fetch(`${apiBase}/api/v1/news?state=published&limit=1000`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const articles = data?.data?.items || data?.items || [];

    return articles.map((article: any) => {
      // Parse slug to extract year, month, and slug parts
      const slugParts = article.slug?.split('/') || [];
      const year = slugParts[1] || new Date(article.publishedAt || article.createdAt).getFullYear();
      const month = String(
        new Date(article.publishedAt || article.createdAt).getMonth() + 1
      ).padStart(2, '0');
      const slug = slugParts.slice(3).join('/') || slugParts[0] || 'article';

      const url = `${siteUrl}/news/${year}/${month}/${slug}`;
      const lastModified = article.updatedAt
        ? new Date(article.updatedAt)
        : new Date(article.publishedAt || article.createdAt);

      // Determine priority based on article type and recency
      let priority = 0.7;
      if (article.type === 'breaking') priority = 0.9;
      else if (article.type === 'match_report') priority = 0.8;

      // Increase priority for recent articles (within last 7 days)
      const daysSincePublished = (Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSincePublished < 7) priority = Math.min(priority + 0.1, 1.0);

      return {
        url,
        lastModified,
        changeFrequency: 'daily' as const,
        priority,
      };
    });
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllNewsArticles();

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/cricket`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/football`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/cricket/results`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/fixtures`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Combine static pages with dynamic article pages
  return [...staticPages, ...articles];
}
