"use client";
import { useEffect, useState } from 'react';
import { getAuthHeaders } from '@/lib/auth';

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
      const res = await fetch(`${base}/api/media?type=${t}`, { headers: getAuthHeaders(), cache: 'no-store' });
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
    const res = await fetch(`${base}/api/media`, { method: 'POST', body: form, headers });
    if (res.ok) fetchMedia();
  }

  async function onDelete(p: string) {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const url = new URL(`${base}/api/media`);
    url.searchParams.set('path', p);
    const res = await fetch(url.toString(), { method: 'DELETE', headers: getAuthHeaders() });
    if (res.ok) fetchMedia();
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Media Library</h1>
        <label className="inline-flex items-center px-3 py-2 border rounded-md cursor-pointer">
          <input type="file" className="hidden" onChange={onUpload} />
          Upload
        </label>
      </div>

      <div className="flex gap-2">
        {(['image','video','audio','document'] as const).map(t => (
          <button key={t} onClick={() => setType(t)} className={`px-3 py-1 rounded-md border ${type===t?'bg-gray-900 text-white':'bg-white'}`}>{t[0].toUpperCase()+t.slice(1)}s</button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[200px]">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600 text-sm">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-gray-500">No files yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {items.map((it) => (
              <div key={it.path} className="border rounded-md overflow-hidden">
                {type==='image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.path} alt={it.name} className="w-full h-28 object-cover" />
                ) : (
                  <div className="h-28 flex items-center justify-center text-gray-500 text-xs">{it.type.toUpperCase()}</div>
                )}
                <div className="p-2 text-xs truncate">{it.name}</div>
                <div className="p-2 flex items-center justify-between border-t text-xs">
                  <a href={it.path} target="_blank" className="text-blue-600 hover:underline">Open</a>
                  <button onClick={() => onDelete(it.path)} className="text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


