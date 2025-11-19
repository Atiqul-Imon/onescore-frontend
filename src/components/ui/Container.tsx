import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /**
   * Enable full-width mode (removes max-width constraint)
   * Useful for hero sections, backgrounds, etc.
   */
  fullWidth?: boolean;
}

/**
 * Standardized container component for consistent page layouts
 * 
 * Responsive max-widths:
 * - sm: 640px (mobile)
 * - md: 768px (tablet)
 * - lg: 1024px (desktop)
 * - xl: 1280px (large desktop) - DEFAULT
 * - 2xl: 1400px (extra large)
 * - full: 100% (no max-width)
 * 
 * Responsive padding:
 * - Mobile: 16px (px-4)
 * - Tablet: 24px (px-6)
 * - Desktop: 32px (px-8)
 * 
 * All containers are centered with mx-auto
 */
export function Container({ 
  children, 
  className = '', 
  size = 'xl',
  fullWidth = false
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-[1400px]',
    full: 'max-w-full',
  };

  // Responsive padding: mobile (16px) -> tablet (24px) -> desktop (32px)
  const paddingClasses = 'px-4 sm:px-6 lg:px-8';
  
  // If fullWidth, don't apply max-width but keep padding
  const containerClasses = fullWidth 
    ? `w-full mx-auto ${paddingClasses}`
    : `w-full mx-auto ${paddingClasses} ${sizeClasses[size]}`;

  return (
    <div className={`${containerClasses} ${className}`}>
      {children}
    </div>
  );
}

