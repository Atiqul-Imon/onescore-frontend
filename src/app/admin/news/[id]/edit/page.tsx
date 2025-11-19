"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAuthHeaders } from '@/lib/auth';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { MediaPicker } from '@/components/admin/MediaPicker';
import { TagInput } from '@/components/admin/TagInput';

export default function EditArticlePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<any>(null);
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) loadArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadArticle() {
    try {
      setLoading(true);
      setError(null);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/news?limit=100&state=all`, { cache: 'no-store', headers: getAuthHeaders() });
      const json = await res.json();
      const a = json?.data?.items?.find((x: any) => x._id === id);
      if (!a) throw new Error('Article not found');
      setForm({
        title: a.title,
        summary: a.summary || '',
        body: a.body || '',
        type: a.type,
        category: a.category,
        tags: a.tags || [],
        heroImage: a.heroImage || '',
        state: a.state,
      });
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    try {
      setError(null);
      setSuccess(null);
      setSaving(true);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/news/articles/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...form,
          tags: form.tags || [],
        }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j?.message || 'Failed to save');
      }
      setSuccess('Article saved successfully');
      // Reload article to get updated state
      await loadArticle();
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    try {
      setError(null);
      setSuccess(null);
      setPublishing(true);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/news/articles/${id}/publish`, { 
        method: 'POST', 
        headers: getAuthHeaders() 
      });
      
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json?.message || 'Publish failed');
      }
      
      setSuccess('Article published successfully!');
      // Reload article to get updated state
      await loadArticle();
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e?.message || 'Publish failed');
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit Article</h1>
            <div className="flex gap-3">
              <button
                onClick={save}
                disabled={saving}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={publish}
                disabled={publishing || form?.state === 'published'}
                className="px-6 py-2.5 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishing ? 'Publishing...' : form?.state === 'published' ? 'Published' : 'Publish'}
              </button>
              <a
                href="/admin/news"
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Back
              </a>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current status: <span className="capitalize font-medium">{form.state || 'draft'}</span>
          </p>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
            </div>
          )}
        </div>

        <form className="space-y-6">
          {/* Main Content Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-colors"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Enter article title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-colors resize-y"
                value={form.summary}
                onChange={e => setForm({ ...form, summary: e.target.value })}
                placeholder="Write a brief summary of the article..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Body <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={form.body || ''}
                onChange={(value) => setForm({ ...form, body: value })}
                placeholder="Write your article content here..."
              />
            </div>
          </div>

          {/* Metadata Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Article Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-colors"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  <option value="breaking">Breaking</option>
                  <option value="match_report">Match Report</option>
                  <option value="analysis">Analysis</option>
                  <option value="feature">Feature</option>
                  <option value="interview">Interview</option>
                  <option value="opinion">Opinion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-colors"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  <option value="cricket">Cricket</option>
                  <option value="football">Football</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Tags
                </label>
                <TagInput
                  tags={form.tags || []}
                  onChange={(tags) => setForm({ ...form, tags })}
                  placeholder="Add tags (press Enter)"
                />
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Media</h2>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Hero Image
              </label>
              <MediaPicker
                currentUrl={form.heroImage}
                onSelect={(url) => setForm({ ...form, heroImage: url })}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


