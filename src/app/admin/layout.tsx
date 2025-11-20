'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayoutShell } from '@/components/admin/layout/AdminLayoutShell';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AdminGuard>
  );
}


