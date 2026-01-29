/**
 * Lazy-loaded cricket components
 * These components are code-split and loaded on demand
 */

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Lazy-loaded MatchScorecard component
 * Heavy component with complex scorecard rendering
 */
export const LazyMatchScorecard = dynamic(
  () => import('./MatchScorecard').then((mod) => ({ default: mod.MatchScorecard })),
  {
    loading: () => <LoadingSpinner />,
    ssr: true, // Enable SSR for SEO
  }
);

/**
 * Lazy-loaded MatchCommentary component
 * Heavy component with real-time commentary updates
 */
export const LazyMatchCommentary = dynamic(
  () => import('./MatchCommentary').then((mod) => ({ default: mod.MatchCommentary })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Disable SSR for real-time updates
  }
);

/**
 * Lazy-loaded MatchStats component
 * Heavy component with complex statistics rendering
 */
export const LazyMatchStats = dynamic(
  () => import('./MatchStats').then((mod) => ({ default: mod.MatchStats })),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);

/**
 * Lazy-loaded TeamMatchStats component
 * Heavy component with team-specific statistics
 */
export const LazyTeamMatchStats = dynamic(
  () => import('./TeamMatchStats').then((mod) => ({ default: mod.TeamMatchStats })),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);

