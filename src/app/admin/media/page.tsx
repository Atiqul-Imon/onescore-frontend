'use client';
import { useEffect, useState } from 'react';
import { getAuthHeaders } from '@/lib/auth';
import { AdminSurface, AdminToolbar, Button, LoadingSpinner, StatMetric } from '@/components/ui';

type MediaItem = { name: string; path: string; type: string };

export default function MediaLibraryPage() {
  const [type, setType] = useState<'image' | 'video' | 'audio' | 'document'>('image');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchMedia(t = type) {
    setLoading(true);
    setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/v1/media?type=${t}`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      const json = await res.json();
      setItems(json?.data || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const headers = getAuthHeaders();
    delete (headers as any)['Content-Type']; // Let browser set multipart boundary
    const res = await fetch(`${base}/api/v1/media`, { method: 'POST', body: form, headers });
    if (res.ok) fetchMedia();
  }

  async function onDelete(p: string) {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${base}/api/v1/media`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: p }),
    });
    if (res.ok) fetchMedia();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Creative Studio</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Media library</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage hero art, match photos, and broadcast assets in a single vault.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow">
          <input type="file" className="hidden" onChange={onUpload} />
          Upload asset
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatMetric label="Items loaded" value={items.length} trend={`Filtered: ${type}`} />
        <StatMetric label="Images" value={items.filter((it) => it.type === 'image').length} />
        <StatMetric label="Videos" value={items.filter((it) => it.type === 'video').length} />
        <StatMetric
          label="Audio / Docs"
          value={items.filter((it) => it.type !== 'image' && it.type !== 'video').length}
        />
      </div>

      <AdminToolbar stackOnMobile={false}>
        <div className="flex flex-wrap gap-2">
          {(['image', 'video', 'audio', 'document'] as const).map((t) => (
            <Button key={t} variant={type === t ? 'primary' : 'ghost'} onClick={() => setType(t)}>
              {t[0].toUpperCase() + t.slice(1)}s
            </Button>
          ))}
        </div>
        <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Showing latest uploads
        </div>
      </AdminToolbar>

      <AdminSurface>
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-slate-500">
            <p>No files yet. Upload to populate the library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((it) => (
              <div key={it.path} className="rounded-2xl border border-slate-200">
                {type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.path} alt={it.name} className="h-32 w-full object-cover" />
                ) : (
                  <div className="flex h-32 items-center justify-center text-xs uppercase text-slate-500">
                    {it.type}
                  </div>
                )}
                <div className="px-4 py-2 text-sm font-medium text-slate-900 line-clamp-1">
                  {it.name}
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-sm">
                  <a href={it.path} target="_blank" className="text-primary-600 hover:underline">
                    Open
                  </a>
                  <Button
                    variant="ghost"
                    className="text-red-600"
                    onClick={() => onDelete(it.path)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminSurface>
    </div>
  );
}
