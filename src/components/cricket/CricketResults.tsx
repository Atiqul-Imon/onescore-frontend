'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Trophy, Calendar, MapPin, Users } from 'lucide-react';
import { Container } from '@/components/ui';
import Link from 'next/link';

interface CricketResult {
  _id: string;
  matchId: string;
  series?: string;
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
  format: string;
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
  result?: {
    winner: 'home' | 'away';
    winnerName: string;
    margin: number;
    marginType: 'runs' | 'wickets';
    resultText: string;
  };
}

export function CricketResults() {
  const [results, setResults] = useState<CricketResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${base}/api/v1/cricket/matches/results?limit=8`, {
          cache: 'no-store',
          next: { revalidate: 600 }, // Cache for 10 minutes
        });

        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const json = await response.json();

        if (json.success && json.data) {
          // Backend returns: { success: true, data: { matches: [], pagination: {} } }
          const resultsData = Array.isArray(json.data.matches)
            ? json.data.matches
            : json.data?.matches || [];

          // Filter only cricket matches (not football)
          const cricketResults = resultsData
            .filter((match: any) => match.format && !match.league)
            .slice(0, 8); // Take only first 8

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

          cricketResults.sort((a: CricketResult, b: CricketResult) => {
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

          setResults(cricketResults);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Error fetching cricket results:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const filteredResults =
    selectedFormat === 'all'
      ? results
      : results.filter((result) => result.format?.toLowerCase() === selectedFormat.toLowerCase());

  const formatOptions = [
    { value: 'all', label: 'All Formats' },
    { value: 'test', label: 'Test' },
    { value: 'odi', label: 'ODI' },
    { value: 't20i', label: 'T20I' },
    { value: 't20', label: 'T20' },
  ];

  if (loading) {
    return (
      <section className="section-padding bg-gray-50">
        <Container size="2xl">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
            <p className="mt-4 text-gray-600">Loading recent results...</p>
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
            <CheckCircle className="h-3.5 w-3.5 text-primary-600" />
            Final Whistle
          </div>
          <h2 className="heading-2 mt-5">Recent Cricket Results</h2>
          <p className="section-lede mt-3 text-gray-600">
            Catch up on every completed fixture with concise summaries, scorecards, and award
            winners.
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
          {filteredResults.map((result, index) => {
            const homeScore = result.currentScore?.home?.runs || result.score?.home || 0;
            const awayScore = result.currentScore?.away?.runs || result.score?.away || 0;
            const winner = result.result?.winner === 'home' ? result.teams.home : result.teams.away;
            const margin = result.result?.resultText
              ? result.result.resultText.replace(/^.*won by /, '').replace(/\.$/, '')
              : '';

            return (
              <Link key={result._id || result.matchId} href={`/cricket/match/${result.matchId}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
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
                      {result.series || 'Cricket Match'}
                    </h3>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>
                        {result.venue.name}, {result.venue.city}
                      </span>
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
                          <div className="text-2xl font-bold text-gray-900">{homeScore}</div>
                          {result.currentScore?.home?.wickets !== undefined && (
                            <div className="text-sm text-gray-500">
                              {result.currentScore.home.wickets}/
                              {result.currentScore.home.overs?.toFixed(1) || 0}
                            </div>
                          )}
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
                          <div className="text-2xl font-bold text-gray-900">{awayScore}</div>
                          {result.currentScore?.away?.wickets !== undefined && (
                            <div className="text-sm text-gray-500">
                              {result.currentScore.away.wickets}/
                              {result.currentScore.away.overs?.toFixed(1) || 0}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Result */}
                    {result.result && (
                      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Trophy className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-green-800">Winner</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-900">
                              {result.result.winnerName}
                            </div>
                            {margin && (
                              <div className="text-sm text-green-700">Won by {margin}</div>
                            )}
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
                        <span>{new Date(result.startTime).toLocaleDateString()}</span>
                      </div>
                      <span className="text-green-600 hover:text-green-700 font-medium">
                        View Details →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {filteredResults.length === 0 && (
          <div className="surface-panel text-center p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <CheckCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="heading-4 mb-2">No Recent Results</h3>
            <p className="body-text text-gray-600">Check back later for the latest scorecards.</p>
          </div>
        )}
      </Container>
    </section>
  );
}
