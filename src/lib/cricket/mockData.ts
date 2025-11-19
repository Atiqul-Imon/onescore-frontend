import { addDays } from 'date-fns';
import {
  CricketFixture,
  CricketLeagueHubData,
  CricketLeagueMeta,
  CricketLeagueSlug,
  CricketNews,
  CricketResult,
  CricketStanding,
  CricketStatLeader,
  CricketStatMetric,
  CricketInsightPanel,
} from './types';

const crestBase = 'https://upload.wikimedia.org/wikipedia/en';

const leagueMeta: Record<CricketLeagueSlug, CricketLeagueMeta> = {
  ipl: {
    slug: 'ipl',
    name: 'Indian Premier League',
    format: 'T20',
    nation: 'India',
    crest: `${crestBase}/d/d0/Indian_Premier_League_Official_Logo.svg`,
    description:
      'High octane franchise cricket with global superstars. Ball-by-ball commentary, fantasy tips, and tactical match-ups.',
    founded: 2008,
  },
  bbl: {
    slug: 'bbl',
    name: 'Big Bash League',
    format: 'T20',
    nation: 'Australia',
    crest: `${crestBase}/2/20/Big_Bash_League_Logo.svg`,
    description:
      'Australia’s summer spectacle with power surges, Bash Boost points, and innovation from start to finish.',
    founded: 2011,
  },
  psl: {
    slug: 'psl',
    name: 'Pakistan Super League',
    format: 'T20',
    nation: 'Pakistan',
    crest: `${crestBase}/6/6d/Pakistan_Super_League_logo.svg`,
    description:
      'Raw pace, young batting talent, and electrifying atmospheres across Pakistan’s premier T20 tournament.',
    founded: 2015,
  },
  bpl: {
    slug: 'bpl',
    name: 'Bangladesh Premier League',
    format: 'T20',
    nation: 'Bangladesh',
    crest: `${crestBase}/1/1c/Bangladesh_Premier_League_logo.svg`,
    description:
      'Emerging stars meet experienced internationals in a fast-paced league rich with subcontinental flair.',
    founded: 2012,
  },
  'world-test-championship': {
    slug: 'world-test-championship',
    name: 'ICC World Test Championship',
    format: 'Test',
    nation: 'International',
    crest: `${crestBase}/3/39/ICC_Test_Championship_logo.svg`,
    description:
      'The ultimate five-day contest. Track the WTC table, series results, and looming battles for a Lord’s final berth.',
    founded: 2019,
  },
};

function createStandings(): CricketStanding[] {
  return [
    {
      position: 1,
      team: 'Chennai Super Kings',
      crest: `${crestBase}/9/9c/Chennai_Super_Kings_Logo.svg`,
      matches: 10,
      wins: 7,
      losses: 2,
      ties: 0,
      noResult: 1,
      netRunRate: 0.876,
      points: 15,
      form: 'W W W L W',
    },
    {
      position: 2,
      team: 'Royal Challengers Bangalore',
      crest: `${crestBase}/a/a1/Royal_Challengers_Bangalore_Logo.svg`,
      matches: 10,
      wins: 7,
      losses: 3,
      ties: 0,
      noResult: 0,
      netRunRate: 0.512,
      points: 14,
      form: 'L W W W W',
    },
    {
      position: 3,
      team: 'Mumbai Indians',
      crest: `${crestBase}/2/26/Mumbai_Indians_crest.svg`,
      matches: 10,
      wins: 6,
      losses: 3,
      ties: 0,
      noResult: 1,
      netRunRate: 0.342,
      points: 13,
      form: 'W W L W NR',
    },
    {
      position: 4,
      team: 'Kolkata Knight Riders',
      crest: `${crestBase}/4/4a/Kolkata_Knight_Riders_Logo.svg`,
      matches: 10,
      wins: 5,
      losses: 4,
      ties: 0,
      noResult: 1,
      netRunRate: -0.137,
      points: 11,
      form: 'L W NR L W',
    },
    {
      position: 5,
      team: 'Lucknow Super Giants',
      crest: `${crestBase}/7/7e/Lucknow_Super_Giants_Logo.svg`,
      matches: 10,
      wins: 5,
      losses: 5,
      ties: 0,
      noResult: 0,
      netRunRate: -0.210,
      points: 10,
      form: 'W L L W L',
    },
  ];
}

