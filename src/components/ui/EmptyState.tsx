'use client';

import { Inbox, Search, Calendar, Trophy, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * Engaging empty state component
 * Displays helpful messages and suggests actions
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
  variant = 'default',
}: EmptyStateProps) {
  const defaultIcon = <Inbox className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />;
  const displayIcon = icon || defaultIcon;

  if (variant === 'compact') {
    return (
      <div className={`p-4 sm:p-6 text-center ${className}`}>
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <div className="text-gray-400">{displayIcon}</div>
          <h3 className="heading-4 text-gray-900">{title}</h3>
          {description && (
            <p className="text-small text-gray-600 max-w-md">{description}</p>
          )}
          {action && (
            <div className="mt-2">
              {action.href ? (
                <Link href={action.href}>
                  <Button variant="primary" size="sm">
                    {action.label}
                  </Button>
                </Link>
              ) : (
                <Button variant="primary" size="sm" onClick={action.onClick}>
                  {action.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={`p-8 sm:p-12 text-center ${className}`}>
      <div className="max-w-md mx-auto space-y-4 sm:space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-gray-100 p-4 sm:p-6">
            {displayIcon}
          </div>
        </div>

        {/* Title and Description */}
        <div>
          <h2 className="heading-3 text-gray-900 mb-2">{title}</h2>
          {description && (
            <p className="body-text text-gray-600">{description}</p>
          )}
        </div>

        {/* Action Button */}
        {action && (
          <div className="pt-2">
            {action.href ? (
              <Link href={action.href}>
                <Button variant="primary" className="min-w-[160px]">
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button variant="primary" onClick={action.onClick} className="min-w-[160px]">
                {action.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Pre-configured empty states for common scenarios
 */
export function EmptyStateNoMatches() {
  return (
    <EmptyState
      icon={<Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />}
      title="No Matches Found"
      description="There are no matches available at the moment. Check back later for live matches and upcoming fixtures."
      action={{
        label: 'View All Matches',
        href: '/cricket/results',
      }}
    />
  );
}

export function EmptyStateNoResults() {
  return (
    <EmptyState
      icon={<Search className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />}
      title="No Results Found"
      description="We couldn't find any matches matching your criteria. Try adjusting your filters or search terms."
      action={{
        label: 'Clear Filters',
        onClick: () => window.location.reload(),
      }}
    />
  );
}

export function EmptyStateNoUpcoming() {
  return (
    <EmptyState
      icon={<Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />}
      title="No Upcoming Matches"
      description="There are no upcoming matches scheduled at this time. Check back later for new fixtures."
      action={{
        label: 'View Completed Matches',
        href: '/cricket/results',
      }}
    />
  );
}

export function EmptyStateNoData() {
  return (
    <EmptyState
      icon={<AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />}
      title="No Data Available"
      description="The requested information is not available at this time. Please try again later."
    />
  );
}

