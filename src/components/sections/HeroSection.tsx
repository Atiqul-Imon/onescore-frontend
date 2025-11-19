'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Flame, TrendingUp } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { formatDate } from '@/lib/utils';

type Article = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  heroImage?: string;
  category: 'cricket' | 'football' | 'general';
  type: 'breaking' | 'match_report' | 'analysis' | 'feature' | 'interview' | 'opinion';
  publishedAt?: string;
  author?: { name?: string };
  readingTimeMinutes?: number;
};

type LiveMatch = {
  _id: string;
  matchId: string;
  teams: {
    home: { name: string; shortName: string; flag?: string };
    away: { name: string; shortName: string; flag?: string };
  };
  status: 'live' | 'completed' | 'upcoming';
  currentScore?: {
    home: { runs: number; wickets: number; overs: number };
    away: { runs: number; wickets: number; overs: number };
  };
  format?: string;
  venue?: { name: string; city: string };
};

export function HeroSection() {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [secondaryArticles, setSecondaryArticles] = useState<Article[]>([]);
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroData();
  }, []);

  async function fetchHeroData() {
    try {
      setLoading(true);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Fetch trending/featured articles
      const [newsRes, trendingRes, liveRes] = await Promise.allSettled([
        fetch(`${base}/api/news?limit=5&state=published`, { cache: 'no-store' }),
        fetch(`${base}/api/news/trending?limit=4`, { cache: 'no-store' }),
        fetch(`${base}/api/cricket/matches/live`, { cache: 'no-store' }),
      ]);

      // Get featured article (first from published or trending)
      let articles: Article[] = [];
      
      // Try news endpoint first
      if (newsRes.status === 'fulfilled' && newsRes.value.ok) {
        const newsData = await newsRes.value.json();
        articles = newsData?.data?.items || [];
      }
      
      // Fallback to trending if news endpoint failed or returned no articles
      if (articles.length === 0 && trendingRes.status === 'fulfilled' && trendingRes.value.ok) {
        const trendingData = await trendingRes.value.json();
        articles = trendingData?.data || [];
      }

      if (articles.length > 0) {
        setFeaturedArticle(articles[0]);
        setSecondaryArticles(articles.slice(1, 4));
      }

      // Get live matches
      if (liveRes.status === 'fulfilled' && liveRes.value.ok) {
        const liveData = await liveRes.value.json();
        // API returns { success: true, data: [...] } where data is the array directly
        setLiveMatches(Array.isArray(liveData?.data) ? liveData.data : []);
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
    } finally {
      setLoading(false);
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cricket': return 'bg-green-600';
      case 'football': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <section className="bg-white border-b border-gray-200 section-padding-sm">
        <Container size="2xl">
          <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg"></div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-white border-b border-gray-200 section-padding-sm">
      <Container size="2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Article - Large Hero */}
          <div className="lg:col-span-2">
            {featuredArticle ? (
              <Link href={`/${featuredArticle.slug}`} className="group block">
                <div className="relative h-[420px] md:h-[480px] bg-gray-100">
                  {featuredArticle.heroImage ? (
                    <Image
                      src={featuredArticle.heroImage}
                      alt={featuredArticle.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    {/* Category & Type Badge */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getCategoryColor(featuredArticle.category)}`}>
                        {featuredArticle.category}
                      </span>
                      {featuredArticle.type === 'breaking' && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-red-600 rounded-full text-xs font-semibold">
                          <Flame className="w-3 h-3" />
                          BREAKING
                        </span>
                      )}
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                        {getTypeLabel(featuredArticle.type)}
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight group-hover:underline">
                      {featuredArticle.title}
                    </h1>

                    {/* Summary */}
                    {featuredArticle.summary && (
                      <p className="text-white/90 text-sm md:text-base mb-4 line-clamp-2">
                        {featuredArticle.summary}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      {featuredArticle.author?.name && (
                        <span>By {featuredArticle.author.name}</span>
                      )}
                      {featuredArticle.publishedAt && (
                        <>
                          <span>•</span>
                          <time dateTime={featuredArticle.publishedAt}>
                            {formatDate(featuredArticle.publishedAt)}
                          </time>
                        </>
                      )}
                      {featuredArticle.readingTimeMinutes && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {featuredArticle.readingTimeMinutes} min read
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="h-[420px] md:h-[480px] bg-gray-100">
                <p className="text-gray-500">No featured article available</p>
              </div>
            )}
          </div>

          {/* Right Column - Secondary Articles & Live Scores */}
          <div className="space-y-6">
            {/* Secondary Featured Articles */}
            {secondaryArticles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-900">Trending</h2>
                </div>
                <div className="space-y-4">
                  {secondaryArticles.map((article) => (
                    <Link
                      key={article._id}
                      href={`/${article.slug}`}
                      className="group block"
                    >
                      <div className="flex gap-3 hover:bg-gray-50">
                        {article.heroImage ? (
                          <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                            <Image
                              src={article.heroImage}
                              alt={article.title}
                              fill
                              sizes="96px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 flex-shrink-0 rounded bg-gray-200"></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full ${getCategoryColor(article.category)}`}></span>
                            <span className="text-xs text-gray-500">
                              {article.category}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {article.title}
                          </h3>
                          {article.publishedAt && (
                            <time className="text-xs text-gray-500" dateTime={article.publishedAt}>
                              {formatDate(article.publishedAt)}
                            </time>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Live Matches */}
            {liveMatches.length > 0 && (
              <div className="border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <h2 className="text-lg font-bold text-gray-900">Live</h2>
                </div>
                <div className="space-y-3">
                  {liveMatches.slice(0, 3).map((match) => (
                    <Link
                      key={match._id}
                      href={`/cricket/match/${match.matchId}`}
                      className="block bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-gray-500">
                          {match.format || 'Match'}
                        </div>
                        {match.venue && (
                          <div className="text-xs text-gray-500">
                            {match.venue.city}
                          </div>
                        )}
                      </div>
                      {match.currentScore ? (
                        <>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs">{match.teams.home.flag || '🏏'}</span>
                              <span className="text-sm font-semibold text-gray-900">
                                {match.teams.home.shortName}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              {match.currentScore.home.runs}/{match.currentScore.home.wickets}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs">{match.teams.away.flag || '🏏'}</span>
                              <span className="text-sm font-semibold text-gray-900">
                                {match.teams.away.shortName}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              {match.currentScore.away.runs}/{match.currentScore.away.wickets}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            {match.currentScore.home.overs} overs
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-2 text-sm text-gray-600">
                          {match.teams.home.shortName} vs {match.teams.away.shortName}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
                {liveMatches.length > 3 && (
                  <Link
                    href="/cricket"
                    className="block mt-3 text-center text-sm text-blue-600"
                  >
                    View all live matches →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
