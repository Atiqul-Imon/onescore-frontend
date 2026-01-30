import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'interactive' | 'compact' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

/**
 * Card - Standardized card component with consistent styling and variants
 * 
 * Provides a flexible container with multiple variants, padding options, and elevation levels.
 * Used for displaying content in a structured, visually consistent manner.
 * 
 * @param props - Card component props
 * @param props.children - Card content (ReactNode)
 * @param props.className - Additional CSS classes
 * @param props.variant - Card style variant ('default' | 'interactive' | 'compact' | 'elevated' | 'outlined' | 'filled')
 * @param props.padding - Padding size ('none' | 'sm' | 'md' | 'lg')
 * @param props.elevation - Shadow elevation level (0-5), overrides variant default
 * @returns Card container element
 * 
 * @example
 * ```tsx
 * <Card variant="default" padding="md">
 *   <h2>Card Title</h2>
 *   <p>Card content</p>
 * </Card>
 * 
 * <Card variant="interactive" padding="lg" elevation={3}>
 *   Clickable card content
 * </Card>
 * ```
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

