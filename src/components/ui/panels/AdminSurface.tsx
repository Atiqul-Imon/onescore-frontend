import { ReactNode } from 'react';
import clsx from 'clsx';

type AdminSurfaceProps = {
  children: ReactNode;
  className?: string;
  padded?: boolean;
};

/**
 * Standard admin “surface” panel. Provides consistent border, radius, and padding.
 */
export function AdminSurface({ children, className = '', padded = true }: AdminSurfaceProps) {
  return (
    <div
      className={clsx(
        'rounded-3xl border border-slate-200 bg-white shadow-sm',
        padded && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}

