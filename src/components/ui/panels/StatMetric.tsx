type StatMetricProps = {
  label: string;
  value: string | number;
  trend?: string;
  icon?: React.ReactNode;
};

/**
 * Lightweight KPI metric card for admin tables/toolbars.
 */
export function StatMetric({ label, value, trend, icon }: StatMetricProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      {icon && <div className="text-primary-600">{icon}</div>}
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        {trend && <p className="text-xs text-slate-500">{trend}</p>}
      </div>
    </div>
  );
}

