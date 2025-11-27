'use client';

import { usePathname } from 'next/navigation';
import { Header, Footer } from '@/components/layout';

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
      {children}
      <Footer />
    </>
  );
}

