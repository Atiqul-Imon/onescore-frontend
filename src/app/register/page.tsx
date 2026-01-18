'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch } from '@/hooks/redux';
import { registerSuccess } from '@/store/slices/authSlice';
import { Button, Input, Card, Container } from '@/components/ui';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.message || 'Registration failed');
        toast.error(json?.message || 'Registration failed');
        return;
      }
      dispatch(registerSuccess(json.data));
      
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', json.data.token);
        localStorage.setItem('refreshToken', json.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(json.data.user));
      }
      
      toast.success('Registration successful!');
      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
      toast.error(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <Container size="sm">
        <Card className="max-w-md mx-auto" padding="lg">
          <div className="text-center mb-8">
            <h1 className="heading-2 mb-2">Create Account</h1>
            <p className="body-text text-gray-600">Sign up to get started</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <Input
              type="text"
              label="Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoComplete="name"
              placeholder="Your name"
            />

            <Input
              type="email"
              label="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
              placeholder="your@email.com"
            />

            <Input
              type="password"
              label="Password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
              placeholder="••••••••"
              helperText="Minimum 6 characters"
            />

            <Input
              type="password"
              label="Confirm Password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              autoComplete="new-password"
              placeholder="••••••••"
              error={form.password !== form.confirmPassword && form.confirmPassword ? 'Passwords do not match' : undefined}
            />

            <Button
              type="submit"
              isLoading={loading}
              fullWidth
              size="lg"
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-primary-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
}

