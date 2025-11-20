'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Clock, MapPin, Trophy } from 'lucide-react';
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

  const filterButtonClass = (id: string) =>
    `rounded-full border px-5 py-2 text-sm font-semibold transition-standard ${
      selectedFilter === id
        ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900'
    }`;

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <Container size="2xl">
          <div className="mb-12 text-center">
            <div className="eyebrow mx-auto w-max gap-2">
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              Fixture Radar
            </div>
            <h2 className="heading-2 mt-5">Upcoming Fixtures</h2>
            <p className="section-lede mt-3 text-gray-600">
              Building the slate of must-watch games for the week ahead.
            </p>
          </div>
          <div className="card-grid-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="surface-panel p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 rounded bg-gray-200" />
                  <div className="h-6 rounded bg-gray-200" />
                  <div className="h-4 rounded bg-gray-200" />
                  <div className="h-12 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Container size="2xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="eyebrow mx-auto w-max gap-2">
            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
            Fixture Radar
          </div>
          <h2 className="heading-2 mt-5 text-gray-900">Upcoming Fixtures</h2>
          <p className="section-lede mt-4 text-gray-600">
            Plan your viewing schedule with marquee matchups curated from cricket and football calendars.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          role="tablist"
          aria-label="Filter fixtures by sport"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={selectedFilter === filter.id}
              className={filterButtonClass(filter.id)}
              onClick={() => setSelectedFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {filteredFixtures.length === 0 ? (
          <div className="surface-panel text-center p-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="heading-4 mb-2">No upcoming fixtures</h3>
            <p className="body-text text-gray-600">
              We’re refreshing the schedule. Check back soon for new match drops.
            </p>
          </div>
        ) : (
          <div className="card-grid-3">
            {filteredFixtures.map((fixture, index) => (
              <motion.div
                key={fixture._id}
                className="transition-standard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="interactive" className="h-full rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-lg">
                  <div className="flex h-full flex-col gap-5">
                    <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {fixture.series || fixture.league || 'International'}
                      </span>
                      <span>{formatDate(fixture.startTime)}</span>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      {[fixture.teams.home, fixture.teams.away].map((team, idx) => (
                        <div
                          key={team.shortName}
                          className={`flex items-center justify-between ${idx === 0 ? 'pb-4 mb-4 border-b border-dashed border-gray-200' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{team.flag}</span>
                            <div>
                              <div className="font-semibold text-gray-900">{team.name}</div>
                              <div className="text-sm text-gray-500">{team.shortName}</div>
                            </div>
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                            {idx === 0 ? 'Home' : 'Away'}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-3 text-sm text-gray-600">
                      <div className="inline-flex items-center gap-2">
                        <Clock className="h-4 w-4 text-emerald-500" />
                        {formatTime(fixture.startTime)}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        {fixture.venue.name}, {fixture.venue.city}
                      </div>
                      {fixture.series && (
                        <div className="inline-flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-amber-500" />
                          {fixture.series}
                        </div>
                      )}
                    </div>

                    <div className="mt-auto">
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

        {filteredFixtures.length > 0 && (
          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button variant="outline" asChild>
              <Link href="/fixtures" className="inline-flex items-center gap-2">
                View All Fixtures
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
