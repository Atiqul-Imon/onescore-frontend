'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Ensure component only runs on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client side after mount
    if (!mounted || typeof window === 'undefined') return;

    async function checkAuth() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${base}/api/v1/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (!res.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }

        const json = await res.json();
        const role = json?.data?.role;
        const allowed = role === 'admin' || role === 'moderator' || role === 'editor' || role === 'writer';

        if (!allowed) {
          router.push('/');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router, mounted]);

  // Don't render anything during SSR
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center bg-gray-50 dark:bg-gray-950 min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Access restricted</h1>
          <p className="text-gray-600 dark:text-gray-400">Please log in with an authorized account to access Admin.</p>
          <a href="/login" className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

