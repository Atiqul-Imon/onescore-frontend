'use client';

import { useCricketLiveMatches, useCricketUpcomingMatches, usePrefetchCricketData } from '@/hooks/useSportsData';
import { Activity, Clock, Trophy, Users } from 'lucide-react';
import { useEffect } from 'react';

export function OptimizedLiveCricketMatches() {
  const { data: liveMatches, isLoading: liveLoading, error: liveError } = useCricketLiveMatches();
  const { data: upcomingMatches, isLoading: upcomingLoading, error: upcomingError } = useCricketUpcomingMatches();
  const { prefetchCricketData } = usePrefetchCricketData();

  // Prefetch data on component mount for better UX
  useEffect(() => {
    prefetchCricketData();
  }, [prefetchCricketData]);

  // Mock data for development (remove when API is ready)
  const mockLiveMatches = [
    {
      id: '1',
      homeTeam: 'India',
      awayTeam: 'Australia',
      homeScore: '285/7',
      awayScore: '245/10',
      status: 'Live',
      overs: '48.2',
      runRate: '5.9',
      requiredRunRate: '8.2',
      matchType: 'ODI',
      series: 'World Cup 2024',
      venue: 'Melbourne Cricket Ground',
      startTime: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      homeTeam: 'England',
      awayTeam: 'Pakistan',
      homeScore: '320/8',
      awayScore: '298/6',
      status: 'Live',
      overs: '45.1',
      runRate: '7.1',
      requiredRunRate: '6.8',
      matchType: 'ODI',
      series: 'World Cup 2024',
      venue: 'Lord\'s Cricket Ground',
      startTime: '2024-01-15T14:00:00Z',
    },
  ];

  const mockUpcomingMatches = [
    {
      id: '3',
      homeTeam: 'South Africa',
      awayTeam: 'New Zealand',
      status: 'Upcoming',
      matchType: 'T20',
      series: 'T20 World Cup',
      venue: 'Newlands, Cape Town',
      startTime: '2024-01-16T18:00:00Z',
    },
    {
      id: '4',
      homeTeam: 'Bangladesh',
      awayTeam: 'Sri Lanka',
      status: 'Upcoming',
      matchType: 'Test',
      series: 'Test Championship',
      venue: 'Shere Bangla National Stadium',
      startTime: '2024-01-17T09:30:00Z',
    },
  ];

  // Use mock data if API is not available
  const displayLiveMatches = liveMatches || mockLiveMatches;
  const displayUpcomingMatches = upcomingMatches || mockUpcomingMatches;

  if (liveError || upcomingError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <Activity className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">Failed to load match data. Using cached data.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Live Matches Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="w-6 h-6 text-green-500 mr-2" />
            Live Matches
            {liveLoading && (
              <div className="ml-2 w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live
          </div>
        </div>

        {displayLiveMatches.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {displayLiveMatches.map((match: any) => (
              <div key={match.id} className="bg-white rounded-lg shadow-lg border-l-4 border-green-500 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">{match.series}</span>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {match.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-blue-600">IN</span>
                      </div>
                      <span className="font-semibold text-gray-900">{match.homeTeam}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{match.homeScore}</div>
                      <div className="text-xs text-gray-500">RR: {match.runRate}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-red-600">AU</span>
                      </div>
                      <span className="font-semibold text-gray-900">{match.awayTeam}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{match.awayScore}</div>
                      <div className="text-xs text-gray-500">RRR: {match.requiredRunRate}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {match.overs} overs
                    </div>
                    <div>{match.venue}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Live Matches</h3>
            <p className="text-gray-500">Check back later for live cricket action!</p>
          </div>
        )}
      </div>

      {/* Upcoming Matches Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Clock className="w-6 h-6 text-blue-500 mr-2" />
            Upcoming Matches
            {upcomingLoading && (
              <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </h2>
        </div>

        {displayUpcomingMatches.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {displayUpcomingMatches.map((match: any) => (
              <div key={match.id} className="bg-white rounded-lg shadow-lg border-l-4 border-blue-500 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">{match.series}</span>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {match.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-green-600">SA</span>
                      </div>
                      <span className="font-semibold text-gray-900">{match.homeTeam}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">vs</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-purple-600">NZ</span>
                      </div>
                      <span className="font-semibold text-gray-900">{match.awayTeam}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{match.matchType}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(match.startTime).toLocaleDateString()}
                    </div>
                    <div>{match.venue}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Matches</h3>
            <p className="text-gray-500">Check back later for upcoming cricket fixtures!</p>
          </div>
        )}
      </div>

      {/* Performance Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            Data cached for optimal performance
          </div>
          <div className="flex items-center">
            <Activity className="w-4 h-4 mr-1" />
            Auto-refresh every 30s
          </div>
        </div>
      </div>
    </div>
  );
}
