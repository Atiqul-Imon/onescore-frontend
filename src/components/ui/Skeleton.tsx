'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Base Skeleton component for loading states
 */
export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer', // We'll add this animation
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        'bg-gray-200',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
}

/**
 * Skeleton for match cards - matches actual card layout
 */
export function MatchCardSkeleton() {
  return (
    <div className="card-interactive p-4 sm:p-6 space-y-4 sm:space-y-5">
      {/* Header with badge and time */}
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <Skeleton variant="rounded" className="h-6 w-20 sm:w-24" />
        <Skeleton variant="text" className="h-4 w-16 sm:w-20" />
      </div>

      {/* Teams and scores */}
      <div className="space-y-3 sm:space-y-4">
        {/* Home team */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Skeleton variant="circular" className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-1">
              <Skeleton variant="text" className="h-4 w-24 sm:w-32" />
              <Skeleton variant="text" className="h-3 w-16 sm:w-20" />
            </div>
          </div>
          <div className="flex-shrink-0 text-right space-y-1">
            <Skeleton variant="text" className="h-5 w-12 sm:w-16" />
            <Skeleton variant="text" className="h-3 w-10 sm:w-14" />
          </div>
        </div>

        {/* Away team */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Skeleton variant="circular" className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-1">
              <Skeleton variant="text" className="h-4 w-24 sm:w-32" />
              <Skeleton variant="text" className="h-3 w-16 sm:w-20" />
            </div>
          </div>
          <div className="flex-shrink-0 text-right space-y-1">
            <Skeleton variant="text" className="h-5 w-12 sm:w-16" />
            <Skeleton variant="text" className="h-3 w-10 sm:w-14" />
          </div>
        </div>
      </div>

      {/* Venue info */}
      <div className="rounded-xl bg-gray-50 p-3 sm:p-4 space-y-2">
        <Skeleton variant="text" className="h-3 w-32 sm:w-40" />
        <Skeleton variant="text" className="h-3 w-24 sm:w-32" />
      </div>

      {/* CTA button */}
      <Skeleton variant="rounded" className="h-10 sm:h-12 w-full" />
    </div>
  );
}

/**
 * Skeleton for scorecard tables
 */
export function ScorecardSkeleton() {
  return (
    <div className="card-elevated p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <Skeleton variant="text" className="h-5 w-40 sm:w-48" />
        <Skeleton variant="text" className="h-4 w-32 sm:w-40" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-x-auto">
        <div className="min-w-full space-y-2">
          {/* Table header */}
          <div className="flex gap-2 sm:gap-4 pb-2 border-b-2 border-gray-200">
            <Skeleton variant="text" className="h-4 w-24 sm:w-32 flex-1" />
            <Skeleton variant="text" className="h-4 w-12" />
            <Skeleton variant="text" className="h-4 w-12" />
            <Skeleton variant="text" className="h-4 w-12" />
            <Skeleton variant="text" className="h-4 w-12" />
            <Skeleton variant="text" className="h-4 w-12" />
            <Skeleton variant="text" className="h-4 w-16" />
          </div>

          {/* Table rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-2 sm:gap-4 py-2 sm:py-3">
              <Skeleton variant="text" className="h-4 w-28 sm:w-36 flex-1" />
              <Skeleton variant="text" className="h-4 w-12" />
              <Skeleton variant="text" className="h-4 w-12" />
              <Skeleton variant="text" className="h-4 w-12" />
              <Skeleton variant="text" className="h-4 w-12" />
              <Skeleton variant="text" className="h-4 w-12" />
              <Skeleton variant="text" className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for match detail page header
 */
export function MatchHeaderSkeleton() {
  return (
    <div className="bg-gradient-to-b from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Back button and actions */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Skeleton variant="rounded" className="h-8 w-20 sm:w-24 bg-white/20" />
          <div className="flex gap-2">
            <Skeleton variant="circular" className="h-10 w-10 bg-white/20" />
            <Skeleton variant="circular" className="h-10 w-10 bg-white/20" />
            <Skeleton variant="circular" className="h-10 w-10 bg-white/20" />
          </div>
        </div>

        {/* Series and format */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Skeleton variant="rounded" className="h-5 w-32 sm:w-40 bg-white/20" />
          <Skeleton variant="rounded" className="h-6 w-16 sm:w-20 bg-white/20" />
          <Skeleton variant="rounded" className="h-6 w-20 sm:w-24 bg-white/20" />
        </div>

        {/* Team names */}
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
          <Skeleton variant="text" className="h-8 sm:h-10 w-48 sm:w-64 bg-white/20" />
          <Skeleton variant="text" className="h-8 sm:h-10 w-52 sm:w-72 bg-white/20" />
        </div>

        {/* Scores */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5">
          <div className="bg-white/5 rounded-xl px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <Skeleton variant="circular" className="h-8 w-8 sm:h-10 sm:w-10 bg-white/20" />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" className="h-5 w-32 sm:w-40 bg-white/20" />
                  <Skeleton variant="text" className="h-4 w-24 sm:w-32 bg-white/20" />
                </div>
              </div>
              <Skeleton variant="text" className="h-8 w-20 sm:w-24 bg-white/20" />
            </div>
          </div>
          <div className="bg-white/5 rounded-xl px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <Skeleton variant="circular" className="h-8 w-8 sm:h-10 sm:w-10 bg-white/20" />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" className="h-5 w-32 sm:w-40 bg-white/20" />
                  <Skeleton variant="text" className="h-4 w-24 sm:w-32 bg-white/20" />
                </div>
              </div>
              <Skeleton variant="text" className="h-8 w-20 sm:w-24 bg-white/20" />
            </div>
          </div>
        </div>

        {/* Venue and date */}
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Skeleton variant="text" className="h-4 w-40 sm:w-48 bg-white/20" />
          <Skeleton variant="text" className="h-4 w-32 sm:w-40 bg-white/20" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for live score view
 */
export function LiveScoreSkeleton() {
  return (
    <div className="card-elevated p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="h-5 w-32 sm:w-40" />
        <Skeleton variant="rounded" className="h-6 w-16 sm:w-20" />
      </div>

      {/* Team scores */}
      <div className="space-y-4">
        <div className="border-b-2 border-gray-200 pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <Skeleton variant="circular" className="h-8 w-8 sm:h-10 sm:w-10" />
              <div className="space-y-2 flex-1">
                <Skeleton variant="text" className="h-5 w-32 sm:w-40" />
                <Skeleton variant="text" className="h-3 w-24 sm:w-32" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <Skeleton variant="text" className="h-6 w-16 sm:w-20" />
              <Skeleton variant="text" className="h-3 w-12 sm:w-16" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <Skeleton variant="circular" className="h-8 w-8 sm:h-10 sm:w-10" />
            <div className="space-y-2 flex-1">
              <Skeleton variant="text" className="h-5 w-32 sm:w-40" />
              <Skeleton variant="text" className="h-3 w-24 sm:w-32" />
            </div>
          </div>
          <div className="text-right space-y-1">
            <Skeleton variant="text" className="h-6 w-16 sm:w-20" />
            <Skeleton variant="text" className="h-3 w-12 sm:w-16" />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Skeleton variant="rounded" className="h-16 w-full" />
        <Skeleton variant="rounded" className="h-16 w-full" />
        <Skeleton variant="rounded" className="h-16 w-full" />
      </div>

      {/* Current batters/bowlers */}
      <div className="space-y-3">
        <Skeleton variant="text" className="h-4 w-32" />
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}




