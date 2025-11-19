'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Trophy, Calendar, MapPin, Users } from 'lucide-react';

interface CricketResult {
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
  endTime: string;
  result: {
    winner: string;
    margin: string;
    method: 'runs' | 'wickets' | 'innings' | 'super-over';
  };
  scores: {
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
  manOfTheMatch?: {
    name: string;
    team: string;
    performance: string;
  };
  highlights: string[];
}

export function CricketResults() {
  const [results, setResults] = useState<CricketResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  useEffect(() => {
    // Mock data - will be replaced with real API calls
    const mockResults: CricketResult[] = [
      {
        id: '1',
        series: 'ICC World Test Championship',
        teams: {
          home: { name: 'India', shortName: 'IND', flag: '🇮🇳' },
          away: { name: 'Australia', shortName: 'AUS', flag: '🇦🇺' }
        },
        venue: { name: 'Melbourne Cricket Ground', city: 'Melbourne', country: 'Australia' },
        format: 'test',
        startTime: '2024-01-10T10:30:00Z',
        endTime: '2024-01-14T16:00:00Z',
        result: {
          winner: 'India',
          margin: '8 wickets',
          method: 'wickets'
        },
        scores: {
          home: { runs: 245, wickets: 10, overs: 78.2 },
          away: { runs: 198, wickets: 10, overs: 65.1 }
        },
        manOfTheMatch: {
          name: 'Virat Kohli',
          team: 'India',
          performance: '89 runs, 2 wickets'
        },
        highlights: [
          'Virat Kohli scored a brilliant 89',
          'India won by 8 wickets',
          'Excellent bowling by Indian spinners'
        ]
      },
      {
        id: '2',
        series: 'Pakistan Super League',
        teams: {
          home: { name: 'Karachi Kings', shortName: 'KK', flag: '🏏' },
          away: { name: 'Lahore Qalandars', shortName: 'LQ', flag: '🏏' }
        },
        venue: { name: 'National Stadium', city: 'Karachi', country: 'Pakistan' },
        format: 't20',
        startTime: '2024-01-12T14:00:00Z',
        endTime: '2024-01-12T17:30:00Z',
        result: {
          winner: 'Lahore Qalandars',
          margin: '15 runs',
          method: 'runs'
        },
        scores: {
          home: { runs: 156, wickets: 8, overs: 20 },
          away: { runs: 171, wickets: 6, overs: 20 }
        },
        manOfTheMatch: {
          name: 'Babar Azam',
          team: 'Lahore Qalandars',
          performance: '67 runs off 45 balls'
        },
        highlights: [
          'Babar Azam\'s brilliant 67',
          'Lahore Qalandars won by 15 runs',
          'Exciting finish with close contest'
        ]
      },
      {
        id: '3',
        series: 'Big Bash League',
        teams: {
          home: { name: 'Sydney Sixers', shortName: 'SYS', flag: '🇦🇺' },
          away: { name: 'Melbourne Stars', shortName: 'MLS', flag: '🇦🇺' }
        },
        venue: { name: 'Sydney Cricket Ground', city: 'Sydney', country: 'Australia' },
        format: 't20',
        startTime: '2024-01-13T18:30:00Z',
        endTime: '2024-01-13T22:00:00Z',
        result: {
          winner: 'Sydney Sixers',
          margin: '5 wickets',
          method: 'wickets'
        },
        scores: {
          home: { runs: 145, wickets: 5, overs: 18.2 },
          away: { runs: 142, wickets: 8, overs: 20 }
        },
        manOfTheMatch: {
          name: 'Josh Philippe',
          team: 'Sydney Sixers',
          performance: '45 runs off 32 balls'
        },
        highlights: [
          'Josh Philippe\'s match-winning 45',
          'Sydney Sixers won by 5 wickets',
          'Great bowling performance'
        ]
      },
      {
        id: '4',
        series: 'India vs Australia ODI Series',
        teams: {
          home: { name: 'India', shortName: 'IND', flag: '🇮🇳' },
          away: { name: 'Australia', shortName: 'AUS', flag: '🇦🇺' }
        },
        venue: { name: 'Wankhede Stadium', city: 'Mumbai', country: 'India' },
        format: 'odi',
        startTime: '2024-01-14T14:30:00Z',
        endTime: '2024-01-14T22:00:00Z',
        result: {
          winner: 'Australia',
          margin: '3 wickets',
          method: 'wickets'
        },
        scores: {
          home: { runs: 289, wickets: 10, overs: 48.3 },
          away: { runs: 292, wickets: 7, overs: 49.1 }
        },
        manOfTheMatch: {
          name: 'Steve Smith',
          team: 'Australia',
          performance: '78 runs off 85 balls'
        },
        highlights: [
          'Steve Smith\'s crucial 78',
          'Australia won by 3 wickets',
          'Thrilling finish in the last over'
        ]
      }
    ];

    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredResults = selectedFormat === 'all' 
    ? results 
    : results.filter(result => result.format === selectedFormat);

  const formatOptions = [
    { value: 'all', label: 'All Formats' },
    { value: 'test', label: 'Test' },
    { value: 'odi', label: 'ODI' },
    { value: 't20i', label: 'T20I' },
    { value: 't20', label: 'T20' }
  ];

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading recent results...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recent Cricket Results
          </h2>
          <p className="text-lg text-gray-600">
            Catch up on the latest cricket action
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Result Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">COMPLETED</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {result.format.toUpperCase()}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {result.series}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{result.venue.name}, {result.venue.city}</span>
                </div>
              </div>

              {/* Teams and Scores */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Home Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{result.teams.home.flag}</span>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {result.teams.home.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.teams.home.shortName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {result.scores.home.runs}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.scores.home.wickets}/{result.scores.home.overs}
                      </div>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{result.teams.away.flag}</span>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {result.teams.away.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.teams.away.shortName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {result.scores.away.runs}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.scores.away.wickets}/{result.scores.away.overs}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Result */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Winner</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-900">{result.result.winner}</div>
                      <div className="text-sm text-green-700">
                        Won by {result.result.margin}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Man of the Match */}
                {result.manOfTheMatch && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">Man of the Match</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-yellow-900">{result.manOfTheMatch.name}</div>
                        <div className="text-sm text-yellow-700">
                          {result.manOfTheMatch.performance}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Result Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(result.endTime).toLocaleDateString()}</span>
                  </div>
                  <button className="text-green-600 hover:text-green-700 font-medium">
                    View Highlights
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Results</h3>
            <p className="text-gray-600">Check back later for cricket results!</p>
          </div>
        )}
      </div>
    </section>
  );
}
