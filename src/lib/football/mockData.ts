import { addDays } from 'date-fns';
import {
  LeagueFixture,
  LeagueHubData,
  LeagueMeta,
  LeagueResult,
  LeagueSlug,
  LeagueStanding,
  StatLeader,
  LeagueNews,
} from './types';

const crestBase =
  'https://upload.wikimedia.org/wikipedia/commons/thumb';

const leagueMeta: Record<LeagueSlug, LeagueMeta> = {
  'premier-league': {
    slug: 'premier-league',
    name: 'Premier League',
    nation: 'England',
    crest: `${crestBase}/f/f2/Premier_League_Logo.svg/120px-Premier_League_Logo.svg.png`,
    description:
      'The most watched league globally. Coverage includes deep tactical analysis, broadcast details, and up-to-the-minute updates.',
    founded: 1992,
  },
  'la-liga': {
    slug: 'la-liga',
    name: 'La Liga',
    nation: 'Spain',
    crest: `${crestBase}/1/13/LaLiga_Santander.svg/120px-LaLiga_Santander.svg.png`,
    description:
      'Spain’s top flight features the generational brilliance of El Clásico rivals, rising talent, and continental heavyweights.',
    founded: 1929,
  },
  'serie-a': {
    slug: 'serie-a',
    name: 'Serie A',
    nation: 'Italy',
    crest: `${crestBase}/d/d5/Serie_A_logo_2022.svg/120px-Serie_A_logo_2022.svg.png`,
    description:
      'Tactical masterclasses, defensive organisation, and a fierce Champions League qualifying battle headline the Italian peninsula.',
    founded: 1898,
  },
  'uefa-champions-league': {
    slug: 'uefa-champions-league',
    name: 'UEFA Champions League',
    nation: 'Europe',
    crest: `${crestBase}/3/3f/UEFA_Champions_League_logo_2.svg/120px-UEFA_Champions_League_logo_2.svg.png`,
    description:
      'The pinnacle of European club football. Midweek drama, knockout tension, and magical European nights under the lights.',
    founded: 1955,
  },
};

function createStandings(): LeagueStanding[] {
  return [
    {
      position: 1,
      team: 'Manchester City',
      crest: `${crestBase}/e/eb/Manchester_City_FC_badge.svg/48px-Manchester_City_FC_badge.svg.png`,
      played: 28,
      won: 20,
      drawn: 6,
      lost: 2,
      goalsFor: 68,
      goalsAgainst: 24,
      goalDifference: 44,
      points: 66,
      form: 'W W D W W',
    },
    {
      position: 2,
      team: 'Arsenal',
      crest: `${crestBase}/5/53/Arsenal_FC.svg/48px-Arsenal_FC.svg.png`,
      played: 28,
      won: 19,
      drawn: 5,
      lost: 4,
      goalsFor: 64,
      goalsAgainst: 26,
      goalDifference: 38,
      points: 62,
      form: 'W W W W D',
    },
    {
      position: 3,
      team: 'Liverpool',
      crest: `${crestBase}/0/0c/Liverpool_FC.svg/48px-Liverpool_FC.svg.png`,
      played: 28,
      won: 18,
      drawn: 7,
      lost: 3,
      goalsFor: 61,
      goalsAgainst: 27,
      goalDifference: 34,
      points: 61,
      form: 'D W W D W',
    },
    {
      position: 4,
      team: 'Aston Villa',
      crest: `${crestBase}/9/9f/Aston_Villa_FC_logo.svg/48px-Aston_Villa_FC_logo.svg.png`,
      played: 28,
      won: 17,
      drawn: 5,
      lost: 6,
      goalsFor: 58,
      goalsAgainst: 35,
      goalDifference: 23,
      points: 56,
      form: 'W D L W W',
    },
    {
      position: 5,
      team: 'Tottenham Hotspur',
      crest: `${crestBase}/b/b4/Tottenham_Hotspur.svg/48px-Tottenham_Hotspur.svg.png`,
      played: 28,
      won: 16,
      drawn: 6,
      lost: 6,
      goalsFor: 55,
      goalsAgainst: 40,
      goalDifference: 15,
      points: 54,
      form: 'W L D W W',
    },
  ];
}

function createFixtures(): LeagueFixture[] {
  return [
    {
      id: 'fixture-1',
      homeTeam: 'Liverpool',
      awayTeam: 'Arsenal',
      homeCrest: `${crestBase}/0/0c/Liverpool_FC.svg/32px-Liverpool_FC.svg.png`,
      awayCrest: `${crestBase}/5/53/Arsenal_FC.svg/32px-Arsenal_FC.svg.png`,
      kickoff: addDays(new Date(), 2).toISOString(),
      venue: 'Anfield',
      broadcast: 'Hotstar',
      matchweek: 'MW 32',
    },
    {
      id: 'fixture-2',
      homeTeam: 'Tottenham Hotspur',
      awayTeam: 'Manchester United',
      homeCrest: `${crestBase}/b/b4/Tottenham_Hotspur.svg/32px-Tottenham_Hotspur.svg.png`,
      awayCrest: `${crestBase}/7/7a/Manchester_United_FC_crest.svg/32px-Manchester_United_FC_crest.svg.png`,
      kickoff: addDays(new Date(), 3).toISOString(),
      venue: 'Tottenham Hotspur Stadium',
      broadcast: 'Star Sports Select 1',
      matchweek: 'MW 32',
    },
    {
      id: 'fixture-3',
      homeTeam: 'Chelsea',
      awayTeam: 'Newcastle United',
      homeCrest: `${crestBase}/c/cc/Chelsea_FC.svg/32px-Chelsea_FC.svg.png`,
      awayCrest: `${crestBase}/2/2c/Newcastle_United_Logo.svg/32px-Newcastle_United_Logo.svg.png`,
      kickoff: addDays(new Date(), 5).toISOString(),
      venue: 'Stamford Bridge',
      broadcast: 'Sony LIV',
      matchweek: 'MW 32',
    },
  ];
}

