'use client';

import { CricketTeamEditor } from '@/components/admin/CricketTeamEditor';

export default function AdminCreateTeamPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Team Intelligence</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create team hub</h1>
        <p className="mt-2 text-sm text-slate-500">
          Spin up a new national page with branding, rankings, and historical data.
        </p>
      </div>
      <CricketTeamEditor mode="create" />
    </div>
  );
}

