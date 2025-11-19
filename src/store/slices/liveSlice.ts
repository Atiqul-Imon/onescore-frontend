import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LiveData {
  id: string;
  type: 'cricket' | 'football';
  matchId: string;
  data: any;
  timestamp: string;
}

interface LiveState {
  liveData: LiveData[];
  connections: {
    cricket: boolean;
    football: boolean;
    websocket: boolean;
  };
  lastUpdate: string | null;
  error: string | null;
}

const initialState: LiveState = {
  liveData: [],
  connections: {
    cricket: false,
    football: false,
    websocket: false,
  },
  lastUpdate: null,
  error: null,
};

export const liveSlice = createSlice({
  name: 'live',
  initialState,
  reducers: {
    addLiveData: (state, action: PayloadAction<LiveData>) => {
      const existingIndex = state.liveData.findIndex(item => item.id === action.payload.id);
      if (existingIndex !== -1) {
        state.liveData[existingIndex] = action.payload;
      } else {
        state.liveData.push(action.payload);
      }
      state.lastUpdate = action.payload.timestamp;
    },
    updateLiveData: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const item = state.liveData.find(item => item.id === action.payload.id);
      if (item) {
        item.data = action.payload.data;
        item.timestamp = new Date().toISOString();
        state.lastUpdate = item.timestamp;
      }
    },
    removeLiveData: (state, action: PayloadAction<string>) => {
      state.liveData = state.liveData.filter(item => item.id !== action.payload);
    },
    setConnectionStatus: (state, action: PayloadAction<{
      service: keyof LiveState['connections'];
      status: boolean;
    }>) => {
      state.connections[action.payload.service] = action.payload.status;
    },
    setWebSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.connections.websocket = action.payload;
    },
    setCricketConnected: (state, action: PayloadAction<boolean>) => {
      state.connections.cricket = action.payload;
    },
    setFootballConnected: (state, action: PayloadAction<boolean>) => {
      state.connections.football = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearLiveData: (state) => {
      state.liveData = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addLiveData,
  updateLiveData,
  removeLiveData,
  setConnectionStatus,
  setWebSocketConnected,
  setCricketConnected,
  setFootballConnected,
  setError,
  clearLiveData,
  clearError,
} = liveSlice.actions;

export default liveSlice.reducer;
