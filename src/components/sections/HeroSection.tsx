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

// Realistic demo live cricket matches (Cricinfo-style)
const placeholderLiveMatches: LiveMatch[] = [
  {
    _id: 'demo-1',
    matchId: 'demo-1',
    teams: {
      home: { name: 'India', shortName: 'IND', flag: '🇮🇳' },
      away: { name: 'Australia', shortName: 'AUS', flag: '🇦🇺' },
    },
    status: 'live',
    currentScore: {
      home: { runs: 187, wickets: 4, overs: 18.3 },
      away: { runs: 165, wickets: 6, overs: 20.0 },
    },
    format: 'T20I',
    venue: { name: 'Melbourne Cricket Ground', city: 'Melbourne' },
  },
  {
    _id: 'demo-2',
    matchId: 'demo-2',
    teams: {
      home: { name: 'England', shortName: 'ENG', flag: '🏴' },
      away: { name: 'Pakistan', shortName: 'PAK', flag: '🇵🇰' },
    },
    status: 'live',
    currentScore: {
      home: { runs: 142, wickets: 2, overs: 15.2 },
      away: { runs: 0, wickets: 0, overs: 0 },
    },
    format: 'ODI',
    venue: { name: 'Lord\'s Cricket Ground', city: 'London' },
  },
  {
    _id: 'demo-3',
    matchId: 'demo-3',
    teams: {
      home: { name: 'New Zealand', shortName: 'NZ', flag: '🇳🇿' },
      away: { name: 'South Africa', shortName: 'SA', flag: '🇿🇦' },
    },
    status: 'live',
    currentScore: {
      home: { runs: 89, wickets: 1, overs: 12.4 },
      away: { runs: 234, wickets: 8, overs: 50.0 },
    },
    format: 'ODI',
    venue: { name: 'Eden Park', city: 'Auckland' },
  },
  {
    _id: 'demo-4',
    matchId: 'demo-4',
    teams: {
      home: { name: 'Bangladesh', shortName: 'BAN', flag: '🇧🇩' },
      away: { name: 'Sri Lanka', shortName: 'SL', flag: '🇱🇰' },
    },
    status: 'live',
    currentScore: {
      home: { runs: 156, wickets: 3, overs: 16.5 },
      away: { runs: 0, wickets: 0, overs: 0 },
    },
    format: 'T20I',
    venue: { name: 'Sher-e-Bangla National Stadium', city: 'Dhaka' },
  },
];

