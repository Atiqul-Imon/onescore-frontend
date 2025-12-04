'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Clock, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { formatDate } from '@/lib/utils';
import type { Article, LiveMatch } from './HeroSectionWrapper';

interface HeroSectionProps {
  featuredArticle: Article | null;
  secondaryArticles: Article[];
  liveMatches: LiveMatch[];
}

const placeholderLiveMatches: LiveMatch[] = [
  {
    _id: 'placeholder-1',
    matchId: 'placeholder-1',
    teams: {
      home: { name: 'Mumbai Titans', shortName: 'MT', flag: '🇮🇳' },
      away: { name: 'Sydney Strikers', shortName: 'SS', flag: '🇦🇺' },
    },
    status: 'upcoming',
    currentScore: {
      home: { runs: 0, wickets: 0, overs: 0 },
      away: { runs: 0, wickets: 0, overs: 0 },
    },
    format: 'T20',
    venue: { name: 'Wankhede Stadium', city: 'Mumbai' },
  },
  {
    _id: 'placeholder-2',
    matchId: 'placeholder-2',
    teams: {
      home: { name: 'London Royals', shortName: 'LR', flag: '🏴' },
      away: { name: 'Karachi Kings', shortName: 'KK', flag: '🇵🇰' },
    },
    status: 'upcoming',
    currentScore: {
      home: { runs: 0, wickets: 0, overs: 0 },
      away: { runs: 0, wickets: 0, overs: 0 },
    },
    format: 'ODI',
    venue: { name: 'The Oval', city: 'London' },
  },
  {
    _id: 'placeholder-3',
    matchId: 'placeholder-3',
    teams: {
      home: { name: 'Cape Warriors', shortName: 'CW', flag: '🇿🇦' },
      away: { name: 'Kingston Waves', shortName: 'KW', flag: '🇯🇲' },
    },
    status: 'upcoming',
    currentScore: {
      home: { runs: 0, wickets: 0, overs: 0 },
      away: { runs: 0, wickets: 0, overs: 0 },
    },
    format: 'Test',
    venue: { name: 'Newlands', city: 'Cape Town' },
  },
  {
    _id: 'placeholder-4',
    matchId: 'placeholder-4',
    teams: {
      home: { name: 'Dhaka Sparks', shortName: 'DS', flag: '🇧🇩' },
      away: { name: 'Melbourne Surge', shortName: 'MS', flag: '🇦🇺' },
    },
    status: 'upcoming',
    currentScore: {
      home: { runs: 0, wickets: 0, overs: 0 },
      away: { runs: 0, wickets: 0, overs: 0 },
    },
    format: 'T20',
    venue: { name: 'Sher-e-Bangla', city: 'Dhaka' },
  },
];

