'use client';

import { Card } from '@/components/ui/Card';
import { Users, MapPin, Shield, Clock, CheckCircle2, Award } from 'lucide-react';
import { CricketMatch } from '@/store/slices/cricketSlice';
import { isLocalMatch, isMatchVerified, getLocationDisplay } from '@/lib/cricket/match-utils';
import { formatDistanceToNow } from 'date-fns';

interface CommunityMatchInfoProps {
  match: CricketMatch;
}

export function CommunityMatchInfo({ match }: CommunityMatchInfoProps) {
  if (!isLocalMatch(match)) return null;

  const verified = isMatchVerified(match);
  const scorerInfo = match.scorerInfo;
  const location = getLocationDisplay(match);
  const lastUpdate = scorerInfo?.lastUpdate
    ? formatDistanceToNow(new Date(scorerInfo.lastUpdate), { addSuffix: true })
    : null;

  const scorerTypeLabels = {
    official: 'Official Scorer',
    volunteer: 'Volunteer Scorer',
    community: 'Community Scorer',
  };

  const leagueLevelLabels = {
    national: 'National',
    state: 'State',
    district: 'District',
    city: 'City',
    ward: 'Ward',
    club: 'Club',
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Community Match</h3>
              <p className="text-xs text-gray-600">Scored by community members</p>
            </div>
          </div>

          {verified && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium">Verified</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {/* Scorer Info */}
          {scorerInfo && (
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">Scored by</p>
                <p className="text-sm text-gray-700">{scorerInfo.scorerName}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {scorerTypeLabels[scorerInfo.scorerType] || scorerInfo.scorerType}
                </p>
              </div>
            </div>
          )}

          {/* Location */}
          {location && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-700">{location}</p>
              </div>
            </div>
          )}

          {/* League Info */}
          {match.localLeague && (
            <div className="flex items-start gap-3">
              <Award className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">League</p>
                <p className="text-sm text-gray-700">{match.localLeague.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {leagueLevelLabels[match.localLeague.level]} • {match.localLeague.season}
                </p>
              </div>
            </div>
          )}

          {/* Last Update */}
          {lastUpdate && (
            <div className="flex items-start gap-3 pt-2 border-t border-indigo-100">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Last updated {lastUpdate}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
