'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Trophy } from 'lucide-react';
import { Container } from '@/components/ui';

interface CricketFixture {
  id: string;
  series: string;
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
  format: 'test' | 'odi' | 't20i' | 't20';
  startTime: string;
  status: 'upcoming' | 'live' | 'completed';
  description: string;
  seriesType: 'test' | 'odi' | 't20i' | 't20' | 'world-cup' | 'championship';
}

export function CricketFixtures() {
  const [fixtures, setFixtures] = useState<CricketFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  useEffect(() => {
    // Mock data - will be replaced with real API calls
    const mockFixtures: CricketFixture[] = [
      {
        id: '1',
        series: 'ICC World Test Championship',
        teams: {
          home: { name: 'India', shortName: 'IND', flag: '🇮🇳' },
          away: { name: 'England', shortName: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
        },
        venue: { name: "Lord's Cricket Ground", city: 'London', country: 'England' },
        format: 'test',
        startTime: '2024-01-20T10:30:00Z',
        status: 'upcoming',
        description: '2nd Test Match',
        seriesType: 'championship',
      },
      {
        id: '2',
        series: 'Pakistan Super League',
        teams: {
          home: { name: 'Karachi Kings', shortName: 'KK', flag: '' },
          away: { name: 'Lahore Qalandars', shortName: 'LQ', flag: '' },
        },
        venue: { name: 'National Stadium', city: 'Karachi', country: 'Pakistan' },
        format: 't20',
        startTime: '2024-01-22T14:00:00Z',
        status: 'upcoming',
        description: 'Match 15',
        seriesType: 't20',
      },
      {
        id: '3',
        series: 'Big Bash League',
        teams: {
          home: { name: 'Sydney Sixers', shortName: 'SYS', flag: '🇦🇺' },
          away: { name: 'Melbourne Stars', shortName: 'MLS', flag: '🇦🇺' },
        },
        venue: { name: 'Sydney Cricket Ground', city: 'Sydney', country: 'Australia' },
        format: 't20',
        startTime: '2024-01-24T18:30:00Z',
        status: 'upcoming',
        description: 'Match 28',
        seriesType: 't20',
      },
      {
        id: '4',
        series: 'India vs Australia ODI Series',
        teams: {
          home: { name: 'India', shortName: 'IND', flag: '🇮🇳' },
          away: { name: 'Australia', shortName: 'AUS', flag: '🇦🇺' },
        },
        venue: { name: 'Wankhede Stadium', city: 'Mumbai', country: 'India' },
        format: 'odi',
        startTime: '2024-01-26T14:30:00Z',
        status: 'upcoming',
        description: '3rd ODI',
        seriesType: 'odi',
      },
      {
        id: '5',
        series: 'T20 World Cup',
        teams: {
          home: { name: 'West Indies', shortName: 'WI', flag: '🇯🇲' },
          away: { name: 'New Zealand', shortName: 'NZ', flag: '🇳🇿' },
        },
        venue: { name: 'Kensington Oval', city: 'Bridgetown', country: 'Barbados' },
        format: 't20i',
        startTime: '2024-01-28T20:00:00Z',
        status: 'upcoming',
        description: 'Group Stage Match',
        seriesType: 'world-cup',
      },
      {
        id: '6',
        series: 'County Championship',
        teams: {
          home: { name: 'Yorkshire', shortName: 'YOR', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
          away: { name: 'Lancashire', shortName: 'LAN', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
        },
        venue: { name: 'Headingley', city: 'Leeds', country: 'England' },
        format: 'test',
        startTime: '2024-01-30T11:00:00Z',
        status: 'upcoming',
        description: 'Division 1 Match',
        seriesType: 'test',
      },
    ];

    setTimeout(() => {
      setFixtures(mockFixtures);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredFixtures =
    selectedFormat === 'all'
      ? fixtures
      : fixtures.filter((fixture) => fixture.format === selectedFormat);

  const formatOptions = [
    { value: 'all', label: 'All Formats' },
    { value: 'test', label: 'Test' },
    { value: 'odi', label: 'ODI' },
    { value: 't20i', label: 'T20I' },
    { value: 't20', label: 'T20' },
  ];

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <Container size="2xl">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
            <p className="mt-4 text-gray-600">Loading upcoming fixtures...</p>
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
            <Calendar className="h-3.5 w-3.5 text-primary-600" />
            Fixture Radar
          </div>
          <h2 className="heading-2 mt-5">Upcoming Cricket Fixtures</h2>
          <p className="section-lede mt-3 text-gray-600">
            Build your watchlist with marquee matchups, refreshed every morning from our fixture
            engine.
          </p>
        </motion.div>

        {/* Format Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {formatOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedFormat(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFormat === option.value
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="card-grid-3">
          {filteredFixtures.map((fixture, index) => (
            <motion.div
              key={fixture.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Fixture Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      {fixture.seriesType.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {fixture.format.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{fixture.series}</h3>
                <p className="text-sm text-gray-600">{fixture.description}</p>
              </div>

              {/* Teams */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Home Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{fixture.teams.home.flag}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{fixture.teams.home.name}</div>
                        <div className="text-sm text-gray-500">{fixture.teams.home.shortName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Home</div>
                    </div>
                  </div>

                  <div className="text-center text-gray-400 font-medium">VS</div>

                  {/* Away Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{fixture.teams.away.flag}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{fixture.teams.away.name}</div>
                        <div className="text-sm text-gray-500">{fixture.teams.away.shortName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Away</div>
                    </div>
                  </div>
                </div>

                {/* Venue Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{fixture.venue.name}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {fixture.venue.city}, {fixture.venue.country}
                  </div>
                </div>
              </div>

              {/* Fixture Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{new Date(fixture.startTime).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(fixture.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="mt-2">
                  <button className="w-full text-green-600 hover:text-green-700 font-medium text-sm py-2">
                    Set Reminder
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredFixtures.length === 0 && (
          <div className="surface-panel text-center p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="heading-4 mb-2">No Upcoming Fixtures</h3>
            <p className="body-text text-gray-600">
              We’re refreshing the schedule. Check back soon for new match drops.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
