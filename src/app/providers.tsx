'use client';

import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// React Query Devtools removed for production optimization
import { store } from '@/store';
import { SocketProvider } from '@/contexts/SocketContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthInitializer } from '@/components/auth/AuthInitializer';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Optimized for sports data
            staleTime: 30 * 1000, // 30 seconds for live data
            gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
            retry: (failureCount, error: any) => {
              // Don't retry on 404s or client errors
              if (error?.status === 404 || error?.status === 400) return false;
              // Retry up to 2 times for server errors
              return failureCount < 2;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false, // Reduce unnecessary refetches
            refetchOnReconnect: true, // Refetch when connection restored
            refetchOnMount: true, // Always refetch on mount for fresh data
            // Network mode optimization
            networkMode: 'online',
          },
          mutations: {
            retry: 1, // Retry mutations once
            retryDelay: 1000,
            networkMode: 'online',
          },
        },
        // Cache configuration removed for simplicity
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <SocketProvider>
            <AuthInitializer />
            {children}
          </SocketProvider>
        </ThemeProvider>
        {/* Devtools removed for production optimization */}
      </QueryClientProvider>
    </Provider>
  );
}
