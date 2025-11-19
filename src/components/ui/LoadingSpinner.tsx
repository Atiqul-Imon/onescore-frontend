import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-primary-600',
          sizeClasses[size]
        )}
      />
    </div>
  );
}

export function LoadingSpinnerFullScreen() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-gray-200 rounded', className)} />
  );
}

export function LoadingCard() {
  return (
    <div className="card p-6">
      <div className="space-y-4">
        <LoadingSkeleton className="h-6 w-3/4" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-2/3" />
        <div className="flex space-x-2">
          <LoadingSkeleton className="h-8 w-20" />
          <LoadingSkeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

export function LoadingMatchCard() {
  return (
    <div className="card p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LoadingSkeleton className="h-8 w-8 rounded-full" />
            <LoadingSkeleton className="h-4 w-20" />
          </div>
          <LoadingSkeleton className="h-6 w-12" />
          <div className="flex items-center space-x-3">
            <LoadingSkeleton className="h-4 w-20" />
            <LoadingSkeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <LoadingSkeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
