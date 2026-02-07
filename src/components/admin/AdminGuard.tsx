'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { refreshAccessToken, shouldRefreshToken } from '@/lib/auth';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

        // Check if token needs refresh before making the request
        if (shouldRefreshToken()) {
          const refreshed = await refreshAccessToken();
          if (!refreshed) {
            // If refresh fails, try one more time with the original token
            // Sometimes the token is still valid even if it's close to expiration
          }
        }

        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const currentToken = localStorage.getItem('token');
        const res = await fetch(`${base}/api/v1/auth/profile`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        // If request fails with 401, try refreshing token once more
        if (res.status === 401) {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            // Retry the request with new token
            const newToken = localStorage.getItem('token');
            const retryRes = await fetch(`${base}/api/v1/auth/profile`, {
              headers: {
                Authorization: `Bearer ${newToken}`,
                'Content-Type': 'application/json',
              },
              cache: 'no-store',
            });

            if (!retryRes.ok) {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              router.push('/login');
              return;
            }

            const retryJson = await retryRes.json();
            const role = retryJson?.data?.role;
            const allowed =
              role === 'admin' || role === 'moderator' || role === 'editor' || role === 'writer';

            if (!allowed) {
              router.push('/');
              return;
            }

            setIsAuthorized(true);
            setLoading(false);
            return;
          } else {
            // Refresh failed, logout
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            router.push('/login');
            return;
          }
        }

        if (!res.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }

        const json = await res.json();
        const role = json?.data?.role;
        const allowed =
          role === 'admin' || role === 'moderator' || role === 'editor' || role === 'writer';

        if (!allowed) {
          router.push('/');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        // On error, try refreshing token once before logging out
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          router.push('/login');
        } else {
          // If refresh succeeded, retry auth check
          checkAuth();
          return;
        }
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    // Set up periodic token refresh (every 10 minutes)
    refreshIntervalRef.current = setInterval(
      async () => {
        if (shouldRefreshToken()) {
          await refreshAccessToken();
        }
      },
      10 * 60 * 1000
    ); // 10 minutes

    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
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
          <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
            Access restricted
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in with an authorized account to access Admin.
          </p>
          <a
            href="/login"
            className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
