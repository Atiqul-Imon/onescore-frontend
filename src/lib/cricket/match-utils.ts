import { CricketMatch } from '@/store/slices/cricketSlice';

/**
 * Check if a match is a local/community match
 */
export function isLocalMatch(match: CricketMatch): boolean {
  return (
    match.isLocalMatch === true || match.matchType === 'local' || match.matchType === 'hyper-local'
  );
}

/**
 * Check if a match is verified
 */
export function isMatchVerified(match: CricketMatch): boolean {
  return match.isVerified === true || match.scorerInfo?.verificationStatus === 'verified';
}

/**
 * Get match type label for display
 */
export function getMatchTypeLabel(match: CricketMatch): string {
  if (isLocalMatch(match)) {
    if (isMatchVerified(match)) {
      return 'Verified Community Match';
    }
    return 'Community Match';
  }
  return 'Official Match';
}

/**
 * Transform local match from API to unified format
 */
export function transformLocalMatch(localMatch: any): CricketMatch {
  return {
    _id: localMatch._id || localMatch.matchId,
    matchId: localMatch.matchId,
    series: localMatch.series,
    teams: localMatch.teams,
    venue: {
      name: localMatch.venue.name,
      city: localMatch.venue.city,
      country: localMatch.venue.country,
      address: localMatch.venue.address,
    },
    status: localMatch.status,
    format: localMatch.format,
    startTime:
      typeof localMatch.startTime === 'string'
        ? localMatch.startTime
        : new Date(localMatch.startTime).toISOString(),
    endTime: localMatch.endTime
      ? typeof localMatch.endTime === 'string'
        ? localMatch.endTime
        : new Date(localMatch.endTime).toISOString()
      : undefined,
    currentScore: localMatch.currentScore,
    isLocalMatch: true,
    matchType: localMatch.matchType || 'local',
    localLocation: localMatch.localLocation,
    localLeague: localMatch.localLeague,
    scorerInfo: localMatch.scorerInfo
      ? {
          scorerId: localMatch.scorerInfo.scorerId,
          scorerName: localMatch.scorerInfo.scorerName,
          scorerType: localMatch.scorerInfo.scorerType,
          lastUpdate:
            typeof localMatch.scorerInfo.lastUpdate === 'string'
              ? localMatch.scorerInfo.lastUpdate
              : new Date(localMatch.scorerInfo.lastUpdate).toISOString(),
          verificationStatus: localMatch.scorerInfo.verificationStatus,
        }
      : undefined,
    isVerified: localMatch.isVerified || false,
    matchNote: localMatch.matchNote,
    createdAt: localMatch.createdAt || new Date().toISOString(),
    updatedAt: localMatch.updatedAt || new Date().toISOString(),
  };
}

/**
 * Merge official and local matches, sorted by start time (most recent first)
 */
export function mergeMatches(
  officialMatches: CricketMatch[],
  localMatches: CricketMatch[]
): CricketMatch[] {
  const allMatches = [...officialMatches, ...localMatches];

  return allMatches.sort((a, b) => {
    const timeA = new Date(a.startTime).getTime();
    const timeB = new Date(b.startTime).getTime();
    return timeB - timeA; // Most recent first
  });
}

/**
 * Filter matches by type
 */
export function filterMatchesByType(
  matches: CricketMatch[],
  type: 'all' | 'official' | 'local'
): CricketMatch[] {
  if (type === 'all') return matches;
  if (type === 'local') return matches.filter(isLocalMatch);
  return matches.filter((m) => !isLocalMatch(m));
}

/**
 * Get location display string for local matches
 */
export function getLocationDisplay(match: CricketMatch): string | null {
  if (!isLocalMatch(match) || !match.localLocation) return null;

  const { city, district, area, country } = match.localLocation;
  const parts = [area, district, city].filter(Boolean);
  return parts.length > 0 ? `${parts.join(', ')}, ${country}` : city ? `${city}, ${country}` : null;
}
