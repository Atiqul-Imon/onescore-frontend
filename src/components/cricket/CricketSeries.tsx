'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, TrendingUp, Star } from 'lucide-react';
import { Container } from '@/components/ui';

interface CricketSeries {
  id: string;
  name: string;
  type: 'test' | 'odi' | 't20i' | 't20' | 'world-cup' | 'championship';
  status: 'ongoing' | 'upcoming' | 'completed';
  detailUrl?: string;
  startDate: string;
  endDate: string;
  teams: Array<{
    name: string;
    flag: string;
    shortName: string;
  }>;
  matches: {
    total: number;
    completed: number;
    remaining: number;
  };
  currentStandings?: Array<{
    team: string;
    flag: string;
    points: number;
    played: number;
    won: number;
    lost: number;
    netRunRate: number;
  }>;
  prize: string;
  description: string;
}

export function CricketSeries() {
  const [series, setSeries] = useState<CricketSeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - will be replaced with real API calls
    const mockSeries: CricketSeries[] = [
      {
        id: '1',
        name: 'ICC World Test Championship',
        type: 'championship',
        status: 'ongoing',
        detailUrl: '/cricket/leagues/world-test-championship',
        startDate: '2023-06-01',
        endDate: '2025-06-30',
        teams: [
          { name: 'India', flag: '🇮🇳', shortName: 'IND' },
          { name: 'Australia', flag: '🇦🇺', shortName: 'AUS' },
          { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', shortName: 'ENG' },
          { name: 'South Africa', flag: '🇿🇦', shortName: 'SA' },
        ],
        matches: { total: 24, completed: 18, remaining: 6 },
        currentStandings: [
          { team: 'India', flag: '🇮🇳', points: 72, played: 12, won: 8, lost: 2, netRunRate: 1.2 },
          {
            team: 'Australia',
            flag: '🇦🇺',
            points: 68,
            played: 12,
            won: 7,
            lost: 3,
            netRunRate: 0.8,
          },
          { team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', points: 64, played: 12, won: 6, lost: 4, netRunRate: 0.5 },
          {
            team: 'South Africa',
            flag: '🇿🇦',
            points: 60,
            played: 12,
            won: 6,
            lost: 4,
            netRunRate: 0.3,
          },
        ],
        prize: 'Test Championship Trophy',
        description: 'The ultimate test of cricket excellence',
      },
      {
        id: '2',
        name: 'Pakistan Super League',
        type: 't20',
        status: 'ongoing',
        detailUrl: '/cricket/leagues/psl',
        startDate: '2024-01-15',
        endDate: '2024-03-15',
        teams: [
          { name: 'Karachi Kings', flag: '', shortName: 'KK' },
          { name: 'Lahore Qalandars', flag: '', shortName: 'LQ' },
          { name: 'Islamabad United', flag: '', shortName: 'IU' },
          { name: 'Peshawar Zalmi', flag: '', shortName: 'PZ' },
        ],
        matches: { total: 34, completed: 12, remaining: 22 },
        currentStandings: [
          {
            team: 'Lahore Qalandars',
            flag: '',
            points: 16,
            played: 8,
            won: 5,
            lost: 2,
            netRunRate: 0.8,
          },
          {
            team: 'Karachi Kings',
            flag: '',
            points: 14,
            played: 8,
            won: 4,
            lost: 3,
            netRunRate: 0.5,
          },
          {
            team: 'Islamabad United',
            flag: '',
            points: 12,
            played: 8,
            won: 3,
            lost: 4,
            netRunRate: -0.2,
          },
          {
            team: 'Peshawar Zalmi',
            flag: '',
            points: 10,
            played: 8,
            won: 2,
            lost: 5,
            netRunRate: -0.8,
          },
        ],
        prize: 'PSL Trophy',
        description: "Pakistan's premier T20 league",
      },
      {
        id: '3',
        name: 'Big Bash League',
        type: 't20',
        status: 'ongoing',
        detailUrl: '/cricket/leagues/bbl',
        startDate: '2023-12-15',
        endDate: '2024-02-15',
        teams: [
          { name: 'Sydney Sixers', flag: '🇦🇺', shortName: 'SYS' },
          { name: 'Melbourne Stars', flag: '🇦🇺', shortName: 'MLS' },
          { name: 'Perth Scorchers', flag: '🇦🇺', shortName: 'PER' },
          { name: 'Brisbane Heat', flag: '🇦🇺', shortName: 'BH' },
        ],
        matches: { total: 56, completed: 28, remaining: 28 },
        currentStandings: [
          {
            team: 'Perth Scorchers',
            flag: '🇦🇺',
            points: 20,
            played: 14,
            won: 10,
            lost: 3,
            netRunRate: 1.1,
          },
          {
            team: 'Sydney Sixers',
            flag: '🇦🇺',
            points: 18,
            played: 14,
            won: 9,
            lost: 4,
            netRunRate: 0.8,
          },
          {
            team: 'Melbourne Stars',
            flag: '🇦🇺',
            points: 14,
            played: 14,
            won: 7,
            lost: 6,
            netRunRate: 0.2,
          },
          {
            team: 'Brisbane Heat',
            flag: '🇦🇺',
            points: 12,
            played: 14,
            won: 6,
            lost: 7,
            netRunRate: -0.3,
          },
        ],
        prize: 'BBL Trophy',
        description: "Australia's premier T20 competition",
      },
    ];

    setTimeout(() => {
      setSeries(mockSeries);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-gray-50">
        <Container size="2xl">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
            <p className="mt-4 text-gray-600">Loading cricket series...</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gray-50">
      <Container size="2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="eyebrow mx-auto w-max gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-primary-600" />
            Series Tracker
          </div>
          <h2 className="heading-2 mt-5">Cricket Series & Tournaments</h2>
          <p className="section-lede mt-3 text-gray-600">
            Follow the biggest competitions on every continent with live ladders, fixtures, and
            trophy stakes.
          </p>
        </motion.div>

        <div className="card-grid-3">
          {series.map((seriesItem, index) => (
            <motion.div
              key={seriesItem.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Series Header */}
              <div className="p-6 bg-gradient-to-r from-green-500 to-primary-600 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-6 h-6" />
                    <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
                      {seriesItem.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm font-medium">Ongoing</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{seriesItem.name}</h3>
                <p className="text-green-100 text-sm">{seriesItem.description}</p>
              </div>

              {/* Series Info */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {seriesItem.matches.total}
                    </div>
                    <div className="text-sm text-gray-500">Total Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {seriesItem.matches.completed}
                    </div>
                    <div className="text-sm text-gray-500">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {seriesItem.matches.remaining}
                    </div>
                    <div className="text-sm text-gray-500">Remaining</div>
                  </div>
                </div>

                {/* Current Standings */}
                {seriesItem.currentStandings && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Standings</h4>
                    <div className="space-y-2">
                      {seriesItem.currentStandings.slice(0, 4).map((team, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{team.flag}</span>
                            <span className="font-medium text-gray-900">{team.team}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{team.points}</div>
                            <div className="text-xs text-gray-500">{team.played} matches</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Teams */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Participating Teams</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {seriesItem.teams.map((team, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                      >
                        <span className="text-lg">{team.flag}</span>
                        <span className="text-sm font-medium text-gray-900">{team.shortName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prize */}
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Prize</span>
                  </div>
                  <span className="text-sm text-yellow-700">{seriesItem.prize}</span>
                </div>
              </div>

              {/* Series Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      {new Date(seriesItem.startDate).toLocaleDateString()} -{' '}
                      {new Date(seriesItem.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  {seriesItem.detailUrl ? (
                    <Link
                      href={seriesItem.detailUrl}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      View Details
                    </Link>
                  ) : (
                    <span className="text-gray-400 font-medium text-sm">Details Coming Soon</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {series.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Series</h3>
            <p className="text-gray-600">Check back later for upcoming cricket series!</p>
          </div>
        )}
      </Container>
    </section>
  );
}
