'use client';

import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  backHref?: string;
  className?: string;
}

/**
 * User-friendly error state component
 * Displays error messages with retry and navigation options
 */
export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content.',
  error,
  onRetry,
  showHomeButton = false,
  showBackButton = false,
  backHref = '/',
  className = '',
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : typeof error === 'string' ? error : undefined;

  return (
    <Card className={`p-6 sm:p-8 text-center ${className}`}>
      <div className="max-w-md mx-auto space-y-4 sm:space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4 sm:p-5">
            <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
          </div>
        </div>

        {/* Error Title */}
        <div>
          <h2 className="heading-3 text-gray-900 mb-2">{title}</h2>
          <p className="body-text text-gray-600">
            {message}
          </p>
          {errorMessage && (
            <p className="text-small text-gray-500 mt-2 font-mono bg-gray-50 p-2 rounded">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          {onRetry && (
            <Button
              variant="primary"
              onClick={onRetry}
              className="w-full sm:w-auto min-w-[120px]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          {showBackButton && (
            <Link href={backHref}>
              <Button
                variant="outline"
                className="w-full sm:w-auto min-w-[120px]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </Link>
          )}
          {showHomeButton && (
            <Link href="/">
              <Button
                variant="outline"
                className="w-full sm:w-auto min-w-[120px]"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * Compact error state for inline use
 */
export function ErrorStateCompact({
  message = 'Failed to load',
  onRetry,
  className = '',
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={`p-4 sm:p-6 text-center ${className}`}>
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
        <p className="text-sm sm:text-base text-gray-600">{message}</p>
        {onRetry && (
          <Button variant="primary" size="sm" onClick={onRetry}>
            <RefreshCw className="h-3 w-3 mr-2" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}




