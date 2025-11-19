export type LeagueSlug =
  | 'premier-league'
  | 'la-liga'
  | 'serie-a'
  | 'uefa-champions-league';

export interface LeagueMeta {
  slug: LeagueSlug;
  name: string;
  nation: string;
  crest: string;
  description: string;
  founded?: number;
  website?: string;
}

export interface LeagueStanding {
  position: number;
  team: string;
  crest: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string;
}

export interface LeagueFixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeCrest: string;
  awayCrest: string;
  kickoff: string;
  venue: string;
  broadcast?: string;
  matchweek?: string;
}

export interface LeagueResult extends LeagueFixture {
  status: 'final' | 'penalties';
  score: {
    home: number;
    away: number;
  };
  penalties?: {
    home: number;
    away: number;
  };
}

export interface StatLeader {
  player: string;
  team: string;
  crest: string;
  value: number;
  metric: 'goals' | 'assists' | 'cleanSheets';
}

export interface LeagueInsight {
  title: string;
  items: string[];
}

export interface LeagueNews {
  id: string;
  title: string;
  summary: string;
  href: string;
  tag?: string;
  publishedAt: string;
}

export interface LeagueHubData {
  meta: LeagueMeta;
  standings: LeagueStanding[];
  fixtures: LeagueFixture[];
  results: LeagueResult[];
  statLeaders: StatLeader[];
  insights: LeagueInsight[];
  news: LeagueNews[];
}

