import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Query Keys
export const QUERY_KEYS = {
  cricket: {
    matches: ['cricket', 'matches'] as const,
    liveMatches: ['cricket', 'matches', 'live'] as const,
    upcomingMatches: ['cricket', 'matches', 'upcoming'] as const,
    series: ['cricket', 'series'] as const,
    teams: ['cricket', 'teams'] as const,
    players: ['cricket', 'players'] as const,
  },
  football: {
    matches: ['football', 'matches'] as const,
    liveMatches: ['football', 'matches', 'live'] as const,
    upcomingMatches: ['football', 'matches', 'upcoming'] as const,
    leagues: ['football', 'leagues'] as const,
    teams: ['football', 'teams'] as const,
    players: ['football', 'players'] as const,
  },
  content: {
    all: ['content'] as const,
    featured: ['content', 'featured'] as const,
    byType: (type: string) => ['content', type] as const,
  },
} as const;

// Cricket API Functions
export const cricketApi = {
  // Get live cricket matches
  getLiveMatches: async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/cricket/matches/live`);
    return data;
  },

  // Get upcoming cricket matches
  getUpcomingMatches: async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/cricket/matches/upcoming`);
    return data;
  },

  // Get cricket series
  getSeries: async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/cricket/series`);
    return data;
  },

  // Get cricket teams
  getTeams: async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/cricket/teams`);
    return data;
  },

  // Get cricket players
  getPlayers: async (teamId?: string) => {
    const url = teamId 
      ? `${API_BASE_URL}/api/cricket/teams/${teamId}/players`
      : `${API_BASE_URL}/api/cricket/players`;
    const { data } = await axios.get(url);
    return data;
  },
};

// Football API Functions
export const footballApi = {
  // Get live football matches
  getLiveMatches: async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/football/matches/live`);
    return data;
  },

  // Get upcoming football matches
  getUpcomingMatches: async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/football/matches/upcoming`);
    return data;
  },

  // Get football leagues
  getLeagues: async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/football/leagues`);
    return data;
  },

  // Get football teams
  getTeams: async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/football/teams`);
    return data;
  },

  // Get football players
  getPlayers: async (teamId?: string) => {
    const url = teamId 
      ? `${API_BASE_URL}/api/football/teams/${teamId}/players`
      : `${API_BASE_URL}/api/football/players`;
    const { data } = await axios.get(url);
    return data;
  },
};

// Content API Functions
export const contentApi = {
  // Get featured content
  getFeatured: async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/content/featured`);
    return data;
  },

  // Get content by type
  getByType: async (type: string) => {
    const { data } = await axios.get(`${API_BASE_URL}/api/content?type=${type}`);
    return data;
  },

  // Get all content
  getAll: async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/content`);
    return data;
  },
};

// Cricket Hooks
export const useCricketLiveMatches = () => {
  return useQuery({
    queryKey: QUERY_KEYS.cricket.liveMatches,
    queryFn: cricketApi.getLiveMatches,
    staleTime: 30 * 1000, // 30 seconds for live data
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchIntervalInBackground: true,
  });
};

export const useCricketUpcomingMatches = () => {
  return useQuery({
    queryKey: QUERY_KEYS.cricket.upcomingMatches,
    queryFn: cricketApi.getUpcomingMatches,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCricketSeries = () => {
  return useQuery({
    queryKey: QUERY_KEYS.cricket.series,
    queryFn: cricketApi.getSeries,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCricketTeams = () => {
  return useQuery({
    queryKey: QUERY_KEYS.cricket.teams,
    queryFn: cricketApi.getTeams,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useCricketPlayers = (teamId?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.cricket.players, teamId],
    queryFn: () => cricketApi.getPlayers(teamId),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Football Hooks
export const useFootballLiveMatches = () => {
  return useQuery({
    queryKey: QUERY_KEYS.football.liveMatches,
    queryFn: footballApi.getLiveMatches,
    staleTime: 30 * 1000, // 30 seconds for live data
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchIntervalInBackground: true,
  });
};

export const useFootballUpcomingMatches = () => {
  return useQuery({
    queryKey: QUERY_KEYS.football.upcomingMatches,
    queryFn: footballApi.getUpcomingMatches,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFootballLeagues = () => {
  return useQuery({
    queryKey: QUERY_KEYS.football.leagues,
    queryFn: footballApi.getLeagues,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useFootballTeams = () => {
  return useQuery({
    queryKey: QUERY_KEYS.football.teams,
    queryFn: footballApi.getTeams,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useFootballPlayers = (teamId?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.football.players, teamId],
    queryFn: () => footballApi.getPlayers(teamId),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Content Hooks
export const useFeaturedContent = () => {
  return useQuery({
    queryKey: QUERY_KEYS.content.featured,
    queryFn: contentApi.getFeatured,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useContentByType = (type: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.content.byType(type),
    queryFn: () => contentApi.getByType(type),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Prefetching Hooks for Performance
export const usePrefetchCricketData = () => {
  const queryClient = useQueryClient();

  const prefetchCricketData = () => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.cricket.liveMatches,
      queryFn: cricketApi.getLiveMatches,
      staleTime: 30 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.cricket.upcomingMatches,
      queryFn: cricketApi.getUpcomingMatches,
      staleTime: 5 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.cricket.series,
      queryFn: cricketApi.getSeries,
      staleTime: 10 * 60 * 1000,
    });
  };

  return { prefetchCricketData };
};

export const usePrefetchFootballData = () => {
  const queryClient = useQueryClient();

  const prefetchFootballData = () => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.football.liveMatches,
      queryFn: footballApi.getLiveMatches,
      staleTime: 30 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.football.upcomingMatches,
      queryFn: footballApi.getUpcomingMatches,
      staleTime: 5 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.football.leagues,
      queryFn: footballApi.getLeagues,
      staleTime: 30 * 60 * 1000,
    });
  };

  return { prefetchFootballData };
};

// Cache Management
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  const invalidateCricketQueries = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cricket.matches });
  };

  const invalidateFootballQueries = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.football.matches });
  };

  const invalidateAllQueries = () => {
    queryClient.invalidateQueries();
  };

  return {
    invalidateCricketQueries,
    invalidateFootballQueries,
    invalidateAllQueries,
  };
};
