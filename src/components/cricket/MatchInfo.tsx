'use client';

import { Card } from '@/components/ui/Card';
import { MapPin, Calendar, Trophy, Users } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';

interface MatchInfoProps {
  match: {
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
    status: 'live' | 'completed' | 'upcoming' | 'cancelled';
    format: string;
    series?: string;
    startTime: string;
  };
}

export function MatchInfo({ match }: MatchInfoProps) {
  return (
    <Card>
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
        <div className="flex items-center gap-3 text-white">
          <Trophy className="h-5 w-5" />
          <span className="font-semibold text-lg">Match Information</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Series */}
        {match.series && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Series</h3>
            <p className="text-gray-900">{match.series}</p>
          </div>
        )}

        {/* Format */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Format</h3>
          <p className="text-gray-900">{match.format?.toUpperCase() || 'MATCH'}</p>
        </div>

        {/* Venue */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Venue
          </h3>
          <p className="text-gray-900">{match.venue.name}</p>
          <p className="text-sm text-gray-600 mt-1">
            {match.venue.city}, {match.venue.country}
          </p>
        </div>

        {/* Date & Time */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date & Time
          </h3>
          <p className="text-gray-900">{formatDate(match.startTime)}</p>
          <p className="text-sm text-gray-600 mt-1">{formatTime(match.startTime)}</p>
        </div>

        {/* Teams */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Teams
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <span className="text-2xl">{match.teams.home.flag}</span>
              <div>
                <p className="font-medium text-gray-900">{match.teams.home.name}</p>
                <p className="text-sm text-gray-600">{match.teams.home.shortName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <span className="text-2xl">{match.teams.away.flag}</span>
              <div>
                <p className="font-medium text-gray-900">{match.teams.away.name}</p>
                <p className="text-sm text-gray-600">{match.teams.away.shortName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Status</h3>
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              match.status === 'live'
                ? 'bg-red-100 text-red-700'
                : match.status === 'completed'
                ? 'bg-gray-100 text-gray-700'
                : match.status === 'upcoming'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {match.status === 'live' && <span className="live-dot bg-red-500" />}
            {match.status === 'completed' && 'Completed'}
            {match.status === 'upcoming' && 'Upcoming'}
            {match.status === 'cancelled' && 'Cancelled'}
            {match.status === 'live' && 'Live'}
          </span>
        </div>
      </div>
    </Card>
  );
}

