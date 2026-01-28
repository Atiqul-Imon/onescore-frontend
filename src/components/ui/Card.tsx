import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'interactive' | 'compact' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

/**
 * Standardized Card component with consistent styling
 * 
 * Variants:
 * - default: Standard card with shadow
 * - interactive: Hover effects for clickable cards
 * - compact: Less padding for dense layouts
 * 
 * Padding:
 * - none: No padding
 * - sm: p-4
 * - md: p-6 (default)
 * - lg: p-8
 */
export function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  elevation,
}: CardProps) {
  // Use elevation prop if provided, otherwise use variant defaults
  const elevationClasses = {
    0: 'card-elevation-0',
    1: 'card-elevation-1',
    2: 'card-elevation-2',
    3: 'card-elevation-3',
    4: 'card-elevation-4',
    5: 'card-elevation-5',
  };

  const variantClasses = {
    default: 'card-default',
    interactive: 'card-interactive',
    compact: 'card-elevation-1',
    elevated: 'card-elevated',
    outlined: 'card-outlined',
    filled: 'card-filled',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  // Determine elevation class
  const elevationClass = elevation !== undefined 
    ? elevationClasses[elevation] 
    : variantClasses[variant];

  return (
    <div className={`${elevationClass} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}

