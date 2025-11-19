import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'interactive' | 'compact';
  padding?: 'none' | 'sm' | 'md' | 'lg';
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
}: CardProps) {
  const baseClasses = 'rounded-lg border border-gray-200 bg-white';
  
  const variantClasses = {
    default: 'shadow-sm',
    interactive: 'shadow-sm hover:shadow-md transition-shadow cursor-pointer',
    compact: 'shadow-sm',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}

