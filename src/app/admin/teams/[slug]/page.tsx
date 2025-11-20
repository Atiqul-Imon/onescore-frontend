'use client';

import { useParams } from 'next/navigation';
import { CricketTeamEditor } from '@/components/admin/CricketTeamEditor';

export default function AdminTeamEditPage() {
  const params = useParams() as { slug: string };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Team Intelligence</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Edit team hub</h1>
        <p className="mt-2 text-sm text-slate-500">Slug: {params.slug}</p>
      </div>
      <CricketTeamEditor mode="edit" slug={params.slug} />
    </div>
  );
}

