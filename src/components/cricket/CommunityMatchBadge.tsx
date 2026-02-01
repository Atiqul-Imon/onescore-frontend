'use client';

import { CheckCircle2, Clock, Users, Shield } from 'lucide-react';
import { CricketMatch } from '@/store/slices/cricketSlice';
import { isMatchVerified, isLocalMatch } from '@/lib/cricket/match-utils';
import { cn } from '@/lib/utils';

interface CommunityMatchBadgeProps {
  match: CricketMatch;
  compact?: boolean;
  className?: string;
}

export function CommunityMatchBadge({
  match,
  compact = false,
  className,
}: CommunityMatchBadgeProps) {
  if (!isLocalMatch(match)) return null;

  const verified = isMatchVerified(match);
  const verificationStatus = match.scorerInfo?.verificationStatus || 'pending';

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {verified ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified</span>
          </span>
        ) : verificationStatus === 'pending' ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
            <Users className="w-3 h-3" />
            <span>Community</span>
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
        <Users className="w-3.5 h-3.5" />
        <span>Community Match</span>
      </span>

      {verified && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verified</span>
        </span>
      )}

      {verificationStatus === 'pending' && !verified && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Verification</span>
        </span>
      )}
    </div>
  );
}

interface MatchTypeIndicatorProps {
  match: CricketMatch;
  showIcon?: boolean;
  className?: string;
}

export function MatchTypeIndicator({ match, showIcon = true, className }: MatchTypeIndicatorProps) {
  const isLocal = isLocalMatch(match);

  if (!isLocal) return null;

  return (
    <div className={cn('flex items-center gap-1.5 text-xs text-gray-600', className)}>
      {showIcon && <Users className="w-3.5 h-3.5" />}
      <span>Community Scored</span>
    </div>
  );
}
