import { HeroSection } from './HeroSection';

export type Article = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  heroImage?: string;
  category: 'cricket' | 'football' | 'general';
  type: 'breaking' | 'match_report' | 'analysis' | 'feature' | 'interview' | 'opinion';
  publishedAt?: string;
  author?: { name?: string };
  readingTimeMinutes?: number;
};

export type LiveMatch = {
  _id: string;
  matchId: string;
  teams: {
    home: { name: string; shortName: string; flag?: string };
    away: { name: string; shortName: string; flag?: string };
  };
  status: 'live' | 'completed' | 'upcoming';
  startTime?: string;
  currentScore?: {
    home: { runs: number; wickets: number; overs: number };
    away: { runs: number; wickets: number; overs: number };
  };
  score?: {
    home: number;
    away: number;
  };
  format?: string;
  league?: string;
  venue?: { name: string; city: string };
};

async function fetchHeroData() {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const [newsRes, trendingRes, cricketLiveRes, footballLiveRes] = await Promise.allSettled([
      fetch(`${base}/api/v1/news?limit=5&state=published`, { cache: 'no-store', next: { revalidate: 0 } }),
      fetch(`${base}/api/v1/news/trending?limit=4`, { cache: 'no-store', next: { revalidate: 0 } }),
      fetch(`${base}/api/v1/cricket/matches/live`, { cache: 'no-store', next: { revalidate: 0 } }),
      fetch(`${base}/api/v1/football/matches/live`, { cache: 'no-store', next: { revalidate: 0 } }),
    ]);

    let articles: Article[] = [];
    if (newsRes.status === 'fulfilled' && newsRes.value.ok) {
      const newsData = await newsRes.value.json();
      articles = newsData?.data?.items || [];
    }
    if (articles.length === 0 && trendingRes.status === 'fulfilled' && trendingRes.value.ok) {
      const trendingData = await trendingRes.value.json();
      articles = trendingData?.data || [];
    }

    const featuredArticle = articles.length > 0 ? articles[0] : null;
    const secondaryArticles = articles.slice(1, 4);

    // Combine cricket and football live matches
    let allLiveMatches: LiveMatch[] = [];
    
    // Fetch cricket live matches
    if (cricketLiveRes.status === 'fulfilled' && cricketLiveRes.value.ok) {
      const cricketData = await cricketLiveRes.value.json();
      const cricketMatches = Array.isArray(cricketData?.data) ? cricketData.data : [];
      // Filter to show only cricket matches (exclude football)
      const cricketLiveMatches = cricketMatches.filter((match: LiveMatch) => 
        match.format && !match.league
      );
      allLiveMatches = [...allLiveMatches, ...cricketLiveMatches];
    }
    
    // Fetch football live matches
    if (footballLiveRes.status === 'fulfilled' && footballLiveRes.value.ok) {
      const footballData = await footballLiveRes.value.json();
      const footballMatches = Array.isArray(footballData?.data) ? footballData.data : [];
      // Filter to show only football matches (has league, no format)
      const footballLiveMatches = footballMatches.filter((match: LiveMatch) => 
        match.league && !match.format
      );
      allLiveMatches = [...allLiveMatches, ...footballLiveMatches];
    }
    
    if (allLiveMatches.length > 0) {
      // Sort by status: live first, then by start time
      allLiveMatches.sort((a, b) => {
        if (a.status === 'live' && b.status !== 'live') return -1;
        if (a.status !== 'live' && b.status === 'live') return 1;
        return 0;
      });
    } else {
      // If no live matches, fetch last completed matches (most recent first)
      try {
        const [cricketCompletedRes, footballCompletedRes] = await Promise.allSettled([
          fetch(`${base}/api/v1/cricket/matches/results?limit=4&page=1`, { cache: 'no-store', next: { revalidate: 0 } }),
          fetch(`${base}/api/v1/football/matches/results?limit=4&page=1`, { cache: 'no-store', next: { revalidate: 0 } }),
        ]);
        
        let completedMatches: LiveMatch[] = [];
        
        // Fetch cricket completed matches
        if (cricketCompletedRes.status === 'fulfilled' && cricketCompletedRes.value.ok) {
          const cricketData = await cricketCompletedRes.value.json();
          const cricketResults = cricketData?.data?.results || [];
          const cricketCompleted = cricketResults
            .filter((match: LiveMatch) => match.format && !match.league)
            .map((match: LiveMatch) => ({ ...match, status: 'completed' as const }));
          completedMatches = [...completedMatches, ...cricketCompleted];
        }
        
        // Fetch football completed matches
        if (footballCompletedRes.status === 'fulfilled' && footballCompletedRes.value.ok) {
          const footballData = await footballCompletedRes.value.json();
          const footballResults = footballData?.data?.results || [];
          const footballCompleted = footballResults
            .filter((match: LiveMatch) => match.league && !match.format)
            .map((match: LiveMatch) => ({ ...match, status: 'completed' as const }));
          completedMatches = [...completedMatches, ...footballCompleted];
        }
        
        if (completedMatches.length > 0) {
          // Sort by start time (most recent first) and take last 4-5 matches
          completedMatches.sort((a, b) => {
            const dateA = new Date(a.startTime || 0).getTime();
            const dateB = new Date(b.startTime || 0).getTime();
            return dateB - dateA; // Most recent first
          });
          allLiveMatches = completedMatches.slice(0, 4);
        }
      } catch (error) {
        console.error('Error fetching completed matches:', error);
      }
    }

    return {
      featuredArticle,
      secondaryArticles,
      liveMatches: allLiveMatches.slice(0, 4),
    };
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return {
      featuredArticle: null,
      secondaryArticles: [],
      liveMatches: [],
    };
  }
}

export async function HeroSectionWrapper() {
  const { featuredArticle, secondaryArticles, liveMatches } = await fetchHeroData();
  
  return (
    <HeroSection
      featuredArticle={featuredArticle}
      secondaryArticles={secondaryArticles}
      liveMatches={liveMatches}
    />
  );
}

