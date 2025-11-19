'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/redux';
import { loginSuccess } from '@/store/slices/authSlice';

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Restore auth state from localStorage on app initialization
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const userStr = localStorage.getItem('user');
      
      if (token && refreshToken && userStr) {
        try {
          const user = JSON.parse(userStr);
          dispatch(loginSuccess({ user, token, refreshToken }));
        } catch (e) {
          // Invalid data, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
}