export function HeroSection({ featuredArticle, secondaryArticles, liveMatches }: HeroSectionProps) {
  const liveHighlights = liveMatches.slice(0, 4);
  const trendingArticles = secondaryArticles.slice(0, 4);
  const hasLiveMatches = liveHighlights.length > 0 && liveHighlights[0]?.status === 'live';
  const hasCompletedMatches = liveHighlights.length > 0 && liveHighlights[0]?.status === 'completed';
  const hasAnyMatches = liveHighlights.length > 0;
  const matchesToRender = hasAnyMatches ? liveHighlights : placeholderLiveMatches;

  return (
    <>
      <section className="section-padding bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Container size="2xl" className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-10 top-10 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        </div>

        <div className="glass-panel relative overflow-hidden">
          <div className="absolute inset-0 opacity-60">
            <div className="absolute -top-32 right-0 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute bottom-0 left-[-10%] h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
          </div>

          <div className="relative space-y-8 p-6 sm:p-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-[28px] border border-white/10 bg-slate-950/50 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                  <span className={`live-dot ${hasLiveMatches ? 'bg-red-500' : hasCompletedMatches ? 'bg-gray-400' : 'bg-emerald-400'}`} />
                  {hasLiveMatches ? 'Live Matches' : hasCompletedMatches ? 'Recent Results' : hasAnyMatches ? 'Upcoming Matches' : 'Coming Up'}
                </div>
                <Link href="/fixtures" className="inline-flex items-center gap-1 text-sm font-semibold text-white/80 transition-standard hover:text-white">
                  {hasLiveMatches ? 'View schedule' : hasAnyMatches ? 'See full calendar' : 'Browse fixtures'}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {hasAnyMatches ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {matchesToRender.map((match) => (
                  <Link
                    key={match._id}
                    href={hasLiveMatches 
                      ? (match.league ? `/football/match/${match.matchId}` : `/cricket/match/${match.matchId}`)
                      : '/fixtures'}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition-standard hover:border-white/30 hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span>{match.format || match.league || 'Match'}</span>
                      {match.venue && <span>{match.venue.city}</span>}
                    </div>
                    <div className="mt-3 space-y-3">
                      {(['home', 'away'] as Array<'home' | 'away'>).map((side) => {
                        const team = match.teams[side];
                        const current = match.currentScore ? match.currentScore[side] : undefined;
                        const isFootball = !!match.league && !match.format;
                        
                        // For cricket: runs/wickets, for football: goals
                        const score = hasLiveMatches
                          ? current
                            ? isFootball
                              ? current.runs?.toString() || '0' // Football uses runs field for goals
                              : `${current.runs}/${current.wickets}`
                            : match.score
                            ? match.score[side]?.toString()
                            : '—'
                          : hasCompletedMatches && match.score
                          ? match.score[side]?.toString()
                          : '—';

                        return (
                          <div key={side} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{team.flag || (isFootball ? '⚽' : '🏏')}</span>
                              <span className="text-sm font-semibold text-white">{team.shortName}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-white">{score}</p>
                              {hasLiveMatches && current && !isFootball && (
                                <p className="text-xs text-white/70">{current.overs} ov</p>
                              )}
                              {hasLiveMatches && isFootball && (
                                <p className="text-xs text-white/70">Live</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-200">
                      {hasLiveMatches ? 'See breakdown' : hasCompletedMatches ? 'View recap' : 'Match preview'}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                  <p className="text-sm text-white/70">
                    No matches available at the moment. Check back soon for live action!
                  </p>
                  <Link 
                    href="/fixtures" 
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 transition-standard hover:text-emerald-100"
                  >
                    Browse upcoming fixtures
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </Container>
    </section>

    {(featuredArticle || trendingArticles.length > 0) && (
      <section className="section-padding bg-white">
        <Container size="2xl">
          <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-gray-200 bg-white shadow-lg"
            >
              {featuredArticle ? (
                <Link href={`/${featuredArticle.slug}`} className="group block overflow-hidden rounded-3xl">
                  <div className="relative h-full min-h-[420px]">
                    {featuredArticle.heroImage ? (
                      <Image
                        src={featuredArticle.heroImage}
                        alt={featuredArticle.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-100">
                        <span className="text-gray-500">Image coming soon</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="relative flex h-full flex-col justify-between p-6 sm:p-10 text-white">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em]">
                          <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold">
                            {featuredArticle.category}
                          </span>
                          {featuredArticle.type === 'breaking' && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-red-400/60 bg-red-500/30 px-3 py-1 text-xs font-semibold text-white">
                              <Flame className="h-3 w-3" />
                              Breaking
                            </span>
                          )}
                          <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                            {featuredArticle.type ? featuredArticle.type.replace('_', ' ') : 'Story'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold tracking-[0.3em] text-white/70">Featured story</p>
                        <h2 className="text-3xl font-semibold leading-tight drop-shadow-lg sm:text-4xl lg:text-5xl">
                          {featuredArticle.title}
                        </h2>
                        {featuredArticle.summary && (
                          <p className="text-base text-white/85 sm:text-lg">
                            {featuredArticle.summary}
                          </p>
                        )}
                      </div>
                      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/80">
                        {featuredArticle.author?.name && <span>By {featuredArticle.author.name}</span>}
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
                              <Clock className="h-3 w-3" />
                              {featuredArticle.readingTimeMinutes} min read
                            </span>
                          </>
                        )}
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                          Read full story
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex min-h-[420px] items-center justify-center p-10 text-gray-500">
                  No featured article available.
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6 rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Newsroom</p>
                  <h3 className="text-lg font-semibold text-gray-900">Trending now</h3>
                </div>
                <Link href="/news" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 transition-standard hover:text-emerald-700">
                  View all
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {trendingArticles.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500">
                    Fresh updates are on the way. Check back soon for more stories.
                  </div>
                ) : (
                  trendingArticles.map((article) => (
                    <Link
                      key={article._id}
                      href={`/${article.slug}`}
                      className="group flex gap-4 rounded-2xl border border-white bg-white p-4 transition-standard hover:border-emerald-200 hover:shadow-md"
                    >
                      {article.heroImage ? (
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          <Image
                            src={article.heroImage}
                            alt={article.title}
                            fill
                            sizes="80px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-500">
                          No image
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className={`h-2 w-2 rounded-full ${article.category === 'cricket' ? 'bg-emerald-500' : article.category === 'football' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                          <span className="uppercase tracking-[0.2em]">{article.category}</span>
                        </div>
                        <h4 className="mt-1 text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-700">
                          {article.title}
                        </h4>
                        {article.publishedAt && (
                          <time className="text-xs text-gray-500" dateTime={article.publishedAt}>
                            {formatDate(article.publishedAt)}
                          </time>
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    )}
    </>
  );
}
