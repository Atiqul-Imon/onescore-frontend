'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import Image from 'next/image';

interface RelatedArticlesProps {
  articleId: string;
}

interface Article {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  heroImage?: string;
  publishedAt?: string;
  readingTimeMinutes?: number;
  author?: {
    name: string;
  };
}

export function RelatedArticles({ articleId }: RelatedArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${base}/api/news/articles/${articleId}/related`);
        if (res.ok) {
          const json = await res.json();
          setArticles(json?.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [articleId]);

  if (loading || articles.length === 0) return null;

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-2xl font-semibold mb-6">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link key={article._id} href={`/${article.slug}`} className="group">
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {article.heroImage && (
                <div className="relative w-full h-48">
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div className="p-4">
                <h4 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h4>
                {article.summary && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.summary}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {article.readingTimeMinutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readingTimeMinutes} min read</span>
                    </div>
                  )}
                  {article.author?.name && <span>{article.author.name}</span>}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