function createFixtures(slug: CricketLeagueSlug): CricketFixture[] {
  const baseFixtures: CricketFixture[] = [
    {
      id: `${slug}-fixture-1`,
      matchNumber: 'Match 41',
      homeTeam: 'Mumbai Indians',
      awayTeam: 'Royal Challengers Bangalore',
      homeCrest: `${crestBase}/2/26/Mumbai_Indians_crest.svg`,
      awayCrest: `${crestBase}/a/a1/Royal_Challengers_Bangalore_Logo.svg`,
      venue: 'Wankhede Stadium, Mumbai',
      kickoff: addDays(new Date(), 2).toISOString(),
      broadcast: 'JioCinema',
      format: 'T20',
      dayNight: true,
    },
    {
      id: `${slug}-fixture-2`,
      matchNumber: 'Match 42',
      homeTeam: 'Chennai Super Kings',
      awayTeam: 'Lucknow Super Giants',
      homeCrest: `${crestBase}/9/9c/Chennai_Super_Kings_Logo.svg`,
      awayCrest: `${crestBase}/7/7e/Lucknow_Super_Giants_Logo.svg`,
      venue: 'MA Chidambaram Stadium, Chennai',
      kickoff: addDays(new Date(), 4).toISOString(),
      broadcast: 'Star Sports 1',
      format: 'T20',
      dayNight: false,
    },
    {
      id: `${slug}-fixture-3`,
      matchNumber: 'Match 43',
      homeTeam: 'Kolkata Knight Riders',
      awayTeam: 'Sunrisers Hyderabad',
      homeCrest: `${crestBase}/4/4a/Kolkata_Knight_Riders_Logo.svg`,
      awayCrest: `${crestBase}/7/7a/Sunrisers_Hyderabad.svg`,
      venue: 'Eden Gardens, Kolkata',
      kickoff: addDays(new Date(), 5).toISOString(),
      broadcast: 'Hotstar',
      format: 'T20',
      dayNight: true,
    },
  ];

  if (slug === 'world-test-championship') {
    baseFixtures[0].format = 'Test';
    baseFixtures[0].matchNumber = '2nd Test';
    baseFixtures[0].venue = 'Lord’s Cricket Ground, London';
    baseFixtures[0].broadcast = 'Sony LIV';
  }

  return baseFixtures;
}

function createResults(slug: CricketLeagueSlug): CricketResult[] {
  const baseResults: CricketResult[] = [
    {
      id: `${slug}-result-1`,
      matchNumber: 'Match 38',
      homeTeam: 'Delhi Capitals',
      awayTeam: 'Mumbai Indians',
      homeCrest: `${crestBase}/1/13/Delhi_Capitals_Logo.svg`,
      awayCrest: `${crestBase}/2/26/Mumbai_Indians_crest.svg`,
      venue: 'Arun Jaitley Stadium, Delhi',
      kickoff: addDays(new Date(), -1).toISOString(),
      broadcast: 'JioCinema',
      format: 'T20',
      dayNight: true,
      status: 'completed',
      resultSummary: 'Mumbai Indians won by 7 wickets. Rohit Sharma 72 (38).',
      playerOfMatch: 'Rohit Sharma',
    },
    {
      id: `${slug}-result-2`,
      matchNumber: 'Match 39',
      homeTeam: 'Punjab Kings',
      awayTeam: 'Chennai Super Kings',
      homeCrest: `${crestBase}/d/d4/Punjab_Kings_Logo.svg`,
      awayCrest: `${crestBase}/9/9c/Chennai_Super_Kings_Logo.svg`,
      venue: 'Punjab Cricket Association IS Bindra Stadium, Mohali',
      kickoff: addDays(new Date(), -2).toISOString(),
      broadcast: 'Star Sports 1',
      format: 'T20',
      dayNight: false,
      status: 'completed',
      resultSummary: 'Chennai Super Kings won by 4 runs. Jadeja defended 10 in final over.',
      playerOfMatch: 'Ravindra Jadeja',
    },
  ];

  if (slug === 'world-test-championship') {
    baseResults[0] = {
      ...baseResults[0],
      format: 'Test',
      matchNumber: '1st Test',
      venue: 'MCG, Melbourne',
      resultSummary: 'Australia won by 5 wickets. Pat Cummins took 6 wickets.',
      playerOfMatch: 'Pat Cummins',
    };
  }

  return baseResults;
}

