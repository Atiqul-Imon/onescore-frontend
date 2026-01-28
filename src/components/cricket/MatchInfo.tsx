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
    round?: string;
    matchNote?: string;
    target?: number;
  };
}

export function MatchInfo({ match }: MatchInfoProps) {
  return (
    <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="bg-gradient-to-r from-secondary-800 via-secondary-900 to-secondary-800 px-6 py-4 rounded-t-2xl">
        <div className="flex items-center gap-3 text-white">
          <Trophy className="h-5 w-5 text-primary-400" />
          <span className="font-bold text-lg">Match Information</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Series */}
        {match.series && (
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Series</h3>
            <p className="text-gray-900 font-semibold">{match.series}</p>
            {match.round && (
              <p className="text-sm text-gray-600 mt-1">{match.round}</p>
            )}
          </div>
        )}

        {/* Match Note / Target */}
        {match.matchNote && (
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Match Status</h3>
            <p className="text-gray-900 font-semibold">{match.matchNote}</p>
            {match.target && (
              <p className="text-sm text-primary-700 font-bold mt-1">Target: {match.target} runs</p>
            )}
          </div>
        )}

        {/* Format */}
        <div className="pb-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Format</h3>
          <p className="text-gray-900 font-semibold">{match.format?.toUpperCase() || 'MATCH'}</p>
        </div>

        {/* Venue */}
        <div className="pb-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            Venue
          </h3>
          <p className="text-gray-900 font-semibold">{match.venue.name}</p>
          <p className="text-sm text-gray-600 mt-1">
            {match.venue.city}, {match.venue.country}
          </p>
        </div>

        {/* Date & Time */}
        <div className="pb-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            Date & Time
          </h3>
          <p className="text-gray-900 font-semibold">{formatDate(match.startTime)}</p>
          <p className="text-sm text-gray-600 mt-1 font-medium">{formatTime(match.startTime)}</p>
        </div>

        {/* Teams */}
        <div className="pb-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Users className="h-3.5 w-3.5" />
            Teams
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 border border-primary-100">
              <span className="text-2xl">{match.teams.home.flag}</span>
              <div>
                <p className="font-bold text-gray-900">{match.teams.home.name}</p>
                <p className="text-sm text-gray-600 font-medium">{match.teams.home.shortName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 border border-primary-100">
              <span className="text-2xl">{match.teams.away.flag}</span>
              <div>
                <p className="font-bold text-gray-900">{match.teams.away.name}</p>
                <p className="text-sm text-gray-600 font-medium">{match.teams.away.shortName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Status</h3>
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${
              match.status === 'live'
                ? 'bg-red-50 text-red-700 border-2 border-red-200'
                : match.status === 'completed'
                ? 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                : match.status === 'upcoming'
                ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                : 'bg-yellow-50 text-yellow-700 border-2 border-yellow-200'
            }`}
          >
            {match.status === 'live' && <span className="live-dot bg-red-500 animate-pulse" />}
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

