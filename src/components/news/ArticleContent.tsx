'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { ArticleReactions } from '@/components/news/ArticleReactions';
import { ArticleComments } from '@/components/news/ArticleComments';
import { RelatedArticles } from '@/components/news/RelatedArticles';
import { Container } from '@/components/ui/Container';
import {
  Clock,
  User,
  Calendar,
  Tag,
  Share2,
  BookOpen,
  Loader2,
  AlertCircle,
  Newspaper,
} from 'lucide-react';
import Link from 'next/link';

interface ArticleContentProps {
  article: any;
}

export function ArticleContent({ article: initialArticle }: ArticleContentProps) {
  const [article] = useState(initialArticle);

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <Container size="lg" className="py-24">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h2>
            <p className="text-slate-600 mb-6">
              The article you are looking for does not exist or has been removed.
            </p>
            <a
              href="/news"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-700 hover:shadow-xl"
            >
              <BookOpen className="h-4 w-4" />
              Browse All News
            </a>
          </div>
        </Container>
      </div>
    );
  }

  const articleType = article.type?.replace('_', ' ') || 'Article';
  const category = article.category || 'General';

  // TrendingNewsSidebar Component
  function TrendingNewsSidebar({
    currentArticleId,
    category,
  }: {
    currentArticleId: string;
    category: string;
  }) {
    const [trendingArticles, setTrendingArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function loadTrending() {
        try {
          const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          // Fetch trending articles, excluding current article
          const res = await fetch(`${base}/api/v1/news/trending?limit=5`, {
            cache: 'no-store',
          });
          if (res.ok) {
            const data = await res.json();
            const articles = data?.data || data || [];
            // Filter out current article and limit to 4
            const filtered = articles.filter((a: any) => a._id !== currentArticleId).slice(0, 4);
            setTrendingArticles(filtered);
          }
        } catch (e) {
          console.error('Error loading trending news:', e);
        } finally {
          setLoading(false);
        }
      }
      loadTrending();
    }, [currentArticleId]);

    if (loading) {
      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        </div>
      );
    }

    if (trendingArticles.length === 0) {
      return null;
    }

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
          <Newspaper className="h-4 w-4" />
          Trending News
        </h3>
        <div className="space-y-4">
          {trendingArticles.map((item: any, index: number) => {
            const slugParts = item.slug?.split('/') || [];
            const year = slugParts[1] || '2026';
            const month = slugParts[2] || '02';
            const slug = slugParts.slice(3).join('/') || '';
            const href = `/news/${year}/${month}/${slug}`;

            return (
              <Link
                key={item._id || index}
                href={href}
                className="group block rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-md"
              >
                <h4 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {item.publishedAt && (
                    <time dateTime={item.publishedAt}>
                      {new Date(item.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                  {item.readingTimeMinutes && (
                    <>
                      <span>•</span>
                      <span>{item.readingTimeMinutes} min</span>
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        <Link
          href="/news"
          className="mt-4 block text-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          View All News →
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Container size="2xl" className="py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image - Separate */}
          {article.heroImage && (
            <div className="relative w-full aspect-video sm:aspect-[16/10] md:h-[50vh] lg:h-[60vh] lg:min-h-[500px] lg:max-h-[700px] mb-8 overflow-hidden bg-gray-100 rounded">
              <Image
                src={article.heroImage}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
            </div>
          )}

          {/* Title and Meta Information - Below Image */}
          {/* Category Badge */}
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-4 py-1.5 font-bold uppercase tracking-wider text-white shadow-lg">
              <Tag className="h-3.5 w-3.5" />
              {category}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-200 px-4 py-1.5 font-semibold uppercase tracking-wider text-gray-800">
              {articleType}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {article.author?.name && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                  <User className="h-4 w-4" />
                </div>
                <span className="font-semibold">{article.author.name}</span>
              </div>
            )}
            {article.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </div>
            )}
            {article.readingTimeMinutes && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.readingTimeMinutes} min read</span>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Summary Section */}
      {article.summary && (
        <Container size="lg" className="py-4 lg:py-6">
          <div className="mx-auto max-w-4xl">
            <p className="text-xl leading-relaxed text-slate-700 sm:text-2xl lg:text-3xl font-medium">
              {article.summary}
            </p>
          </div>
        </Container>
      )}

      {/* Article Content */}
      <Container size="lg" className="py-12 lg:py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
          {/* Main Content */}
          <div className="min-w-0">
            {/* Header (if no hero image) */}
            {!article.heroImage && (
              <header className="mb-10 border-b border-slate-200 pb-8">
                <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-4 py-1.5 font-bold uppercase tracking-wider text-primary-700">
                    <Tag className="h-3.5 w-3.5" />
                    {category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-1.5 font-semibold uppercase tracking-wider text-slate-700">
                    {articleType}
                  </span>
                  {article.publishedAt && (
                    <>
                      <span className="text-slate-400">•</span>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={article.publishedAt}>
                          {formatDate(article.publishedAt)}
                        </time>
                      </div>
                    </>
                  )}
                  {article.readingTimeMinutes && (
                    <>
                      <span className="text-slate-400">•</span>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span>{article.readingTimeMinutes} min read</span>
                      </div>
                    </>
                  )}
                </div>

                <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  {article.title}
                </h1>

                {article.summary && (
                  <p className="mb-6 text-xl leading-relaxed text-slate-700 sm:text-2xl">
                    {article.summary}
                  </p>
                )}

                {article.author?.name && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        By {article.author.name}
                      </p>
                      {article.author.email && (
                        <p className="text-xs text-slate-500">{article.author.email}</p>
                      )}
                    </div>
                  </div>
                )}
              </header>
            )}

            {/* Article Body */}
            <div className="prose prose-lg sm:prose-xl lg:prose-2xl max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-headings:leading-tight prose-headings:tracking-tight prose-h1:text-4xl sm:prose-h1:text-5xl prose-h1:mt-12 prose-h1:mb-6 prose-h1:font-extrabold prose-h2:text-3xl sm:prose-h2:text-4xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:font-bold prose-h3:text-2xl sm:prose-h3:text-3xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:font-bold prose-p:text-slate-700 prose-p:leading-[1.85] prose-p:text-lg sm:prose-p:text-xl prose-p:mb-6 sm:prose-p:mb-7 prose-p:font-normal prose-p:first:mt-0 prose-a:text-primary-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-a:decoration-2 prose-strong:text-slate-900 prose-strong:font-bold prose-ul:my-6 sm:prose-ul:my-8 prose-ul:space-y-3 prose-ul:pl-6 prose-ol:my-6 sm:prose-ol:my-8 prose-ol:space-y-3 prose-ol:pl-6 prose-li:text-slate-700 prose-li:text-lg sm:prose-li:text-xl prose-li:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-8 prose-blockquote:pr-6 prose-blockquote:italic prose-blockquote:text-slate-700 prose-blockquote:text-xl prose-blockquote:my-8 prose-blockquote:bg-slate-50 prose-blockquote:py-4 prose-blockquote:rounded-r-xl prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-10 sm:prose-img:my-12 prose-img:w-full prose-img:h-auto prose-img:object-contain prose-code:text-base prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-2xl prose-pre:p-6 sm:prose-pre:p-8 prose-pre:my-8 prose-pre:shadow-xl prose-pre:overflow-x-auto prose-hr:my-10 sm:prose-hr:my-12 prose-hr:border-slate-200">
              <style jsx global>{`
                .article-content p {
                  margin-bottom: 1.5rem !important;
                  margin-top: 0 !important;
                }
                .article-content p + p {
                  margin-top: 0 !important;
                }
                .article-content p:first-child {
                  margin-top: 0 !important;
                }
                .article-content p:last-child {
                  margin-bottom: 0 !important;
                }
              `}</style>
              <div className="article-content" dangerouslySetInnerHTML={{ __html: article.body }} />
            </div>

            {/* Tags Section */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 border-t border-slate-200 pt-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-600">Tags:</span>
                  {article.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Article Actions & Comments */}
            {article._id && (
              <div className="mt-16 space-y-16 border-t border-slate-200 pt-12">
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

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 space-y-6">
              {/* Share Section */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                  <Share2 className="h-4 w-4" />
                  Share Article
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.share?.({
                          title: article.title,
                          text: article.summary,
                          url: window.location.href,
                        });
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Trending/Related News */}
              <TrendingNewsSidebar currentArticleId={article._id} category={category} />

              {/* Author Card */}
              {article.author && (
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
                    Author
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {article.author.name || 'Admin User'}
                      </p>
                      {article.author.email && (
                        <p className="text-xs text-slate-500">{article.author.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </Container>
    </article>
  );
}
