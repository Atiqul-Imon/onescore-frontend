'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Filter,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatTime, formatRelativeTime } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CompletedMatch {
  _id: string;
  matchId: string;
  name?: string;
  teams: {
    home: {
      name: string;
      shortName: string;
      flag: string;
    };
    away: {
      name: string;
      shortName: string;
      flag: string;
    };
  };
  venue: {
    name: string;
    city: string;
  };
  status: 'completed';
  format: string;
  series?: string;
  startTime: string;
  currentScore?: {
    home: {
      runs: number;
      wickets: number;
      overs: number;
    };
    away: {
      runs: number;
      wickets: number;
      overs: number;
    };
  };
  score?: {
    home: number;
    away: number;
  };
  matchNote?: string;
  result?: {
    winner: 'home' | 'away';
    winnerName: string;
    margin: number;
    marginType: 'runs' | 'wickets';
    resultText: string;
  };
}

export default function CompletedMatchesPage() {
  const [matches, setMatches] = useState<CompletedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [formatFilter, setFormatFilter] = useState<string>('');
  const limit = 20;

  const fetchMatches = async (pageNum: number = 1, format: string = '') => {
    try {
      setLoading(true);
      setError(null);

      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      // Format values are already lowercase in the formats array, but ensure lowercase for safety
      const formatParam = format ? `&format=${format.toLowerCase()}` : '';
      const response = await fetch(
        `${base}/api/v1/cricket/matches/results?page=${pageNum}&limit=${limit}${formatParam}`,
        {
          cache: 'no-store',
          next: { revalidate: 3600 }, // Cache for 1 hour
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch completed matches');
      }

      const json = await response.json();

      if (json.success && json.data) {
        const results = Array.isArray(json.data.results)
          ? json.data.results
          : json.data.results?.results || [];

        // Sort by format: T20, T20I, ODI, Test (in that order)
        const formatOrder: { [key: string]: number } = {
          T20: 1,
          t20: 1,
          T20I: 2,
          t20i: 2,
          ODI: 3,
          odi: 3,
          Test: 4,
          test: 4,
        };

        const sortedResults = results.sort((a: CompletedMatch, b: CompletedMatch) => {
          const formatA = formatOrder[a.format?.toLowerCase()] || 99;
          const formatB = formatOrder[b.format?.toLowerCase()] || 99;

          if (formatA !== formatB) {
            return formatA - formatB;
          }

          // If same format, sort by start time (most recent first)
          const dateA = new Date(a.startTime || 0).getTime();
          const dateB = new Date(b.startTime || 0).getTime();
          return dateB - dateA;
        });

        setMatches(sortedResults);
        setTotalPages(json.data.pagination?.pages || 1);
        setTotal(json.data.pagination?.total || 0);
      } else {
        setMatches([]);
      }
    } catch (err: any) {
      console.error('Error fetching completed matches:', err);
      setError(err.message || 'Failed to load completed matches');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(page, formatFilter);
  }, [page, formatFilter]);

  const handleFormatChange = (format: string) => {
    setFormatFilter(format);
    setPage(1); // Reset to first page when filter changes
  };

  const getWinner = (match: CompletedMatch) => {
    // Use stored result if available
    if (match.result) {
      return match.result.winner === 'home' ? match.teams.home : match.teams.away;
    }
    // Fallback calculation
    const homeScore = match.currentScore?.home?.runs || match.score?.home || 0;
    const awayScore = match.currentScore?.away?.runs || match.score?.away || 0;
    return homeScore > awayScore ? match.teams.home : match.teams.away;
  };

  const getMargin = (match: CompletedMatch) => {
    // Use stored result if available
    if (match.result && match.result.resultText) {
      // Extract margin from resultText (e.g., "New Zealand won by 50 runs" -> "50 runs")
      const marginMatch = match.result.resultText.match(/won by (.+)$/);
      return marginMatch ? marginMatch[1] : '';
    }

    // Fallback calculation (shouldn't happen if backend is working correctly)
    const homeScore = match.currentScore?.home?.runs || match.score?.home || 0;
    const awayScore = match.currentScore?.away?.runs || match.score?.away || 0;

    const winnerScore = homeScore > awayScore ? match.currentScore?.home : match.currentScore?.away;
    const loserScore = homeScore > awayScore ? match.currentScore?.away : match.currentScore?.home;

    if (!winnerScore || !loserScore) return '';

    const margin = Math.abs(homeScore - awayScore);
    const winnerWickets = winnerScore.wickets ?? 10; // Default to 10 if undefined (all out)

    // Key logic: If winner has wickets remaining (< 10), they won by wickets (chasing team won)
    // If winner lost all wickets (>= 10), they won by runs (team batting first won)
    if (winnerWickets < 10) {
      // Winner still has wickets remaining = they were chasing and won by wickets
      const wicketsRemaining = 10 - winnerWickets;
      return `${wicketsRemaining} wicket${wicketsRemaining !== 1 ? 's' : ''}`;
    } else {
      // Winner lost all wickets = they were batting first and won by runs
      return `${margin} runs`;
    }
  };

  const formats = [
    { value: '', label: 'All Formats' },
    { value: 't20i', label: 'T20I' },
    { value: 'odi', label: 'ODI' },
    { value: 'test', label: 'Test' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Container size="2xl" className="py-6 sm:py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary-400" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Completed Matches</h1>
            </div>
            <p className="text-white/70 text-sm sm:text-base">
              Browse through all completed cricket matches with detailed scorecards and statistics
            </p>
          </motion.div>
        </Container>
      </div>

      {/* Main Content */}
      <Container size="2xl" className="py-6 sm:py-8">
        {/* Filters */}
        <div className="mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  Filter by Format:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {formats.map((format) => (
                  <Button
                    key={format.value}
                    variant={formatFilter === format.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleFormatChange(format.value)}
                    className="text-xs sm:text-sm"
                  >
                    {format.label}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-600">
            Showing {matches.length} of {total} completed matches
            {formatFilter && ` (${formatFilter})`}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-8 text-center">
            <div className="text-red-600 mb-2">Error loading matches</div>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button onClick={() => fetchMatches(page, formatFilter)}>Try Again</Button>
          </Card>
        )}

        {/* Matches List */}
        {!loading && !error && matches.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            {matches.map((match, index) => {
              const winner = getWinner(match);
              const margin = getMargin(match);
              const homeScore = match.currentScore?.home?.runs || match.score?.home || 0;
              const awayScore = match.currentScore?.away?.runs || match.score?.away || 0;

              return (
                <motion.div
                  key={match.matchId || match._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link href={`/cricket/match/${match.matchId}`}>
                    <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary-300 overflow-hidden cursor-pointer">
                      <div className="p-4 sm:p-6">
                        {/* Match Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Trophy className="h-4 w-4 text-primary-600 flex-shrink-0" />
                              <span className="text-xs sm:text-sm font-semibold text-primary-700 uppercase truncate">
                                {match.series || 'Cricket Match'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                              <span className="px-2 py-1 rounded bg-gray-100 font-medium">
                                {match.format?.toUpperCase() || 'MATCH'}
                              </span>
                              <span>•</span>
                              <span className="truncate">
                                {match.venue.name}, {match.venue.city}
                              </span>
                            </div>
                          </div>
                          <div className="text-right text-xs sm:text-sm text-gray-500 flex-shrink-0">
                            <div className="hidden sm:block">{formatTime(match.startTime)}</div>
                            <div className="text-xs text-gray-400">
                              {formatRelativeTime(match.startTime)}
                            </div>
                          </div>
                        </div>

                        {/* Teams and Scores */}
                        <div className="space-y-3 sm:space-y-4">
                          {/* Home Team */}
                          <div
                            className={`flex items-center justify-between p-3 sm:p-4 rounded-lg ${
                              winner.name === match.teams.home.name
                                ? 'bg-green-50 border-2 border-green-200'
                                : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                              <span className="text-xl sm:text-2xl flex-shrink-0">
                                {match.teams.home.flag}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm sm:text-base text-gray-900 truncate">
                                    {match.teams.home.name}
                                  </span>
                                  {winner.name === match.teams.home.name && (
                                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                                  )}
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600">
                                  {match.teams.home.shortName}
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                                {homeScore}
                                {match.currentScore?.home?.wickets !== undefined && (
                                  <span className="text-lg sm:text-xl text-gray-600 font-normal">
                                    /{match.currentScore.home.wickets}
                                  </span>
                                )}
                              </div>
                              {match.currentScore?.home?.overs !== undefined &&
                                match.currentScore.home.overs > 0 && (
                                  <div className="text-xs sm:text-sm text-gray-600">
                                    ({match.currentScore.home.overs} ov)
                                  </div>
                                )}
                            </div>
                          </div>

                          {/* Away Team */}
                          <div
                            className={`flex items-center justify-between p-3 sm:p-4 rounded-lg ${
                              winner.name === match.teams.away.name
                                ? 'bg-green-50 border-2 border-green-200'
                                : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                              <span className="text-xl sm:text-2xl flex-shrink-0">
                                {match.teams.away.flag}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm sm:text-base text-gray-900 truncate">
                                    {match.teams.away.name}
                                  </span>
                                  {winner.name === match.teams.away.name && (
                                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                                  )}
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600">
                                  {match.teams.away.shortName}
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                                {awayScore}
                                {match.currentScore?.away?.wickets !== undefined && (
                                  <span className="text-lg sm:text-xl text-gray-600 font-normal">
                                    /{match.currentScore.away.wickets}
                                  </span>
                                )}
                              </div>
                              {match.currentScore?.away?.overs !== undefined &&
                                match.currentScore.away.overs > 0 && (
                                  <div className="text-xs sm:text-sm text-gray-600">
                                    ({match.currentScore.away.overs} ov)
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                        {/* Result Summary */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="text-sm sm:text-base font-semibold text-gray-900">
                              <span className="text-green-700">{winner.name}</span>
                              <span className="text-gray-600"> won by </span>
                              <span className="text-primary-700">{margin}</span>
                            </div>
                            <span className="text-xs sm:text-sm text-primary-600 font-medium hover:text-primary-700">
                              View Details →
                            </span>
                          </div>
                          {match.matchNote && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-2">
                              {match.matchNote}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && matches.length === 0 && (
          <Card className="p-12 text-center">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Completed Matches Found</h3>
            <p className="text-gray-600 mb-4">
              {formatFilter
                ? `No completed ${formatFilter} matches found. Try a different filter.`
                : 'No completed matches available at the moment.'}
            </p>
            {formatFilter && (
              <Button variant="outline" onClick={() => handleFormatChange('')}>
                Clear Filter
              </Button>
            )}
          </Card>
        )}

        {/* Pagination */}
        {!loading && !error && matches.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
