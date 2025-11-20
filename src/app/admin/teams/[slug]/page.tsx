'use client';

import { useParams } from 'next/navigation';
import { CricketTeamEditor } from '@/components/admin/CricketTeamEditor';

export default function AdminTeamEditPage() {
  const params = useParams() as { slug: string };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <CricketTeamEditor mode="edit" slug={params.slug} />
    </div>
  );
}

