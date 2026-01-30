'use client';

/**
 * WebVitalsReporter - Client component for reporting Web Vitals
 * Automatically reports Core Web Vitals metrics
 */

import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import { reportWebVital } from '@/app/web-vitals';

/**
 * WebVitalsReporter component
 * Reports Core Web Vitals metrics when they become available
 * 
 * @example
 * ```tsx
 * <WebVitalsReporter />
 * ```
 */
export function WebVitalsReporter(): null {
  useEffect(() => {
    // Report all Core Web Vitals
    // Note: FID is deprecated, replaced by INP (Interaction to Next Paint)
    onCLS(reportWebVital);
    onFCP(reportWebVital);
    onLCP(reportWebVital);
    onTTFB(reportWebVital);
    onINP(reportWebVital); // Replaces FID
  }, []);

  // This component doesn't render anything
  return null;
}

