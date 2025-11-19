import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cricketReducer from './slices/cricketSlice';
import footballReducer from './slices/footballSlice';
import contentReducer from './slices/contentSlice';
import uiReducer from './slices/uiSlice';
import liveReducer from './slices/liveSlice';
import { authMiddleware } from './middleware/authMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cricket: cricketReducer,
    football: footballReducer,
    content: contentReducer,
    ui: uiReducer,
    live: liveReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(authMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
