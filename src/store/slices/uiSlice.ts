import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: string;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: string;
    read: boolean;
  }>;
  modals: {
    login: boolean;
    register: boolean;
    upload: boolean;
    settings: boolean;
  };
  loading: {
    global: boolean;
    auth: boolean;
    content: boolean;
    matches: boolean;
  };
  search: {
    query: string;
    filters: {
      category: string;
      type: string;
      dateRange: {
        start: string;
        end: string;
      };
    };
  };
}

const initialState: UIState = {
  sidebarOpen: false,
  theme: 'light',
  language: 'en',
  notifications: [],
  modals: {
    login: false,
    register: false,
    upload: false,
    settings: false,
  },
  loading: {
    global: false,
    auth: false,
    content: false,
    matches: false,
  },
  search: {
    query: '',
    filters: {
      category: '',
      type: '',
      dateRange: {
        start: '',
        end: '',
      },
    },
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'warning' | 'info';
      message: string;
    }>) => {
      const notification = {
        id: Date.now().toString(),
        type: action.payload.type,
        message: action.payload.message,
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(notification);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof UIState['modals']] = false;
      });
    },
    setLoading: (state, action: PayloadAction<{
      key: keyof UIState['loading'];
      value: boolean;
    }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.search.query = action.payload;
    },
    setSearchFilters: (state, action: PayloadAction<Partial<UIState['search']['filters']>>) => {
      state.search.filters = { ...state.search.filters, ...action.payload };
    },
    clearSearch: (state) => {
      state.search.query = '';
      state.search.filters = {
        category: '',
        type: '',
        dateRange: {
          start: '',
          end: '',
        },
      };
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLanguage,
  addNotification,
  markNotificationAsRead,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setLoading,
  setGlobalLoading,
  setSearchQuery,
  setSearchFilters,
  clearSearch,
} = uiSlice.actions;

export default uiSlice.reducer;
