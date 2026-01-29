/**
 * Match-related types
 * Replaces `any` types in match-related code
 */

export type MatchStatus = 'live' | 'completed' | 'upcoming' | 'cancelled';

export type MatchFormat = 'T20' | 'ODI' | 'Test' | 'T10' | string;

export interface Team {
  id: string;
  name: string;
  shortName: string;
  flag: string;
  logo?: string;
}

export interface MatchScore {
  runs: number;
  wickets: number;
  overs: number;
  balls?: number;
}

export interface CurrentScore {
  home: MatchScore;
  away: MatchScore;
}

export interface MatchVenue {
  name: string;
  city: string;
  country?: string;
}

export interface MatchTeams {
  home: Team;
  away: Team;
}

export interface BaseMatch {
  _id?: string;
  matchId: string;
  name: string;
  status: MatchStatus;
  format?: MatchFormat;
  league?: string;
  startTime: string;
  venue?: MatchVenue;
  teams: MatchTeams;
  currentScore?: CurrentScore;
  score?: {
    home: number;
    away: number;
  };
  detailUrl?: string;
  matchStarted?: boolean;
  matchEnded?: boolean;
}

export interface LiveMatch extends BaseMatch {
  status: 'live';
  currentScore: CurrentScore;
}

export interface CompletedMatch extends BaseMatch {
  status: 'completed';
  result?: string;
  currentScore?: CurrentScore;
}

export interface UpcomingMatch extends BaseMatch {
  status: 'upcoming';
}

export type Match = LiveMatch | CompletedMatch | UpcomingMatch;

