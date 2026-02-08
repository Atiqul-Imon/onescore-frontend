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
        const res = await fetch(`${base}/api/v1/news/articles/${articleId}/related`);
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
    <div className="border-t border-gray-200 pt-8">
      <h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-gray-900">
        Related Articles
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {articles.map((article) => (
          <Link key={article._id} href={`/${article.slug}`}>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              {article.heroImage && (
                <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-gray-100">
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <h4 className="font-semibold mb-2.5 line-clamp-2 text-gray-900 leading-snug">
                  {article.title}
                </h4>
                {article.summary && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {article.readingTimeMinutes && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
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
