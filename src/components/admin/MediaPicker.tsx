'use client';

import { useEffect, useState } from 'react';
import { getAuthHeaders } from '@/lib/auth';

interface MediaPickerProps {
  onSelect: (url: string) => void;
  currentUrl?: string;
}

export function MediaPicker({ onSelect, currentUrl }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  async function loadMedia() {
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/media?type=image`, { headers: getAuthHeaders(), cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setMedia(json?.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const form = new FormData();
      form.append('file', file);
      const headers = getAuthHeaders();
      delete (headers as any)['Content-Type'];
      const res = await fetch(`${base}/api/media`, { method: 'POST', body: form, headers });
      if (res.ok) {
        const json = await res.json();
        const url = json?.data?.path || json?.data?.url;
        if (url) {
          onSelect(url);
          setIsOpen(false);
          loadMedia();
        }
      } else {
        const error = await res.json();
        console.error('Upload failed:', error);
        alert(error?.message || 'Upload failed');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border rounded-md px-3 py-2"
          value={currentUrl || ''}
          onChange={(e) => onSelect(e.target.value)}
          placeholder="Image URL or click Browse"
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-3 py-2 border rounded-md hover:bg-gray-50"
        >
          Browse
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select Media</h3>
              <div className="flex items-center gap-2">
                <label className="px-3 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
                  {uploading ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
                <button onClick={() => setIsOpen(false)} className="px-3 py-2 border rounded-md">Close</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {media.map((m: any) => {
                    const imageUrl = m.path || m.url;
                    return (
                      <div
                        key={m.fileId || m.path || m.url}
                        onClick={() => {
                          onSelect(imageUrl);
                          setIsOpen(false);
                        }}
                        className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                          currentUrl === imageUrl ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img src={imageUrl} alt={m.name} className="w-full h-32 object-cover" />
                        <div className="p-2 text-xs truncate">{m.name}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

