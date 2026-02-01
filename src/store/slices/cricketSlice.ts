import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CricketMatch {
  _id: string;
  matchId: string;
  series: string;
  teams: {
    home: {
      id: string;
      name: string;
      flag: string;
      shortName: string;
    };
    away: {
      id: string;
      name: string;
      flag: string;
      shortName: string;
    };
  };
  venue: {
    name: string;
    city: string;
    country: string;
    capacity?: number;
    address?: string;
  };
  status: 'live' | 'completed' | 'upcoming' | 'cancelled';
  format: 'test' | 'odi' | 't20i' | 't20' | 'first-class' | 'list-a';
  startTime: string;
  endTime?: string;
  currentScore?: {
    home: {
      runs: number;
      wickets: number;
      overs: number;
      balls: number;
    };
    away: {
      runs: number;
      wickets: number;
      overs: number;
      balls: number;
    };
  };
  liveData?: {
    currentOver: number;
    currentBatsman: string;
    currentBowler: string;
    lastBall: string;
    requiredRunRate?: number;
    currentRunRate?: number;
  };
  innings?: Array<{
    number: number;
    team: string;
    runs: number;
    wickets: number;
    overs: number;
    balls: number;
    runRate: number;
  }>;
  players?: Array<{
    id: string;
    name: string;
    team: string;
    role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
    runs?: number;
    balls?: number;
    wickets?: number;
    overs?: number;
    economy?: number;
  }>;
  // Local match fields
  isLocalMatch?: boolean;
  matchType?: 'international' | 'franchise' | 'local' | 'hyper-local';
  localLocation?: {
    country: string;
    state?: string;
    city: string;
    district?: string;
    area?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  localLeague?: {
    id: string;
    name: string;
    level: 'national' | 'state' | 'district' | 'city' | 'ward' | 'club';
    season: string;
    year: number;
  };
  scorerInfo?: {
    scorerId: string;
    scorerName: string;
    scorerType: 'official' | 'volunteer' | 'community';
    lastUpdate: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
  };
  isVerified?: boolean;
  matchNote?: string;
  createdAt: string;
  updatedAt: string;
}

interface CricketState {
  matches: CricketMatch[];
  liveMatches: CricketMatch[];
  fixtures: CricketMatch[];
  results: CricketMatch[];
  currentMatch: CricketMatch | null;
  series: string[];
  teams: Array<{
    id: string;
    name: string;
    shortName: string;
    flag: string;
    matchCount: number;
  }>;
  players: Array<{
    id: string;
    name: string;
    role: string;
    team: string;
    totalRuns: number;
    totalWickets: number;
    matchCount: number;
  }>;
  stats: {
    totalMatches: number;
    liveMatches: number;
    completedMatches: number;
    upcomingMatches: number;
    totalRuns: number;
    totalWickets: number;
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

const initialState: CricketState = {
  matches: [],
  liveMatches: [],
  fixtures: [],
  results: [],
  currentMatch: null,
  series: [],
  teams: [],
  players: [],
  stats: {
    totalMatches: 0,
    liveMatches: 0,
    completedMatches: 0,
    upcomingMatches: 0,
    totalRuns: 0,
    totalWickets: 0,
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

export const cricketSlice = createSlice({
  name: 'cricket',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setMatches: (state, action: PayloadAction<CricketMatch[]>) => {
      state.matches = action.payload;
    },
    setLiveMatches: (state, action: PayloadAction<CricketMatch[]>) => {
      state.liveMatches = action.payload;
    },
    setFixtures: (state, action: PayloadAction<CricketMatch[]>) => {
      state.fixtures = action.payload;
    },
    setResults: (state, action: PayloadAction<CricketMatch[]>) => {
      state.results = action.payload;
    },
    setCurrentMatch: (state, action: PayloadAction<CricketMatch | null>) => {
      state.currentMatch = action.payload;
    },
    updateMatch: (state, action: PayloadAction<CricketMatch>) => {
      const index = state.matches.findIndex((match) => match._id === action.payload._id);
      if (index !== -1) {
        state.matches[index] = action.payload;
      }

      const liveIndex = state.liveMatches.findIndex((match) => match._id === action.payload._id);
      if (liveIndex !== -1) {
        state.liveMatches[liveIndex] = action.payload;
      }

      if (state.currentMatch && state.currentMatch._id === action.payload._id) {
        state.currentMatch = action.payload;
      }
    },
    setSeries: (state, action: PayloadAction<string[]>) => {
      state.series = action.payload;
    },
    setTeams: (
      state,
      action: PayloadAction<
        Array<{
          id: string;
          name: string;
          shortName: string;
          flag: string;
          matchCount: number;
        }>
      >
    ) => {
      state.teams = action.payload;
    },
    setPlayers: (
      state,
      action: PayloadAction<
        Array<{
          id: string;
          name: string;
          role: string;
          team: string;
          totalRuns: number;
          totalWickets: number;
          matchCount: number;
        }>
      >
    ) => {
      state.players = action.payload;
    },
    setStats: (
      state,
      action: PayloadAction<{
        totalMatches: number;
        liveMatches: number;
        completedMatches: number;
        upcomingMatches: number;
        totalRuns: number;
        totalWickets: number;
      }>
    ) => {
      state.stats = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<{
        current: number;
        pages: number;
        total: number;
        limit: number;
      }>
    ) => {
      state.pagination = action.payload;
    },
    addMatch: (state, action: PayloadAction<CricketMatch>) => {
      state.matches.unshift(action.payload);
    },
    removeMatch: (state, action: PayloadAction<string>) => {
      state.matches = state.matches.filter((match) => match._id !== action.payload);
      state.liveMatches = state.liveMatches.filter((match) => match._id !== action.payload);
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
  setSeries,
  setTeams,
  setPlayers,
  setStats,
  setPagination,
  addMatch,
  removeMatch,
  clearMatches,
  clearError,
} = cricketSlice.actions;

export default cricketSlice.reducer;