function createResults(): LeagueResult[] {
  return [
    {
      id: 'result-1',
      homeTeam: 'Manchester City',
      awayTeam: 'Brighton & Hove Albion',
      homeCrest: `${crestBase}/e/eb/Manchester_City_FC_badge.svg/32px-Manchester_City_FC_badge.svg.png`,
      awayCrest: `${crestBase}/d/d3/Brighton_%26_Hove_Albion_logo.svg/32px-Brighton_%26_Hove_Albion_logo.svg.png`,
      kickoff: addDays(new Date(), -2).toISOString(),
      venue: 'Etihad Stadium',
      matchweek: 'MW 31',
      broadcast: 'Sony LIV',
      status: 'final',
      score: { home: 3, away: 1 },
    },
    {
      id: 'result-2',
      homeTeam: 'Aston Villa',
      awayTeam: 'Tottenham Hotspur',
      homeCrest: `${crestBase}/9/9f/Aston_Villa_FC_logo.svg/32px-Aston_Villa_FC_logo.svg.png`,
      awayCrest: `${crestBase}/b/b4/Tottenham_Hotspur.svg/32px-Tottenham_Hotspur.svg.png`,
      kickoff: addDays(new Date(), -4).toISOString(),
      venue: 'Villa Park',
      matchweek: 'MW 31',
      broadcast: 'Hotstar',
      status: 'final',
      score: { home: 2, away: 2 },
    },
  ];
}

function createStatLeaders(): StatLeader[] {
  return [
    {
      player: 'Erling Haaland',
      team: 'Manchester City',
      crest: `${crestBase}/e/eb/Manchester_City_FC_badge.svg/28px-Manchester_City_FC_badge.svg.png`,
      value: 24,
      metric: 'goals',
    },
    {
      player: 'Mohamed Salah',
      team: 'Liverpool',
      crest: `${crestBase}/0/0c/Liverpool_FC.svg/28px-Liverpool_FC.svg.png`,
      value: 18,
      metric: 'assists',
    },
    {
      player: 'David Raya',
      team: 'Arsenal',
      crest: `${crestBase}/5/53/Arsenal_FC.svg/28px-Arsenal_FC.svg.png`,
      value: 13,
      metric: 'cleanSheets',
    },
  ];
}

function createInsights(slug: LeagueSlug) {
  const baseInsights = [
    {
      title: 'Matchday Outlook',
      items: [
        'United face consecutive away fixtures with dEfensive injuries mounting.',
        'Brighton’s 3-4-2-1 has yielded the league-high expected threat over the last month.',
      ],
    },
    {
      title: 'Injury Tracker',
      items: [
        'Gabriel Jesus and Zinchenko close to returning for Arsenal.',
        'Spurs missing Maddison (suspension) and Romero (hamstring) for the next gameweek.',
      ],
    },
  ];

  if (slug === 'uefa-champions-league') {
    baseInsights.push({
      title: 'Knockout Notes',
      items: [
        'Real Madrid have won their last eight quarter-final ties.',
        'Manchester City unbeaten in 28 home matches across all competitions.',
      ],
    });
  }

  return baseInsights;
}

function createNews(slug: LeagueSlug): LeagueNews[] {
  const baseHref = `/news/football/${slug}`;
  return [
    {
      id: `${slug}-news-1`,
      title: 'Tactical Notebook: How the title contenders are adapting their build-up',
      summary: 'Chalkboard sequences showing double pivots, inverted full-backs, and overloads that are defining the title race.',
      href: `${baseHref}/tactical-notebook`,
      tag: 'Analysis',
      publishedAt: new Date().toISOString(),
    },
    {
      id: `${slug}-news-2`,
      title: 'Injury Tracker: Who is returning in time for the run-in?',
      summary: 'Comprehensive look at fitness reports, potential comebacks, and academy promotions to cover for suspensions.',
      href: `${baseHref}/injury-tracker`,
      tag: 'Team News',
      publishedAt: addDays(new Date(), -1).toISOString(),
    },
    {
      id: `${slug}-news-3`,
      title: 'Power Rankings: Form guide across the last five matchweeks',
      summary: 'Expected points tables, xG difference, and pressing metrics stacked side-by-side for every club.',
      href: `${baseHref}/power-rankings`,
      tag: 'Form Guide',
      publishedAt: addDays(new Date(), -2).toISOString(),
    },
  ];
}

export function getLeagueOverview(): LeagueMeta[] {
  return Object.values(leagueMeta);
}

export function getLeagueHubData(slug: LeagueSlug): LeagueHubData {
  return {
    meta: leagueMeta[slug],
    standings: createStandings(),
    fixtures: createFixtures(),
    results: createResults(),
    statLeaders: createStatLeaders(),
    insights: createInsights(slug),
    news: createNews(slug),
  };
}

