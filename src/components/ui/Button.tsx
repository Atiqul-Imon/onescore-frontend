import { ButtonHTMLAttributes, ReactElement, ReactNode, cloneElement, isValidElement } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
}

/**
 * Standardized Button component with consistent styling
 * 
 * Variants:
 * - primary: primary-600 background (default)
 * - secondary: gray background
 * - outline: border with transparent background
 * - ghost: transparent with hover effect
 * - danger: red background
 * 
 * Sizes:
 * - sm: small (h-8 px-3 text-xs)
 * - md: medium (h-10 px-4) - default
 * - lg: large (h-12 px-6 text-base)
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  asChild = false,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-500 text-secondary-900 hover:bg-primary-600 active:bg-primary-700',
    secondary: 'bg-secondary-700 text-white hover:bg-secondary-800 active:bg-secondary-900',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100',
    ghost: 'text-primary-600 hover:bg-primary-50 active:bg-primary-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const combinedClasses = clsx(baseClasses, variantClasses[variant], sizeClasses[size], widthClass, className);
  const isDisabled = disabled || isLoading;

  const renderLoadingState = () => (
    <>
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      Loading...
    </>
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; children?: ReactNode }>;
    return cloneElement(child, {
      className: clsx(combinedClasses, child.props?.className),
      ...props,
      ...(isDisabled ? { 'aria-disabled': true } : {}),
      children: isLoading ? renderLoadingState() : (child.props?.children ?? child.props.children),
    } as any);
  }

  return (
    <button
      className={combinedClasses}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? renderLoadingState() : children}
    </button>
  );
}

