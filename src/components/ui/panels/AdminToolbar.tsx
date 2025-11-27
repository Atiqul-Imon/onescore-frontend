import { ReactNode } from 'react';
import clsx from 'clsx';

type AdminToolbarProps = {
  children: ReactNode;
  className?: string;
  stackOnMobile?: boolean;
};

/**
 * Toolbar wrapper that spaces filters, search inputs, and action buttons consistently.
 */
export function AdminToolbar({
  children,
  className = '',
  stackOnMobile = true,
}: AdminToolbarProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-slate-200 bg-white px-4 py-3',
        stackOnMobile
          ? 'flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'
          : 'flex items-center justify-between gap-3 flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
}