function createStatLeaders(slug: CricketLeagueSlug): CricketStatLeader[] {
  const leaders: CricketStatLeader[] = [
    {
      player: 'Virat Kohli',
      team: 'Royal Challengers Bangalore',
      crest: `${crestBase}/a/a1/Royal_Challengers_Bangalore_Logo.svg`,
      value: 587,
      metric: 'runs',
      note: 'Average 73.4',
    },
    {
      player: 'Jasprit Bumrah',
      team: 'Mumbai Indians',
      crest: `${crestBase}/2/26/Mumbai_Indians_crest.svg`,
      value: 19,
      metric: 'wickets',
      note: 'Economy 6.7',
    },
    {
      player: 'Nicholas Pooran',
      team: 'Lucknow Super Giants',
      crest: `${crestBase}/7/7e/Lucknow_Super_Giants_Logo.svg`,
      value: 189.3,
      metric: 'strikeRate',
      note: 'Best strike rate (min 150 balls)',
    },
  ];

  if (slug === 'world-test-championship') {
    leaders[0] = {
      player: 'Joe Root',
      team: 'England',
      crest: `${crestBase}/8/81/England_cricket_cap_badge.svg`,
      value: 712,
      metric: 'runs',
      note: 'Average 51.0',
    };
    leaders[1] = {
      player: 'Ravichandran Ashwin',
      team: 'India',
      crest: `${crestBase}/4/41/Cricket_India_Crest.svg`,
      value: 42,
      metric: 'wickets',
      note: 'Average 18.9',
    };
  }

  return leaders;
}

function createInsights(slug: CricketLeagueSlug): CricketInsightPanel[] {
  const base: CricketInsightPanel[] = [
    {
      title: 'Matchday Outlook',
      items: [
        'Expect dew in Mumbai; captains likely to chase if they win the toss.',
        'RCB experimenting with batting order—Maxwell floated to power play in practice.',
      ],
    },
    {
      title: 'Team News',
      items: [
        'MS Dhoni managing a knee niggle but expected to play the next CSK fixture.',
        'Punjab Kings likely to include a specialist finisher with Livingstone unavailable.',
      ],
    },
  ];

  if (slug === 'world-test-championship') {
    base.push({
      title: 'Pitch & Conditions',
      items: [
        'MCG surface has carried bounce; expect seam movement early and reverse swing later.',
        'Overcast conditions predicted for Day 1 morning leading to possible delayed start.',
      ],
    });
  }

  return base;
}

function createNews(slug: CricketLeagueSlug): CricketNews[] {
  const baseHref = `/news/cricket/${slug}`;
  return [
    {
      id: `${slug}-news-1`,
      title: 'Powerplay Breakdown: How teams are maximising the first six overs',
      summary: 'Scoring rate trends, boundary percentages, and the use of Impact Player across franchises.',
      href: `${baseHref}/powerplay-breakdown`,
      tag: 'Analysis',
      publishedAt: new Date().toISOString(),
    },
    {
      id: `${slug}-news-2`,
      title: 'Injury & Availability tracker heading into the business end',
      summary: 'Latest on overseas reinforcements, NOC approvals, and workload management decisions.',
      href: `${baseHref}/injury-tracker`,
      tag: 'Team News',
      publishedAt: addDays(new Date(), -1).toISOString(),
    },
    {
      id: `${slug}-news-3`,
      title: 'Fantasy Radar: Smart captaincy picks and budget differentials',
      summary: 'Form guide, venue bias, and strike-rate projections for the upcoming double-header.',
      href: `${baseHref}/fantasy-radar`,
      tag: 'Fantasy',
      publishedAt: addDays(new Date(), -2).toISOString(),
    },
  ];
}

export function getCricketLeagueOverview(): CricketLeagueMeta[] {
  return Object.values(leagueMeta);
}

export function getCricketLeagueHubData(slug: CricketLeagueSlug): CricketLeagueHubData {
  return {
    meta: leagueMeta[slug],
    standings: createStandings(),
    fixtures: createFixtures(slug),
    results: createResults(slug),
    statLeaders: createStatLeaders(slug),
    insights: createInsights(slug),
    news: createNews(slug),
  };
}

