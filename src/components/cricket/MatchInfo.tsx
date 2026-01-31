'use client';

import { Card } from '@/components/ui/Card';
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
      capacity?: number;
    };
    status: 'live' | 'completed' | 'upcoming' | 'cancelled';
    format: string;
    series?: string;
    startTime: string;
    round?: string;
    matchNote?: string;
    target?: number;
    tossWon?: string;
    elected?: string;
    leagueName?: string;
    seasonName?: string;
    stageName?: string;
    roundName?: string;
    venueCapacity?: number;
  };
}

export function MatchInfo({ match }: MatchInfoProps) {
  return (
    <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="bg-gradient-to-r from-secondary-800 via-secondary-900 to-secondary-800 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 rounded-t-2xl">
        <div className="flex items-center gap-2 sm:gap-3 text-white">
          <span className="font-bold text-base sm:text-lg">Match Information</span>
        </div>
      </div>

      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Series */}
        {match.series && (
          <div className="pb-3 sm:pb-4 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 sm:mb-2">
              Series
            </h3>
            <p className="text-gray-900 font-semibold text-sm sm:text-base break-words">
              {match.series}
            </p>
            {match.round && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{match.round}</p>
            )}
          </div>
        )}

        {/* Match Note / Target */}
        {match.matchNote && (
          <div className="pb-3 sm:pb-4 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 sm:mb-2">
              Match Status
            </h3>
            <p className="text-gray-900 font-semibold text-sm sm:text-base break-words">
              {match.matchNote}
            </p>
            {match.target && (
              <p className="text-xs sm:text-sm text-primary-700 font-bold mt-1">
                Target: {match.target} runs
              </p>
            )}
          </div>
        )}

        {/* Format */}
        <div className="pb-3 sm:pb-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 sm:mb-2">
            Format
          </h3>
          <p className="text-gray-900 font-semibold text-sm sm:text-base">
            {match.format?.toUpperCase() || 'MATCH'}
          </p>
        </div>

        {/* Venue */}
        <div className="pb-3 sm:pb-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
            Venue
          </h3>
          <p className="text-gray-900 font-semibold text-sm sm:text-base break-words">
            {match.venue.name}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
            {match.venue.city}, {match.venue.country}
          </p>
          {match.venueCapacity && (
            <p className="text-xs text-gray-500 mt-1">
              Capacity: {match.venueCapacity.toLocaleString()}
            </p>
          )}
        </div>

        {/* Toss Information */}
        {match.tossWon && (
          <div className="pb-3 sm:pb-4 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 sm:mb-2">
              Toss
            </h3>
            <p className="text-gray-900 font-semibold text-sm sm:text-base break-words">
              {match.elected
                ? `${match.tossWon} choose to ${match.elected.charAt(0).toUpperCase() + match.elected.slice(1)} First`
                : `${match.tossWon} won the toss`}
            </p>
          </div>
        )}

        {/* League/Season Information */}
        {(match.leagueName || match.seasonName || match.stageName) && (
          <div className="pb-3 sm:pb-4 border-b border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 sm:mb-2">
              Competition
            </h3>
            {match.leagueName && (
              <p className="text-gray-900 font-semibold text-sm sm:text-base break-words">
                {match.leagueName}
              </p>
            )}
            {match.seasonName && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                {match.seasonName}
              </p>
            )}
            {match.stageName && (
              <p className="text-xs text-gray-500 mt-1 break-words">Stage: {match.stageName}</p>
            )}
            {match.roundName && (
              <p className="text-xs text-gray-500 mt-1 break-words">Round: {match.roundName}</p>
            )}
          </div>
        )}

        {/* Date & Time */}
        <div className="pb-3 sm:pb-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
            Date & Time
          </h3>
          <p className="text-gray-900 font-semibold text-sm sm:text-base">
            {formatDate(match.startTime)}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
            {formatTime(match.startTime)}
          </p>
        </div>

        {/* Teams */}
        <div className="pb-3 sm:pb-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
            Teams
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-primary-50 border border-primary-100">
              <span className="text-xl sm:text-2xl flex-shrink-0">{match.teams.home.flag}</span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 text-sm sm:text-base truncate">
                  {match.teams.home.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  {match.teams.home.shortName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-primary-50 border border-primary-100">
              <span className="text-xl sm:text-2xl flex-shrink-0">{match.teams.away.flag}</span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 text-sm sm:text-base truncate">
                  {match.teams.away.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  {match.teams.away.shortName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 sm:mb-3">
            Status
          </h3>
          <span
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold ${
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