export function HeroSection({ featuredArticle, secondaryArticles, liveMatches }: HeroSectionProps) {
  const liveHighlights = liveMatches.slice(0, 4);
  const trendingArticles = secondaryArticles.slice(0, 4);
  const hasLiveMatches = liveHighlights.length > 0 && liveHighlights.some(m => m.status === 'live');
  const hasCompletedMatches = liveHighlights.length > 0 && liveHighlights.some(m => m.status === 'completed');
  const hasAnyMatches = liveHighlights.length > 0;
  // Always show matches - use demo if no real matches available
  const matchesToRender = hasAnyMatches ? liveHighlights : placeholderLiveMatches;
  // Update status indicators based on what we're showing
  const showingLiveMatches = hasLiveMatches || (!hasAnyMatches && placeholderLiveMatches.some(m => m.status === 'live'));

  return (
    <>
      <section className="section-padding bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Container size="2xl" className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-10 top-10 h-56 w-56 rounded-full bg-primary-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        </div>

        <div className="glass-panel relative overflow-hidden">
          <div className="absolute inset-0 opacity-60">
            <div className="absolute -top-32 right-0 h-64 w-64 rounded-full bg-primary-400/20 blur-3xl" />
            <div className="absolute bottom-0 left-[-10%] h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
          </div>

          <div className="relative space-y-8 p-6 sm:p-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-[28px] bg-slate-950/50 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                  <span className={`live-dot ${showingLiveMatches ? 'bg-red-500 animate-pulse' : hasCompletedMatches ? 'bg-gray-400' : 'bg-primary-400'}`} />
                  {showingLiveMatches ? 'Live Matches' : hasCompletedMatches ? 'Recent Results' : hasAnyMatches ? 'Upcoming Matches' : 'Live Cricket Scores'}
                </div>
                <Link href="/fixtures" className="inline-flex items-center gap-1 text-sm font-semibold text-white/80 transition-standard hover:text-white">
                  {showingLiveMatches ? 'View schedule' : hasAnyMatches ? 'See full calendar' : 'Browse fixtures'}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Always show matches - use demo if no real matches */}
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {matchesToRender.map((match, index) => {
                  const isLive = match.status === 'live';
                  const isFootball = !!match.league && !match.format;
                  const current = match.currentScore;
                  
                  return (
                    <Link
                      key={match._id}
                      href={isLive && !match._id.startsWith('demo')
                        ? (isFootball ? `/football/match/${match.matchId}` : `/cricket/match/${match.matchId}`)
                        : '/fixtures'}
                      className="group relative rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] p-5 transition-all duration-300 hover:border hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-primary-500/10"
                    >
                      {/* Live indicator badge */}
                      {isLive && (
                        <div className="absolute -top-2 -right-2 flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                          </span>
                          LIVE
                        </div>
                      )}
                      
                      {/* Match format/tournament */}
                      <div className="flex items-center justify-between text-xs font-medium text-white/60 mb-3">
                        <span className="uppercase tracking-wider">{match.format || match.league || 'Match'}</span>
                        {match.venue && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {match.venue.city}
                          </span>
                        )}
                      </div>
                      
                      {/* Teams and scores */}
                      <div className="space-y-4">
                        {(['home', 'away'] as Array<'home' | 'away'>).map((side, teamIndex) => {
                          const team = match.teams[side];
                          const teamScore = current ? current[side] : undefined;
                          const isFootball = !!match.league && !match.format;
                          
                          // Determine score display
                          let scoreDisplay = '—';
                          let oversDisplay = '';
                          
                          if (isLive && teamScore) {
                            if (isFootball) {
                              scoreDisplay = teamScore.runs?.toString() || '0';
                            } else {
                              scoreDisplay = `${teamScore.runs}/${teamScore.wickets}`;
                              if (teamScore.overs > 0) {
                                oversDisplay = `${teamScore.overs.toFixed(1)} ov`;
                              }
                            }
                          } else if (match.score) {
                            scoreDisplay = match.score[side]?.toString() || '—';
                          }
                          
                          // Determine if this team is batting (for cricket)
                          const isBatting = isLive && !isFootball && teamScore && teamScore.overs > 0;
                          
                          return (
                            <div 
                              key={side} 
                              className={`flex items-center justify-between gap-3 rounded-lg p-2.5 transition-colors ${
                                isBatting ? 'bg-primary-500/10 border border-primary-500/10' : ''
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <span className="text-2xl flex-shrink-0">{team.flag || (isFootball ? '⚽' : '🏏')}</span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-bold text-white truncate">{team.shortName}</p>
                                  {team.name !== team.shortName && (
                                    <p className="text-xs text-white/60 truncate">{team.name}</p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className={`text-xl font-bold ${isBatting ? 'text-primary-300' : 'text-white'}`}>
                                  {scoreDisplay}
                                </p>
                                {oversDisplay && (
                                  <p className="text-xs text-white/60 mt-0.5">{oversDisplay}</p>
                                )}
                                {isLive && isFootball && (
                                  <p className="text-xs text-red-400 font-semibold mt-0.5">Live</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Match status or action */}
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          {isLive ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse"></span>
                              Live Score
                            </span>
                          ) : match.status === 'completed' ? (
                            <span className="text-xs font-semibold text-white/60">Match Ended</span>
                          ) : (
                            <span className="text-xs font-semibold text-white/60">Upcoming</span>
                          )}
                          <ArrowRight className="h-3.5 w-3.5 text-white/40 group-hover:text-primary-300 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
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
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600">Newsroom</p>
                  <h3 className="text-lg font-semibold text-gray-900">Trending now</h3>
                </div>
                <Link href="/news" className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-standard hover:text-primary-700">
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
                      className="group flex gap-4 rounded-2xl border border-white bg-white p-4 transition-standard hover:border-primary-200 hover:shadow-md"
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
                          <span className={`h-2 w-2 rounded-full ${article.category === 'cricket' ? 'bg-primary-500' : article.category === 'football' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                          <span className="uppercase tracking-[0.2em]">{article.category}</span>
                        </div>
                        <h4 className="mt-1 text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-700">
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
