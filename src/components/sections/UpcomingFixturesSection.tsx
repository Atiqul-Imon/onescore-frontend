'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import { Container, Button, Card } from '@/components/ui';
import { formatDate, formatTime } from '@/lib/utils';

interface Fixture {
  _id: string;
  matchId: string;
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
  startTime: string;
  format?: string;
  league?: string;
  series?: string;
}

export function UpcomingFixturesSection() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    fetchFixtures();
  }, []);

  const fetchFixtures = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockFixtures: Fixture[] = [
        {
          _id: '1',
          matchId: 'cricket-1',
          teams: {
            home: {
              name: 'India',
              shortName: 'IND',
              flag: '🇮🇳'
            },
            away: {
              name: 'Pakistan',
              shortName: 'PAK',
              flag: '🇵🇰'
            }
          },
          venue: {
            name: 'Melbourne Cricket Ground',
            city: 'Melbourne',
            country: 'Australia'
          },
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          format: 'T20I',
          series: 'T20 World Cup'
        },
        {
          _id: '2',
          matchId: 'football-1',
          teams: {
            home: {
              name: 'Real Madrid',
              shortName: 'RMA',
              flag: '🇪🇸'
            },
            away: {
              name: 'Barcelona',
              shortName: 'BAR',
              flag: '🇪🇸'
            }
          },
          venue: {
            name: 'Santiago Bernabéu',
            city: 'Madrid',
            country: 'Spain'
          },
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          league: 'La Liga'
        },
        {
          _id: '3',
          matchId: 'cricket-2',
          teams: {
            home: {
              name: 'England',
              shortName: 'ENG',
              flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
            },
            away: {
              name: 'Australia',
              shortName: 'AUS',
              flag: '🇦🇺'
            }
          },
          venue: {
            name: 'Lord\'s Cricket Ground',
            city: 'London',
            country: 'England'
          },
          startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          format: 'Test',
          series: 'Ashes'
        }
      ];
      
      setFixtures(mockFixtures);
    } catch (error) {
      console.error('Error fetching fixtures:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFixtures = fixtures.filter(fixture => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'cricket') return fixture.format;
    if (selectedFilter === 'football') return fixture.league;
    return true;
  });

  const filters = [
    { id: 'all', label: 'All Sports' },
    { id: 'cricket', label: 'Cricket' },
    { id: 'football', label: 'Football' }
  ];

  if (loading) {
    return (
      <section className="section-padding bg-gray-100">
        <Container>
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">
              Upcoming Fixtures
            </h2>
            <p className="body-text-lg text-gray-600">
              Don't miss any action
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4" />
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
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
            Upcoming Fixtures
          </h2>
          <p className="body-text-lg text-gray-600">
            Don't miss any action - mark your calendar
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-6 py-2 rounded-full font-medium transition-standard ${
                selectedFilter === filter.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {filteredFixtures.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Upcoming Fixtures
            </h3>
            <p className="text-gray-600">
              Check back later for upcoming matches
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFixtures.map((fixture, index) => (
              <motion.div
                key={fixture._id}
                className="hover:-translate-y-1 transition-standard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="interactive">
                  <div>
                  {/* Match Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-medium text-sm">
                        Upcoming
                      </span>
                      {fixture.format && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {fixture.format}
                        </span>
                      )}
                      {fixture.league && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {fixture.league}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(fixture.startTime)}
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="space-y-4">
                    {/* Home Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{fixture.teams.home.flag}</span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {fixture.teams.home.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {fixture.teams.home.shortName}
                          </div>
                        </div>
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
                        <span className="text-2xl">{fixture.teams.away.flag}</span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {fixture.teams.away.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {fixture.teams.away.shortName}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(fixture.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{fixture.venue.name}, {fixture.venue.city}</span>
                    </div>
                    {fixture.series && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Trophy className="w-4 h-4" />
                        <span>{fixture.series}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-4">
                    <Button variant="outline" fullWidth>
                      Set Reminder
                    </Button>
                  </div>
                </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {filteredFixtures.length > 0 && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button variant="outline">
              View All Fixtures
            </Button>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
