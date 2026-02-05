import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleContent } from '@/components/news/ArticleContent';
import Script from 'next/script';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface PageProps {
  params: Promise<{
    year: string;
    month: string;
    slug: string[];
  }>;
}

async function getArticle(year: string, month: string, slug: string[]) {
  const articleSlug = (slug || []).join('/');

  try {
    // Try structured route first
    let res = await fetch(`${apiBase}/api/v1/news/slug/${year}/${month}/${articleSlug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // If structured route fails, try with encoded slug
    if (!res.ok && res.status === 404) {
      const fullSlug = `news/${year}/${month}/${articleSlug}`;
      res = await fetch(`${apiBase}/api/v1/news/slug/${encodeURIComponent(fullSlug)}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data && data.data) {
      return data.data;
    } else if (data && !data.data && data.success) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
    .substring(0, 300);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year, month, slug } = await params;
  const article = await getArticle(year, month, slug);

  if (!article) {
    return {
      title: 'Article Not Found | ScoreNews',
      description: 'The article you are looking for does not exist.',
    };
  }

  const articleUrl = `${siteUrl}/news/${year}/${month}/${(slug || []).join('/')}`;
  const title = article.title || 'Article | ScoreNews';
  const description = article.summary ? stripHtml(article.summary) : stripHtml(article.body || '');
  const category = article.category || 'General';
  const articleType = article.type?.replace('_', ' ') || 'Article';
  const authorName = article.author?.name || 'ScoreNews Editorial';
  const publishedTime = article.publishedAt
    ? new Date(article.publishedAt).toISOString()
    : new Date().toISOString();
  const modifiedTime = article.updatedAt
    ? new Date(article.updatedAt).toISOString()
    : publishedTime;

  // Get hero image or use default - ensure absolute URL
  let heroImage = `${siteUrl}/og-image.jpg`; // Default fallback
  if (article.heroImage) {
    if (article.heroImage.startsWith('http://') || article.heroImage.startsWith('https://')) {
      heroImage = article.heroImage;
    } else if (article.heroImage.startsWith('//')) {
      heroImage = `https:${article.heroImage}`;
    } else {
      // Relative URL - construct absolute URL
      const imagePath = article.heroImage.startsWith('/')
        ? article.heroImage
        : `/${article.heroImage}`;
      // Check if it's from API or CDN
      if (
        article.heroImage.includes('cloudinary') ||
        article.heroImage.includes('imagekit') ||
        article.heroImage.includes('cdn')
      ) {
        heroImage = article.heroImage.startsWith('/')
          ? `https:${article.heroImage}`
          : article.heroImage;
      } else {
        heroImage = `${apiBase}${imagePath}`;
      }
    }
  }

  // Build keywords from article data
  const keywords = [
    category.toLowerCase(),
    articleType.toLowerCase(),
    'cricket',
    'sports news',
    'scorenews',
    ...(article.tags || []).map((tag: string) => tag.toLowerCase()),
  ].filter(Boolean);

  return {
    title: title,
    description: description || 'Read the latest sports news and updates on ScoreNews.',
    keywords: keywords,
    authors: article.author?.name ? [{ name: article.author.name }] : undefined,
    creator: authorName,
    publisher: 'ScoreNews',
    category: category,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: articleUrl,
      title: title,
      description: description || 'Read the latest sports news and updates on ScoreNews.',
      siteName: 'ScoreNews',
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
      authors: article.author?.name ? [article.author.name] : undefined,
      section: category,
      tags: article.tags || [],
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description || 'Read the latest sports news and updates on ScoreNews.',
      creator: '@scorenews',
      site: '@scorenews',
      images: [heroImage],
    },
    robots: {
      index: article.state === 'published' ? true : false,
      follow: article.state === 'published' ? true : false,
      googleBot: {
        index: article.state === 'published' ? true : false,
        follow: article.state === 'published' ? true : false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'article:published_time': publishedTime,
      'article:modified_time': modifiedTime,
      'article:author': authorName,
      'article:section': category,
      'article:tag': (article.tags || []).join(', '),
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { year, month, slug } = await params;
  const article = await getArticle(year, month, slug);

  if (!article) {
    notFound();
  }

  const articleUrl = `${siteUrl}/news/${year}/${month}/${(slug || []).join('/')}`;
  const publishedTime = article.publishedAt
    ? new Date(article.publishedAt).toISOString()
    : new Date().toISOString();
  const modifiedTime = article.updatedAt
    ? new Date(article.updatedAt).toISOString()
    : publishedTime;
  const authorName = article.author?.name || 'ScoreNews Editorial';
  const category = article.category || 'General';

  // Get hero image URL - ensure absolute URL
  let heroImage = `${siteUrl}/og-image.jpg`; // Default fallback
  if (article.heroImage) {
    if (article.heroImage.startsWith('http://') || article.heroImage.startsWith('https://')) {
      heroImage = article.heroImage;
    } else if (article.heroImage.startsWith('//')) {
      heroImage = `https:${article.heroImage}`;
    } else {
      // Relative URL - construct absolute URL
      const imagePath = article.heroImage.startsWith('/')
        ? article.heroImage
        : `/${article.heroImage}`;
      // Check if it's from API or CDN
      if (
        article.heroImage.includes('cloudinary') ||
        article.heroImage.includes('imagekit') ||
        article.heroImage.includes('cdn')
      ) {
        heroImage = article.heroImage.startsWith('/')
          ? `https:${article.heroImage}`
          : article.heroImage;
      } else {
        heroImage = `${apiBase}${imagePath}`;
      }
    }
  }

  // Structured Data (JSON-LD) for Article
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary || stripHtml(article.body || ''),
    image: heroImage,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(article.author?.email && { email: article.author.email }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'ScoreNews',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: category,
    keywords: (article.tags || []).join(', '),
    articleBody: stripHtml(article.body || ''),
    wordCount: article.body ? stripHtml(article.body).split(/\s+/).length : 0,
    timeRequired: article.readingTimeMinutes ? `PT${article.readingTimeMinutes}M` : undefined,
    inLanguage: 'en-US',
  };

  // BreadcrumbList structured data
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'News',
        item: `${siteUrl}/news`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category,
        item: `${siteUrl}/news?category=${encodeURIComponent(category)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  // Organization structured data
  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ScoreNews',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      // Add social media links if available
      // 'https://www.facebook.com/scorenews',
      // 'https://twitter.com/scorenews',
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <Script
        id="article-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />

      {/* Article Content */}
      <ArticleContent article={article} />
    </>
  );
}
