'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Clock, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Container } from '@/components/ui/Container';
import { formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { handleApiError, getErrorMessage } from '@/lib/errors';
import type { Article, LiveMatch } from './HeroSectionWrapper';
import { CommunityMatchBadge } from '@/components/cricket/CommunityMatchBadge';
import { CricketMatch } from '@/store/slices/cricketSlice';

interface HeroSectionProps {
  /** Featured article to display prominently */
  featuredArticle?: Article | null;
  /** Secondary articles to display in grid */
  secondaryArticles?: Article[];
  /** Live matches to display */
  liveMatches?: LiveMatch[];
}

/**
 * HeroSection - Main hero section component for the homepage
 *
 * Displays:
 * - Featured article (large, prominent)
 * - Secondary articles (grid layout)
 * - Live cricket and football matches
 *
 * Features:
 * - Auto-refreshes live match data every 30 seconds
 * - Fetches news and match data from API
 * - Handles loading and error states
 * - Responsive design
 *
 * @param props - HeroSection component props
 * @param props.featuredArticle - Initial featured article (optional, will fetch if not provided)
 * @param props.secondaryArticles - Initial secondary articles (optional, will fetch if not provided)
 * @param props.liveMatches - Initial live matches (optional, will fetch if not provided)
 * @returns Hero section JSX element
 *
 * @example
 * ```tsx
 * <HeroSection
 *   featuredArticle={article}
 *   secondaryArticles={articles}
 *   liveMatches={matches}
 * />
 * ```
 */
export function HeroSection({
  featuredArticle: initialFeaturedArticle,
  secondaryArticles: initialSecondaryArticles,
  liveMatches: initialLiveMatches,
}: HeroSectionProps) {
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>(initialLiveMatches || []);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(
    initialFeaturedArticle || null
  );
  const [secondaryArticles, setSecondaryArticles] = useState<Article[]>(
    initialSecondaryArticles || []
  );

  const fetchHeroData = useCallback(async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      // Use timestamp to bypass backend cache for real-time updates
      const timestamp = Date.now();
      logger.debug(
        'Fetching matches',
        { timestamp: new Date().toLocaleTimeString() },
        'HeroSection'
      );

      // First try to fetch live matches (only these need frequent updates)
      const [newsRes, cricketLiveRes, footballLiveRes] = await Promise.allSettled([
        fetch(`${base}/api/v1/news?limit=5&state=published`, { next: { revalidate: 300 } }), // Cache news for 5 minutes
        fetch(`${base}/api/v1/cricket/matches/live?t=${timestamp}`, {
          cache: 'no-store',
          next: { revalidate: 0 },
        }),
        fetch(`${base}/api/v1/football/matches/live?t=${timestamp}`, {
          cache: 'no-store',
          next: { revalidate: 0 },
        }),
      ]);

      let allLiveMatches: LiveMatch[] = [];

      // Update articles
      if (newsRes.status === 'fulfilled' && newsRes.value.ok) {
        const newsData = await newsRes.value.json();
        const articles = newsData?.data?.items || [];
        if (articles.length > 0) {
          setFeaturedArticle(articles[0]);
          setSecondaryArticles(articles.slice(1, 4));
        }
      }

      // Update live matches
      if (cricketLiveRes.status === 'fulfilled' && cricketLiveRes.value.ok) {
        const cricketData = await cricketLiveRes.value.json();
        // Handle both array response and object with data property
        const cricketMatches = Array.isArray(cricketData)
          ? cricketData
          : Array.isArray(cricketData?.data)
            ? cricketData.data
            : [];
        const cricketLiveMatches = cricketMatches.filter(
          (match: LiveMatch) => match.format && !match.league
        );
        allLiveMatches = [...allLiveMatches, ...cricketLiveMatches];

        logger.debug(
          `Found ${cricketLiveMatches.length} cricket live matches`,
          undefined,
          'HeroSection'
        );
      } else if (cricketLiveRes.status === 'rejected') {
        logger.error('Failed to fetch cricket live matches', cricketLiveRes.reason, 'HeroSection');
      }

      if (footballLiveRes.status === 'fulfilled' && footballLiveRes.value.ok) {
        const footballData = await footballLiveRes.value.json();
        const footballMatches = Array.isArray(footballData?.data) ? footballData.data : [];
        const footballLiveMatches = footballMatches.filter(
          (match: LiveMatch) => match.league && !match.format
        );
        allLiveMatches = [...allLiveMatches, ...footballLiveMatches];
      }

      // Fetch local live matches
      let localLiveMatches: LiveMatch[] = [];
      try {
        const localLiveRes = await fetch(
          `${base}/api/v1/cricket/local/matches?status=live&limit=10`,
          {
            cache: 'no-store',
            next: { revalidate: 30 },
          }
        );
        if (localLiveRes.ok) {
          const localData = await localLiveRes.json();
          if (localData.success && Array.isArray(localData.data)) {
            localLiveMatches = localData.data.map((localMatch: any) => ({
              _id: localMatch._id || localMatch.matchId,
              matchId: localMatch.matchId,
              teams: {
                home: {
                  name: localMatch.teams.home.name,
                  shortName: localMatch.teams.home.shortName,
                  flag: localMatch.teams.home.flag || '',
                },
                away: {
                  name: localMatch.teams.away.name,
                  shortName: localMatch.teams.away.shortName,
                  flag: localMatch.teams.away.flag || '',
                },
              },
              venue: {
                name: localMatch.venue.name,
                city: localMatch.venue.city,
              },
              status: localMatch.status as 'live' | 'completed' | 'upcoming',
              startTime:
                typeof localMatch.startTime === 'string'
                  ? localMatch.startTime
                  : new Date(localMatch.startTime).toISOString(),
              currentScore: localMatch.currentScore,
              format: localMatch.format,
              series: localMatch.series,
              isLocalMatch: true,
              matchType: localMatch.matchType,
              scorerInfo: localMatch.scorerInfo,
              isVerified: localMatch.isVerified,
            }));
          }
        }
      } catch (localError) {
        logger.error('Failed to fetch local live matches', localError, 'HeroSection');
      }

      // Add local live matches
      allLiveMatches = [...allLiveMatches, ...localLiveMatches];

      // Sort live matches: live first, then by start time
      if (allLiveMatches.length > 0) {
        allLiveMatches.sort((a, b) => {
          if (a.status === 'live' && b.status !== 'live') return -1;
          if (a.status !== 'live' && b.status === 'live') return 1;
          return 0;
        });
      }

      // If we have less than 4 matches, fill remaining slots with completed matches
      // Only fetch completed matches if we don't have enough live matches
      const maxMatches = 4;
      const remainingSlots = maxMatches - allLiveMatches.length;

      if (remainingSlots > 0) {
        // Fetch completed matches to fill empty slots (cache for 10 minutes - they don't change)
        try {
          const [cricketCompletedRes, footballCompletedRes] = await Promise.allSettled([
            fetch(`${base}/api/v1/cricket/matches/results?limit=${remainingSlots}`, {
              next: { revalidate: 600 }, // Cache for 10 minutes
            }),
            fetch(`${base}/api/v1/football/matches/results?limit=${remainingSlots}`, {
              next: { revalidate: 600 }, // Cache for 10 minutes
            }),
          ]);

          let completedMatches: LiveMatch[] = [];

          // Fetch cricket completed matches
          if (cricketCompletedRes.status === 'fulfilled' && cricketCompletedRes.value.ok) {
            const cricketData = await cricketCompletedRes.value.json();
            // Backend returns: { success: true, data: { matches: [], pagination: {} } }
            const cricketResults = Array.isArray(cricketData?.data?.matches)
              ? cricketData.data.matches
              : cricketData?.data?.matches || [];
            const cricketCompleted = cricketResults
              .filter((match: LiveMatch) => match.format && !match.league)
              .map((match: LiveMatch) => ({ ...match, status: 'completed' as const }));
            completedMatches = [...completedMatches, ...cricketCompleted];
          }

          // Fetch football completed matches
          if (footballCompletedRes.status === 'fulfilled' && footballCompletedRes.value.ok) {
            const footballData = await footballCompletedRes.value.json();
            const footballResults = Array.isArray(footballData?.data)
              ? footballData.data
              : footballData?.data?.results || [];
            const footballCompleted = footballResults
              .filter((match: LiveMatch) => match.league && !match.format)
              .map((match: LiveMatch) => ({ ...match, status: 'completed' as const }));
            completedMatches = [...completedMatches, ...footballCompleted];
          }

          // Fetch local completed matches
          let localCompletedMatches: LiveMatch[] = [];
          try {
            const localCompletedRes = await fetch(
              `${base}/api/v1/cricket/local/matches?status=completed&limit=${remainingSlots}`,
              {
                next: { revalidate: 600 },
              }
            );
            if (localCompletedRes.ok) {
              const localData = await localCompletedRes.json();
              if (localData.success && Array.isArray(localData.data)) {
                localCompletedMatches = localData.data.map((localMatch: any) => ({
                  _id: localMatch._id || localMatch.matchId,
                  matchId: localMatch.matchId,
                  teams: {
                    home: {
                      name: localMatch.teams.home.name,
                      shortName: localMatch.teams.home.shortName,
                      flag: localMatch.teams.home.flag || '',
                    },
                    away: {
                      name: localMatch.teams.away.name,
                      shortName: localMatch.teams.away.shortName,
                      flag: localMatch.teams.away.flag || '',
                    },
                  },
                  venue: {
                    name: localMatch.venue.name,
                    city: localMatch.venue.city,
                  },
                  status: 'completed' as const,
                  startTime:
                    typeof localMatch.startTime === 'string'
                      ? localMatch.startTime
                      : new Date(localMatch.startTime).toISOString(),
                  currentScore: localMatch.currentScore,
                  format: localMatch.format,
                  series: localMatch.series,
                  isLocalMatch: true,
                  matchType: localMatch.matchType,
                  scorerInfo: localMatch.scorerInfo,
                  isVerified: localMatch.isVerified,
                }));
              }
            }
          } catch (localError) {
            logger.error('Failed to fetch local completed matches', localError, 'HeroSection');
          }

          // localCompletedMatches is already transformed above
          const transformedLocalCompleted: LiveMatch[] = localCompletedMatches;

          completedMatches = [...completedMatches, ...transformedLocalCompleted];

          if (completedMatches.length > 0) {
            // Sort by start time (most recent first)
            completedMatches.sort((a, b) => {
              const dateA = new Date(a.startTime || 0).getTime();
              const dateB = new Date(b.startTime || 0).getTime();
              return dateB - dateA;
            });

            // Add completed matches to fill remaining slots
            const matchesToAdd = completedMatches.slice(0, remainingSlots);
            allLiveMatches = [...allLiveMatches, ...matchesToAdd];
          }
        } catch (resultsError) {
          logger.error('Failed to fetch completed matches', resultsError, 'HeroSection');
        }
      }

      // Set matches (max 4 total: live first, then completed)
      setLiveMatches(allLiveMatches.slice(0, maxMatches));
    } catch (error) {
      logger.error('Error fetching hero data', error, 'HeroSection');
      setLiveMatches([]);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchHeroData();

    // Auto-refresh every 60 seconds for live matches (increased interval to reduce API load)
    const interval = setInterval(() => {
      fetchHeroData();
    }, 60000); // Increased to 60s to reduce rate limiting issues

    return () => clearInterval(interval);
  }, [fetchHeroData]);

  const liveHighlights = liveMatches.slice(0, 4);
  const trendingArticles = secondaryArticles.slice(0, 4);
  const hasLiveMatches =
    liveHighlights.length > 0 && liveHighlights.some((m) => m.status === 'live');
  const hasCompletedMatches =
    liveHighlights.length > 0 && liveHighlights.some((m) => m.status === 'completed');
  const hasUpcomingMatches =
    liveHighlights.length > 0 && liveHighlights.some((m) => m.status === 'upcoming');
  const hasAnyMatches = liveHighlights.length > 0;

  // Only show real matches - no placeholders
  const matchesToRender = liveHighlights;

  // Update status indicators based on what we're showing
  const showingLiveMatches = hasLiveMatches;
  const showingCompletedMatches = hasCompletedMatches && !hasLiveMatches;
  const showingUpcomingMatches = hasUpcomingMatches && !hasLiveMatches && !hasCompletedMatches;

  return (
    <>
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-4 sm:py-8 lg:py-12">
        <div className="relative w-full max-w-[1400px] mx-auto px-0 sm:px-4 lg:px-8">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-10 top-10 h-56 w-56 rounded-full bg-primary-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          </div>

          <div className="glass-panel relative overflow-hidden w-full">
            <div className="absolute inset-0 opacity-60">
              <div className="absolute -top-32 right-0 h-64 w-64 rounded-full bg-primary-400/20 blur-3xl" />
              <div className="absolute bottom-0 left-[-10%] h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
            </div>

            <div className="relative space-y-6 sm:space-y-8 p-3 sm:p-6 lg:p-10">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-xl sm:rounded-2xl lg:rounded-[28px] bg-slate-950/50 p-3 sm:p-5 lg:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                    <span
                      className={`live-dot ${showingLiveMatches ? 'bg-red-500 animate-pulse' : showingCompletedMatches ? 'bg-gray-400' : showingUpcomingMatches ? 'bg-blue-400' : 'bg-primary-400'}`}
                    />
                    <span className="hidden sm:inline">
                      {showingLiveMatches
                        ? 'Live Matches'
                        : showingCompletedMatches
                          ? 'Recent Results'
                          : showingUpcomingMatches
                            ? 'Upcoming Matches'
                            : hasAnyMatches
                              ? 'Matches'
                              : 'Live Cricket Scores'}
                    </span>
                    <span className="sm:hidden">
                      {showingLiveMatches
                        ? 'Live'
                        : showingCompletedMatches
                          ? 'Results'
                          : showingUpcomingMatches
                            ? 'Upcoming'
                            : hasAnyMatches
                              ? 'Matches'
                              : 'Scores'}
                    </span>
                  </div>
                  <Link
                    href={showingCompletedMatches ? '/cricket/results' : '/fixtures'}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-white/80 transition-standard hover:text-white"
                  >
                    <span className="hidden sm:inline">
                      {showingLiveMatches
                        ? 'View schedule'
                        : showingCompletedMatches
                          ? 'View all results'
                          : showingUpcomingMatches
                            ? 'See full calendar'
                            : hasAnyMatches
                              ? 'See full calendar'
                              : 'Browse fixtures'}
                    </span>
                    <span className="sm:hidden">View</span>
                    <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </div>

                {/* Always show matches - use demo if no real matches */}
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {matchesToRender.map((match, index) => {
                    const isLive = match.status === 'live';
                    const isFootball = !!match.league && !match.format;
                    const current = match.currentScore;

                    // Determine the correct link based on match status
                    const getMatchLink = () => {
                      // Demo matches don't have real IDs
                      if (match._id.startsWith('demo')) {
                        return '/fixtures';
                      }

                      // Live matches - link to match detail
                      if (isLive) {
                        return isFootball
                          ? `/football/match/${match.matchId}`
                          : `/cricket/match/${match.matchId}`;
                      }

                      // Completed matches - link to match detail
                      if (match.status === 'completed' && match.matchId) {
                        return isFootball
                          ? `/football/match/${match.matchId}`
                          : `/cricket/match/${match.matchId}`;
                      }

                      // Upcoming matches or others - link to fixtures
                      return '/fixtures';
                    };

                    return (
                      <Link
                        key={match._id}
                        href={getMatchLink()}
                        className="group relative rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] p-3 sm:p-4 lg:p-5 transition-all duration-300 hover:border hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-primary-500/10 overflow-hidden min-w-0"
                      >
                        {/* Status indicator badge */}
                        <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-10">
                          {isLive && (
                            <div className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-red-500 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-lg">
                              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex h-full w-full rounded-full bg-red-500"></span>
                              </span>
                              <span className="hidden sm:inline">LIVE</span>
                              <span className="sm:hidden">LIVE</span>
                            </div>
                          )}
                          {match.status === 'completed' && !isLive && (
                            <div className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-gray-600 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-lg">
                              <span className="hidden sm:inline">COMPLETED</span>
                              <span className="sm:hidden">DONE</span>
                            </div>
                          )}
                          {/* Community Match Badge */}
                          {(match as any).isLocalMatch && (
                            <div className="scale-90 origin-top-right">
                              <CommunityMatchBadge match={match as any as CricketMatch} compact />
                            </div>
                          )}
                        </div>

                        {/* Match format/tournament */}
                        <div className="flex items-center justify-between text-xs font-medium text-white/60 mb-2 sm:mb-3 gap-2">
                          <span className="uppercase tracking-wider truncate">
                            {match.format || match.league || 'Match'}
                          </span>
                        </div>

                        {/* Teams and scores */}
                        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                          {(['home', 'away'] as Array<'home' | 'away'>).map((side, teamIndex) => {
                            const team = match.teams[side];
                            const teamScore = current ? current[side] : undefined;
                            const isFootball = !!match.league && !match.format;

                            // Determine score display
                            let scoreDisplay = '—';
                            let oversDisplay = '';
                            const isCompleted = match.status === 'completed';
                            const isUpcoming = match.status === 'upcoming';

                            if (isLive && teamScore) {
                              if (isFootball) {
                                scoreDisplay = teamScore.runs?.toString() || '0';
                              } else {
                                scoreDisplay = `${teamScore.runs}/${teamScore.wickets}`;
                                if (teamScore.overs > 0) {
                                  oversDisplay = `${teamScore.overs.toFixed(1)} ov`;
                                }
                              }
                            } else if (isCompleted && teamScore) {
                              // For completed matches, show final score
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
                            } else if (isUpcoming) {
                              scoreDisplay = '—';
                              oversDisplay = 'TBD';
                            }

                            // Determine if this team is batting (for cricket) - only for live matches
                            const isBatting =
                              isLive && !isFootball && teamScore && teamScore.overs > 0;

                            return (
                              <div
                                key={side}
                                className={`flex items-center justify-between gap-2 sm:gap-3 rounded-lg p-2 sm:p-2.5 transition-colors ${
                                  isBatting ? 'bg-primary-500/10 border border-primary-500/10' : ''
                                }`}
                              >
                                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                                  <span className="text-xl sm:text-2xl flex-shrink-0">
                                    {team.flag && team.flag !== '🏏' ? team.flag : ''}
                                  </span>
                                  <div className="min-w-0 flex-1 overflow-hidden">
                                    <p className="text-xs sm:text-sm font-bold text-white truncate">
                                      {team.shortName}
                                    </p>
                                    {team.name !== team.shortName && (
                                      <p className="text-[10px] sm:text-xs text-white/60 truncate hidden sm:block">
                                        {team.name}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p
                                    className={`text-lg sm:text-xl font-bold ${isBatting ? 'text-primary-300' : 'text-white'}`}
                                  >
                                    {scoreDisplay}
                                  </p>
                                  {oversDisplay && (
                                    <p className="text-[10px] sm:text-xs text-white/60 mt-0.5">
                                      {oversDisplay}
                                    </p>
                                  )}
                                  {isLive && isFootball && (
                                    <p className="text-[10px] sm:text-xs text-red-400 font-semibold mt-0.5">
                                      Live
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Match status or action */}
                        <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-white/5">
                          <div className="flex items-center justify-between gap-2">
                            {isLive ? (
                              <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold text-primary-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse"></span>
                                <span className="hidden sm:inline">Live Score</span>
                                <span className="sm:hidden">Live</span>
                              </span>
                            ) : match.status === 'completed' ? (
                              <span className="text-[10px] sm:text-xs font-semibold text-white/60">
                                Match Ended
                              </span>
                            ) : (
                              <span className="text-[10px] sm:text-xs font-semibold text-white/60">
                                Upcoming
                              </span>
                            )}
                            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white/40 group-hover:text-primary-300 group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {(featuredArticle || trendingArticles.length > 0) && (
        <section className="section-padding bg-white">
          <Container size="2xl">
            <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-xl border border-gray-200 bg-white shadow-lg"
              >
                {featuredArticle ? (
                  <Link
                    href={`/${featuredArticle.slug}`}
                    className="group block overflow-hidden rounded-xl"
                  >
                    <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px] overflow-hidden bg-gray-100">
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
                    </div>
                    <div className="p-6 sm:p-8 lg:p-10">
                      <div className="space-y-3 sm:space-y-4">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-gray-900 group-hover:text-primary-600 transition-colors">
                          {featuredArticle.title}
                        </h2>
                        {featuredArticle.summary && (
                          <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed line-clamp-3">
                            {featuredArticle.summary}
                          </p>
                        )}
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
                className="space-y-6 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600">
                      Newsroom
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900">Trending now</h3>
                  </div>
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-standard hover:text-primary-700"
                  >
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
                          <h4 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-700">
                            {article.title}
                          </h4>
                          {article.summary && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                              {article.summary}
                            </p>
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
