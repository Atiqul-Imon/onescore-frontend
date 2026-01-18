'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { ArticleReactions } from '@/components/news/ArticleReactions';
import { ArticleComments } from '@/components/news/ArticleComments';
import { RelatedArticles } from '@/components/news/RelatedArticles';
import { Clock } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const year = params.year as string;
        const month = params.month as string;
        const slug = params.slug as string[];
        const fullSlug = `news/${year}/${month}/${slug.join('/')}`;
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${base}/api/v1/news/slug/${encodeURI(fullSlug)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setArticle(data?.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-600">
        Loading article...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-600">
        Article not found or unavailable.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-2 flex items-center gap-2 flex-wrap">
          <span>{article.category}</span>
          <span>•</span>
          <span>{article.type?.replace('_',' ')}</span>
          {article.publishedAt && (
            <>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
            </>
          )}
          {article.readingTimeMinutes && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{article.readingTimeMinutes} min read</span>
              </div>
            </>
          )}
        </div>
        <h1 className="text-4xl font-bold leading-tight mb-3">{article.title}</h1>
        {article.author?.name ? (
          <div className="text-sm text-gray-600">By {article.author.name}</div>
        ) : null}
      </div>

      {article.heroImage ? (
        <div className="mb-6">
          <Image src={article.heroImage} alt={article.title} width={1200} height={630} className="w-full h-auto object-cover" />
        </div>
      ) : null}

      <div className="prose max-w-none prose-p:leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: article.body }} />
      </div>

      {article._id && (
        <>
          <ArticleReactions
            articleId={String(article._id)}
            initialLikes={article.likes || 0}
            initialDislikes={article.dislikes || 0}
          />

          <ArticleComments articleId={String(article._id)} />

          <RelatedArticles articleId={String(article._id)} />
        </>
      )}
    </div>
  );
}


