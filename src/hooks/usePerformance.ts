import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function usePerformance() {
  const [metrics, setMetrics] = useState({
    cacheSize: 0,
    queryCount: 0,
    memoryUsage: 0,
    networkRequests: 0,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const updateMetrics = () => {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();
      
      setMetrics({
        cacheSize: queries.length,
        queryCount: queries.filter(q => q.state.status === 'success').length,
        memoryUsage: 0, // Memory tracking removed for compatibility
        networkRequests: 0, // Network tracking simplified
      });
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, [queryClient]);

  const clearCache = () => {
    queryClient.clear();
  };

  const invalidateAll = () => {
    queryClient.invalidateQueries();
  };

  const prefetchAll = () => {
    // Prefetch critical data
    queryClient.prefetchQuery({
      queryKey: ['cricket', 'matches', 'live'],
      queryFn: () => Promise.resolve([]),
      staleTime: 30 * 1000,
    });
  };

  return {
    metrics,
    clearCache,
    invalidateAll,
    prefetchAll,
  };
}
