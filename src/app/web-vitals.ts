/**
 * Web Vitals reporting
 * Reports Core Web Vitals metrics to analytics
 */

import { reportWebVitals } from '@/lib/performance';
import type { Metric } from 'web-vitals';

/**
 * Reports Web Vitals metrics
 * This function is called by Next.js automatically
 * 
 * @param metric - Web Vital metric from web-vitals library
 */
export function reportWebVital(metric: Metric): void {
  reportWebVitals({
    id: metric.id,
    name: metric.name as 'CLS' | 'FCP' | 'LCP' | 'TTFB' | 'INP',
    value: metric.value,
    rating: metric.rating as 'good' | 'needs-improvement' | 'poor',
    delta: metric.delta,
    navigationType: metric.navigationType || 'navigate',
  });
}

