/**
 * Lazy-loaded admin components
 * These components are code-split and only loaded on admin pages
 */

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Lazy-loaded RichTextEditor component
 * Heavy component with CKEditor (already uses dynamic import internally)
 */
export const LazyRichTextEditor = dynamic(
  () => import('./RichTextEditor').then((mod) => ({ default: mod.RichTextEditor })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // CKEditor doesn't support SSR
  }
);

/**
 * Lazy-loaded MediaPicker component
 * Heavy component with image upload and management
 */
export const LazyMediaPicker = dynamic(
  () => import('./MediaPicker').then((mod) => ({ default: mod.MediaPicker })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

/**
 * Lazy-loaded CricketTeamEditor component
 * Heavy component with complex form handling
 */
export const LazyCricketTeamEditor = dynamic(
  () => import('./CricketTeamEditor').then((mod) => ({ default: mod.CricketTeamEditor })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);
