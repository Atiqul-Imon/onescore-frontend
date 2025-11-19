import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FootballMatch {
  _id: string;
  matchId: string;
  league: string;
  season: string;
  teams: {
    home: {
      id: string;
      name: string;
      logo: string;
      shortName: string;
    };
    away: {
      id: string;
      name: string;
      logo: string;
      shortName: string;
    };
  };
  venue: {
    name: string;
    city: string;
    country: string;
    capacity?: number;
  };
  status: 'live' | 'finished' | 'scheduled' | 'postponed' | 'cancelled';
  startTime: string;
  endTime?: string;
  score: {
    home: number;
    away: number;
    halftime?: {
      home: number;
      away: number;
    };
  };
  events: Array<{
    id: string;
    type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'own_goal';
    player: string;
    team: string;
    minute: number;
    description: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface FootballState {
  matches: FootballMatch[];
  liveMatches: FootballMatch[];
  fixtures: FootballMatch[];
  results: FootballMatch[];
  currentMatch: FootballMatch | null;
  leagues: string[];
  teams: Array<{
    id: string;
    name: string;
    shortName: string;
    logo: string;
    matchCount: number;
  }>;
  players: Array<{
    id: string;
    name: string;
    position: string;
    team: string;
    matchCount: number;
  }>;
  stats: {
    totalMatches: number;
    liveMatches: number;
    completedMatches: number;
    upcomingMatches: number;
    totalGoals: number;
  };
  isLoading: boolean;
  error: string | null;
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

const initialState: FootballState = {
  matches: [],
  liveMatches: [],
  fixtures: [],
  results: [],
  currentMatch: null,
  leagues: [],
  teams: [],
  players: [],
  stats: {
    totalMatches: 0,
    liveMatches: 0,
    completedMatches: 0,
    upcomingMatches: 0,
    totalGoals: 0,
  },
  isLoading: false,
  error: null,
  pagination: {
    current: 1,
    pages: 0,
    total: 0,
    limit: 20,
  },
};

export const footballSlice = createSlice({
  name: 'football',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setMatches: (state, action: PayloadAction<FootballMatch[]>) => {
      state.matches = action.payload;
    },
    setLiveMatches: (state, action: PayloadAction<FootballMatch[]>) => {
      state.liveMatches = action.payload;
    },
    setFixtures: (state, action: PayloadAction<FootballMatch[]>) => {
      state.fixtures = action.payload;
    },
    setResults: (state, action: PayloadAction<FootballMatch[]>) => {
      state.results = action.payload;
    },
    setCurrentMatch: (state, action: PayloadAction<FootballMatch | null>) => {
      state.currentMatch = action.payload;
    },
    updateMatch: (state, action: PayloadAction<FootballMatch>) => {
      const index = state.matches.findIndex(match => match._id === action.payload._id);
      if (index !== -1) {
        state.matches[index] = action.payload;
      }
      
      const liveIndex = state.liveMatches.findIndex(match => match._id === action.payload._id);
      if (liveIndex !== -1) {
        state.liveMatches[liveIndex] = action.payload;
      }
      
      if (state.currentMatch && state.currentMatch._id === action.payload._id) {
        state.currentMatch = action.payload;
      }
    },
    setLeagues: (state, action: PayloadAction<string[]>) => {
      state.leagues = action.payload;
    },
    setTeams: (state, action: PayloadAction<Array<{
      id: string;
      name: string;
      shortName: string;
      logo: string;
      matchCount: number;
    }>>) => {
      state.teams = action.payload;
    },
    setPlayers: (state, action: PayloadAction<Array<{
      id: string;
      name: string;
      position: string;
      team: string;
      matchCount: number;
    }>>) => {
      state.players = action.payload;
    },
    setStats: (state, action: PayloadAction<{
      totalMatches: number;
      liveMatches: number;
      completedMatches: number;
      upcomingMatches: number;
      totalGoals: number;
    }>) => {
      state.stats = action.payload;
    },
    setPagination: (state, action: PayloadAction<{
      current: number;
      pages: number;
      total: number;
      limit: number;
    }>) => {
      state.pagination = action.payload;
    },
    addMatch: (state, action: PayloadAction<FootballMatch>) => {
      state.matches.unshift(action.payload);
    },
    removeMatch: (state, action: PayloadAction<string>) => {
      state.matches = state.matches.filter(match => match._id !== action.payload);
      state.liveMatches = state.liveMatches.filter(match => match._id !== action.payload);
    },
    clearMatches: (state) => {
      state.matches = [];
      state.liveMatches = [];
      state.fixtures = [];
      state.results = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setMatches,
  setLiveMatches,
  setFixtures,
  setResults,
  setCurrentMatch,
  updateMatch,
  setLeagues,
  setTeams,
  setPlayers,
  setStats,
  setPagination,
  addMatch,
  removeMatch,
  clearMatches,
  clearError,
} = footballSlice.actions;

export default footballSlice.reducer;
