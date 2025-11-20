'use client';

import { CricketTeamEditor } from '@/components/admin/CricketTeamEditor';

export default function AdminCreateTeamPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <CricketTeamEditor mode="create" />
    </div>
  );
}

