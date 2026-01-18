'use client';

import { ReactNode } from 'react';

type StatCardProps = {
  title: string;
  value: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  tone?: 'default' | 'positive' | 'warning';
};

const toneClasses: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'border-slate-200 bg-white text-slate-900',
  positive: 'border-primary-100 bg-primary-50 text-secondary-900',
  warning: 'border-amber-100 bg-amber-50 text-amber-900',
};

export function StatCard({
  title,
  value,
  description,
  icon,
  tone = 'default',
}: StatCardProps) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md ${toneClasses[tone]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{title}</p>
          <div className="mt-3 text-2xl font-semibold">{value}</div>
        </div>
        {icon && <div className="rounded-xl bg-white/60 p-3 text-slate-600">{icon}</div>}
      </div>
      {description && <p className="mt-3 text-sm text-slate-500">{description}</p>}
    </div>
  );
}

