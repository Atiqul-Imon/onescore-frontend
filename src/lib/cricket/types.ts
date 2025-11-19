export type CricketLeagueSlug =
  | 'ipl'
  | 'bbl'
  | 'psl'
  | 'bpl'
  | 'world-test-championship';

export interface CricketLeagueMeta {
  slug: CricketLeagueSlug;
  name: string;
  format: string;
  nation: string;
  crest: string;
  description: string;
  founded?: number;
}

export interface CricketStanding {
  position: number;
  team: string;
  crest: string;
  matches: number;
  wins: number;
  losses: number;
  ties: number;
  noResult: number;
  netRunRate: number;
  points: number;
  form?: string;
}

export interface CricketFixture {
  id: string;
  matchNumber?: string;
  homeTeam: string;
  awayTeam: string;
  homeCrest: string;
  awayCrest: string;
  venue: string;
  kickoff: string;
  broadcast?: string;
  format: 'T20' | 'ODI' | 'Test';
  dayNight?: boolean;
}

export interface CricketResult extends CricketFixture {
  status: 'completed';
  resultSummary: string;
  playerOfMatch?: string;
}

export type CricketStatMetric = 'runs' | 'wickets' | 'strikeRate' | 'economy';

export interface CricketStatLeader {
  player: string;
  team: string;
  crest: string;
  value: number;
  metric: CricketStatMetric;
  note?: string;
}

export interface CricketInsightPanel {
  title: string;
  items: string[];
}

export interface CricketNews {
  id: string;
  title: string;
  summary: string;
  href: string;
  tag?: string;
  publishedAt: string;
}

export interface CricketLeagueHubData {
  meta: CricketLeagueMeta;
  standings: CricketStanding[];
  fixtures: CricketFixture[];
  results: CricketResult[];
  statLeaders: CricketStatLeader[];
  insights: CricketInsightPanel[];
  news: CricketNews[];
}

