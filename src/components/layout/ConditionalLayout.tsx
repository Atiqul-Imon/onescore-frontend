'use client';

import { usePathname } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { MobileBottomNav } from './MobileBottomNav';

/**
 * Conditionally renders Header and Footer only on non-admin routes.
 * Admin routes have their own layout via AdminLayoutShell.
 */
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="pt-16 pb-14 md:pb-0">{children}</main>
      <Footer />
      {/* MobileBottomNav placed outside to ensure perfect fixed positioning */}
      <MobileBottomNav />
    </>
  );
}

