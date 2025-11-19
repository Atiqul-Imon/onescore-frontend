import { Middleware } from '@reduxjs/toolkit';
import { loginSuccess, logout } from '../slices/authSlice';

export const authMiddleware: Middleware = (store) => (next) => (action) => {
  // Clear localStorage on logout
  if (logout.match(action)) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // Update localStorage when login/register succeeds
  if (loginSuccess.match(action)) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    }
  }

  return next(action);
};

