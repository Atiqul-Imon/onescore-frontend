'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Trophy, TrendingUp } from 'lucide-react';
import { LoadingSpinner, LoadingMatchCard } from '@/components/ui/LoadingSpinner';
import { Container, Button, Card } from '@/components/ui';
import { formatTime, formatRelativeTime } from '@/lib/utils';

interface Match {
  _id: string;
  matchId: string;
  detailUrl?: string;
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
  status: 'live' | 'completed' | 'upcoming';
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
  format?: string;
  league?: string;
}

export function LiveMatchesSection() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLiveMatches();
  }, []);

  const fetchLiveMatches = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API calls
      const mockMatches: Match[] = [
        {
          _id: '1',
          matchId: 'cricket-1',
          detailUrl: '/cricket/leagues/world-test-championship',
          teams: {
            home: {
              name: 'India',
              shortName: 'IND',
              flag: '🇮🇳'
            },
            away: {
              name: 'Australia',
              shortName: 'AUS',
              flag: '🇦🇺'
            }
          },
          venue: {
            name: 'Melbourne Cricket Ground',
            city: 'Melbourne'
          },
          status: 'live',
          startTime: new Date().toISOString(),
          currentScore: {
            home: { runs: 245, wickets: 3, overs: 45.2 },
            away: { runs: 198, wickets: 7, overs: 40.0 }
          },
          format: 'ODI'
        },
        {
          _id: '2',
          matchId: 'football-1',
          detailUrl: '/football/leagues/premier-league',
          teams: {
            home: {
              name: 'Manchester United',
              shortName: 'MUN',
              flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
            },
            away: {
              name: 'Liverpool',
              shortName: 'LIV',
              flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
            }
          },
          venue: {
            name: 'Old Trafford',
            city: 'Manchester'
          },
          status: 'live',
          startTime: new Date().toISOString(),
          score: { home: 2, away: 1 },
          league: 'Premier League'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMatches(mockMatches);
    } catch (err) {
      setError('Failed to fetch live matches');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section-padding bg-gray-100">
        <Container>
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">
              Live Matches
            </h2>
            <p className="body-text-lg text-gray-600">
              Real-time scores and updates
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <LoadingMatchCard key={i} />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding bg-gray-100">
        <Container>
          <div className="text-center">
            <h2 className="heading-2 mb-4">
              Live Matches
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gray-100">
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-2 mb-4">
            Live Matches
          </h2>
          <p className="body-text-lg text-gray-600">
            Real-time scores and updates from around the world
          </p>
        </motion.div>

        {matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Live Matches
            </h3>
            <p className="text-gray-600">
              Check back later for live matches
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match, index) => (
              <motion.div
                key={match._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="interactive">
                  <div>
                  {/* Match Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {match.status === 'live' && (
                        <div className="live-indicator">
                          <div className="live-dot" />
                          LIVE
                        </div>
                      )}
                      {match.status === 'upcoming' && (
                        <span className="text-blue-600 font-medium">
                          Upcoming
                        </span>
                      )}
                      {match.status === 'completed' && (
                        <span className="text-gray-600 font-medium">
                          Completed
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTime(match.startTime)}
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="space-y-4">
                    {/* Home Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{match.teams.home.flag}</span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {match.teams.home.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {match.teams.home.shortName}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {match.currentScore ? (
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              {match.currentScore.home.runs}
                            </div>
                            <div className="text-sm text-gray-500">
                              {match.currentScore.home.wickets}/{match.currentScore.home.overs}
                            </div>
                          </div>
                        ) : match.score ? (
                          <div className="text-2xl font-bold text-gray-900">
                            {match.score.home}
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-900">
                            -
                          </div>
                        )}
                      </div>
                    </div>

                    {/* VS Divider */}
                    <div className="flex items-center justify-center">
                      <div className="w-full h-px bg-gray-200" />
                      <span className="px-3 text-gray-400 font-medium">VS</span>
                      <div className="w-full h-px bg-gray-200" />
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{match.teams.away.flag}</span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {match.teams.away.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {match.teams.away.shortName}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {match.currentScore ? (
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              {match.currentScore.away.runs}
                            </div>
                            <div className="text-sm text-gray-500">
                              {match.currentScore.away.wickets}/{match.currentScore.away.overs}
                            </div>
                          </div>
                        ) : match.score ? (
                          <div className="text-2xl font-bold text-gray-900">
                            {match.score.away}
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-900">
                            -
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        <span>{match.format || match.league}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{match.venue.name}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {match.venue.city}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4">
                    {match.detailUrl ? (
                      <Link href={match.detailUrl} className="block">
                        <Button fullWidth>
                          {match.status === 'live' ? 'Watch Live' : 'View Details'}
                        </Button>
                      </Link>
                    ) : (
                      <Button fullWidth disabled>
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {matches.length > 0 && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button variant="outline">
              View All Matches
            </Button>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
