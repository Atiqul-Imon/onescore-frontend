'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Users, MapPin, TrendingUp } from 'lucide-react';
import { Container } from '@/components/ui';

interface CricketMatch {
  id: string;
  series: string;
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
    country: string;
  };
  status: 'live' | 'completed' | 'upcoming';
  format: 'test' | 'odi' | 't20i' | 't20';
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
  liveData?: {
    currentOver: number;
    currentBatsman: string;
    currentBowler: string;
    lastBall: string;
    requiredRunRate?: number;
    currentRunRate?: number;
  };
}

export function LiveCricketMatches() {
  const [matches, setMatches] = useState<CricketMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - will be replaced with real API calls
    const mockMatches: CricketMatch[] = [
      {
        id: '1',
        series: 'ICC World Test Championship',
        detailUrl: '/cricket/leagues/world-test-championship',
        teams: {
          home: {
            name: 'India',
            shortName: 'IND',
            flag: '🇮🇳',
          },
          away: {
            name: 'Australia',
            shortName: 'AUS',
            flag: '🇦🇺',
          },
        },
        venue: {
          name: 'Melbourne Cricket Ground',
          city: 'Melbourne',
          country: 'Australia',
        },
        status: 'live',
        format: 'test',
        startTime: '2024-01-15T10:30:00Z',
        currentScore: {
          home: { runs: 245, wickets: 3, overs: 45.2 },
          away: { runs: 198, wickets: 5, overs: 42.1 },
        },
        liveData: {
          currentOver: 45.2,
          currentBatsman: 'Virat Kohli',
          currentBowler: 'Pat Cummins',
          lastBall: '4',
          currentRunRate: 5.4,
        },
      },
      {
        id: '2',
        series: 'Pakistan Super League',
        detailUrl: '/cricket/leagues/psl',
        teams: {
          home: {
            name: 'Karachi Kings',
            shortName: 'KK',
            flag: '',
          },
          away: {
            name: 'Lahore Qalandars',
            shortName: 'LQ',
            flag: '',
          },
        },
        venue: {
          name: 'National Stadium',
          city: 'Karachi',
          country: 'Pakistan',
        },
        status: 'live',
        format: 't20',
        startTime: '2024-01-15T14:00:00Z',
        currentScore: {
          home: { runs: 156, wickets: 2, overs: 18.3 },
          away: { runs: 142, wickets: 4, overs: 16.2 },
        },
        liveData: {
          currentOver: 18.3,
          currentBatsman: 'Babar Azam',
          currentBowler: 'Shaheen Afridi',
          lastBall: '1',
          currentRunRate: 8.5,
        },
      },
      {
        id: '3',
        series: 'Big Bash League',
        detailUrl: '/cricket/leagues/bbl',
        teams: {
          home: {
            name: 'Sydney Sixers',
            shortName: 'SYS',
            flag: '🇦🇺',
          },
          away: {
            name: 'Melbourne Stars',
            shortName: 'MLS',
            flag: '🇦🇺',
          },
        },
        venue: {
          name: 'Sydney Cricket Ground',
          city: 'Sydney',
          country: 'Australia',
        },
        status: 'live',
        format: 't20',
        startTime: '2024-01-15T18:30:00Z',
        currentScore: {
          home: { runs: 89, wickets: 1, overs: 12.4 },
          away: { runs: 0, wickets: 0, overs: 0 },
        },
        liveData: {
          currentOver: 12.4,
          currentBatsman: 'Josh Philippe',
          currentBowler: 'Glenn Maxwell',
          lastBall: '2',
          currentRunRate: 7.1,
        },
      },
    ];

    setTimeout(() => {
      setMatches(mockMatches);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <Container size="2xl">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
            <p className="mt-4 text-gray-600">Loading live matches...</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-padding bg-white">
      <Container size="2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="eyebrow mx-auto w-max gap-2">
            <Activity className="h-3.5 w-3.5 text-red-500" />
            Live Console
          </div>
          <h2 className="heading-2 mt-5">Live Cricket Matches</h2>
          <p className="section-lede mt-3 text-gray-600">
            Follow every wicket, partnership, and clutch spell with broadcast-grade data from our
            match center.
          </p>
        </motion.div>

        <div className="card-grid-3">
          {matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Match Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-red-600">LIVE</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {match.format.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{match.series}</h3>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>
                    {match.venue.name}, {match.venue.city}
                  </span>
                </div>
              </div>

              {/* Teams */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Home Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{match.teams.home.flag}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{match.teams.home.name}</div>
                        <div className="text-sm text-gray-500">{match.teams.home.shortName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {match.currentScore?.home.runs || 0}
                      </div>
                      <div className="text-sm text-gray-500">
                        {match.currentScore?.home.wickets || 0}/
                        {match.currentScore?.home.overs || 0}
                      </div>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{match.teams.away.flag}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{match.teams.away.name}</div>
                        <div className="text-sm text-gray-500">{match.teams.away.shortName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {match.currentScore?.away.runs || 0}
                      </div>
                      <div className="text-sm text-gray-500">
                        {match.currentScore?.away.wickets || 0}/
                        {match.currentScore?.away.overs || 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Data */}
                {match.liveData && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {match.liveData.currentBatsman} vs {match.liveData.currentBowler}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 font-medium">
                          RR: {match.liveData.currentRunRate}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Over {match.liveData.currentOver} • Last ball: {match.liveData.lastBall}
                    </div>
                  </div>
                )}
              </div>

              {/* Match Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Live Updates</span>
                  </div>
                  {match.detailUrl ? (
                    <Link
                      href={match.detailUrl}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      View Details
                    </Link>
                  ) : (
                    <span className="text-gray-400 font-medium">Details Coming Soon</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {matches.length === 0 && (
          <div className="surface-panel text-center p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Activity className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="heading-4 mb-2">No Live Matches</h3>
            <p className="body-text text-gray-600">Check back later for live cricket action.</p>
          </div>
        )}
      </Container>
    </section>
  );
}
