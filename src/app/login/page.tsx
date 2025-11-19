'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch } from '@/hooks/redux';
import { loginSuccess } from '@/store/slices/authSlice';
import { Button, Input, Card, Container } from '@/components/ui';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || 'Login failed');
        return;
      }
      dispatch(loginSuccess(json.data));
      
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', json.data.token);
        localStorage.setItem('refreshToken', json.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(json.data.user));
      }
      
      toast.success('Login successful!');
      // Redirect to admin if admin role, otherwise home
      if (json.data.user.role === 'admin' || json.data.user.role === 'moderator' || json.data.user.role === 'editor' || json.data.user.role === 'writer') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <Container size="sm">
        <Card className="max-w-md mx-auto" padding="lg">
          <div className="text-center mb-8">
            <h1 className="heading-2 mb-2">Welcome Back</h1>
            <p className="body-text text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
              placeholder="admin@onescore.com"
            />

            <Input
              type="password"
              label="Password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
              placeholder="••••••••"
            />

            <Button
              type="submit"
              isLoading={loading}
              fullWidth
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link href="/register" className="text-emerald-600 hover:underline font-medium">
              Sign up
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Admin access: Use your admin credentials to access the admin panel at{' '}
              <Link href="/admin" className="text-emerald-600 hover:underline">/admin</Link>
            </p>
          </div>
        </Card>
      </Container>
    </div>
  );
}

