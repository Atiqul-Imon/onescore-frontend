'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { ArticleReactions } from '@/components/news/ArticleReactions';
import { ArticleComments } from '@/components/news/ArticleComments';
import { RelatedArticles } from '@/components/news/RelatedArticles';
import { Container } from '@/components/ui/Container';
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
        const articleSlug = slug.join('/');
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        // Try structured route first (works better with NestJS routing)
        let res = await fetch(`${base}/api/v1/news/slug/${year}/${month}/${articleSlug}`, { 
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // If structured route fails, try with encoded slug
        if (!res.ok && res.status === 404) {
          const fullSlug = `news/${year}/${month}/${articleSlug}`;
          res = await fetch(`${base}/api/v1/news/slug/${encodeURIComponent(fullSlug)}`, { 
            cache: 'no-store',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
        
        if (!res.ok) {
          if (res.status === 404) {
            setArticle(null);
            return;
          }
          throw new Error(`Failed to fetch article: ${res.status}`);
        }
        
        const data = await res.json();
        if (data && data.data) {
          setArticle(data.data);
        } else if (data && !data.data && data.success) {
          // If response has success but no data wrapper
          setArticle(data);
        } else if (data && !data.success) {
          // If response is the article directly
          setArticle(data);
        } else {
          setArticle(null);
        }
      } catch (e) {
        console.error('Error loading article:', e);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params]);

  if (loading) {
    return (
      <Container size="lg" className="py-16 text-center text-gray-600">
        Loading article...
      </Container>
    );
  }

  if (!article) {
    return (
      <Container size="lg" className="py-16 text-center text-gray-600">
        Article not found or unavailable.
      </Container>
    );
  }

  return (
    <article className="bg-white min-h-screen">
      <Container size="lg" className="py-8 sm:py-12 lg:py-16">
        {/* Article Header */}
        <header className="mb-8 sm:mb-10 lg:mb-12">
          <div className="text-xs sm:text-sm uppercase tracking-wide text-gray-500 mb-4 flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-primary-600">{article.category}</span>
            <span className="text-gray-300">•</span>
            <span>{article.type?.replace('_',' ')}</span>
            {article.publishedAt && (
              <>
                <span className="text-gray-300">•</span>
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </>
            )}
            {article.readingTimeMinutes && (
              <>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readingTimeMinutes} min read</span>
                </div>
              </>
            )}
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-5 text-gray-900">
            {article.title}
          </h1>
          
          {article.summary && (
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-4 sm:mb-5 max-w-3xl">
              {article.summary}
            </p>
          )}
          
          {article.author?.name && (
            <div className="text-sm sm:text-base text-gray-600">
              By <span className="font-semibold text-gray-900">{article.author.name}</span>
            </div>
          )}
        </header>

        {/* Hero Image */}
        {article.heroImage && (
          <div className="mb-8 sm:mb-10 lg:mb-12 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="relative w-full aspect-video sm:aspect-[21/9] overflow-hidden bg-gray-100">
              <Image 
                src={article.heroImage} 
                alt={article.title} 
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Article Body */}
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg sm:prose-xl max-w-none 
            prose-headings:font-bold prose-headings:text-gray-900 prose-headings:leading-tight
            prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-4
            prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg
            prose-p:mb-5 sm:prose-p:mb-6
            prose-a:text-primary-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-ul:my-5 sm:prose-ul:my-6 prose-ul:space-y-2
            prose-ol:my-5 sm:prose-ol:my-6 prose-ol:space-y-2
            prose-li:text-gray-700 prose-li:text-base sm:prose-li:text-lg
            prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-6
            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
            prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-4 sm:prose-pre:p-6
            prose-hr:my-8 sm:prose-hr:my-10">
            <div dangerouslySetInnerHTML={{ __html: article.body }} />
          </div>

          {/* Article Actions & Comments */}
          {article._id && (
            <div className="mt-12 sm:mt-16 lg:mt-20 space-y-12 sm:space-y-16 lg:space-y-20">
              <ArticleReactions
                articleId={String(article._id)}
                initialLikes={article.likes || 0}
                initialDislikes={article.dislikes || 0}
              />

              <ArticleComments articleId={String(article._id)} />

              <RelatedArticles articleId={String(article._id)} />
            </div>
          )}
        </div>
      </Container>
    </article>
  );
}


