'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';

// Force dynamic rendering - no SSR for admin pages
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}


