/**
 * Performance monitoring utilities
 * Tracks Web Vitals and API performance metrics
 *
 * @module performance
 */

/**
 * Web Vitals metrics
 */
export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}

/**
 * Performance metric types
 * Note: FID is deprecated, replaced by INP (Interaction to Next Paint)
 */
export type MetricType = 'CLS' | 'FCP' | 'LCP' | 'TTFB' | 'INP';

/**
 * Performance monitoring class
 */
class PerformanceMonitor {
  private metrics: Map<string, WebVitalsMetric> = new Map();
  private apiTimings: Map<string, number> = new Map();

  /**
   * Reports a Web Vital metric
   *
   * @param metric - Web Vital metric data
   */
  reportWebVital(metric: WebVitalsMetric): void {
    this.metrics.set(metric.name, metric);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vital] ${metric.name}:`, {
        value: metric.value.toFixed(2),
        rating: metric.rating,
        id: metric.id,
      });
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metric);
    }
  }

  /**
   * Tracks API request timing
   *
   * @param endpoint - API endpoint
   * @param duration - Request duration in milliseconds
   */
  trackApiTiming(endpoint: string, duration: number): void {
    this.apiTimings.set(endpoint, duration);

    // Log slow requests (> 1 second)
    if (duration > 1000) {
      console.warn(`[Slow API] ${endpoint}: ${duration.toFixed(2)}ms`);
    }
  }

  /**
   * Gets all collected metrics
   *
   * @returns Map of all metrics
   */
  getMetrics(): Map<string, WebVitalsMetric> {
    return new Map(this.metrics);
  }

  /**
   * Gets API timing for an endpoint
   *
   * @param endpoint - API endpoint
   * @returns Timing in milliseconds or undefined
   */
  getApiTiming(endpoint: string): number | undefined {
    return this.apiTimings.get(endpoint);
  }

  /**
   * Gets average API timing
   *
   * @returns Average timing in milliseconds
   */
  getAverageApiTiming(): number {
    const timings = Array.from(this.apiTimings.values());
    if (timings.length === 0) return 0;
    return timings.reduce((sum, timing) => sum + timing, 0) / timings.length;
  }

  /**
   * Sends metric to analytics service
   * Sends Web Vitals to Google Analytics 4
   *
   * @param metric - Web Vital metric
   */
  private sendToAnalytics(metric: WebVitalsMetric): void {
    // Send to Google Analytics 4
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
        metric_rating: metric.rating,
      });
    }
  }

  /**
   * Clears all metrics (useful for testing)
   */
  clear(): void {
    this.metrics.clear();
    this.apiTimings.clear();
  }
}

/**
 * Default performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * Reports Web Vitals using Next.js web-vitals library
 * Call this in your app's root layout or _app
 *
 * @example
 * ```tsx
 * import { reportWebVitals } from '@/lib/performance';
 *
 * export function reportWebVital(metric: any) {
 *   reportWebVitals(metric);
 * }
 * ```
 */
export function reportWebVitals(metric: WebVitalsMetric): void {
  performanceMonitor.reportWebVital(metric);
}

/**
 * Creates a performance timer for measuring code execution
 *
 * @param label - Timer label
 * @returns Timer object with start/end methods
 *
 * @example
 * ```ts
 * const timer = createTimer('API Request');
 * timer.start();
 * await fetchData();
 * timer.end(); // Logs: "API Request: 123ms"
 * ```
 */
export function createTimer(label: string) {
  let startTime: number | null = null;

  return {
    start(): void {
      startTime = performance.now();
    },
    end(): number {
      if (startTime === null) {
        console.warn(`Timer "${label}" was ended without being started`);
        return 0;
      }
      const duration = performance.now() - startTime;
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
      return duration;
    },
    getDuration(): number {
      if (startTime === null) return 0;
      return performance.now() - startTime;
    },
  };
}

/**
 * Measures async function execution time
 *
 * @param fn - Async function to measure
 * @param label - Label for logging
 * @returns Wrapped function that measures execution time
 *
 * @example
 * ```ts
 * const measuredFetch = measureAsync(async () => {
 *   return await fetch('/api/data');
 * }, 'Fetch Data');
 *
 * await measuredFetch();
 * ```
 */
export function measureAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  label: string
): T {
  return (async (...args: Parameters<T>) => {
    const timer = createTimer(label);
    timer.start();
    try {
      const result = await fn(...args);
      timer.end();
      return result;
    } catch (error) {
      timer.end();
      throw error;
    }
  }) as T;
}

/**
 * Debounced performance observer for long tasks
 * Helps identify performance bottlenecks
 */
export function observeLongTasks(threshold = 50): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > threshold) {
          console.warn(`[Long Task] ${entry.duration.toFixed(2)}ms`, entry);
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });
  } catch (error) {
    // Long task observer not supported
  }
}
