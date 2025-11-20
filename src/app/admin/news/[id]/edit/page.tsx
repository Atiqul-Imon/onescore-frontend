"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAuthHeaders } from '@/lib/auth';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { MediaPicker } from '@/components/admin/MediaPicker';
import { TagInput } from '@/components/admin/TagInput';
import { PageLayout } from '@/components/layout/PageLayout';

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
      <PageLayout title="Edit Article" size="xl" className="bg-gray-50 min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </PageLayout>
    );
  }

  if (!form && error) {
    return (
      <PageLayout title="Edit Article" size="xl" className="bg-gray-50 min-h-screen">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
      </PageLayout>
    );
  }

  if (!form) return null;

  return (
    <PageLayout
      title="Edit Article"
      description={`Current status: ${form.state || 'draft'}`}
      size="xl"
      className="bg-gray-50 min-h-screen"
      actions={
        <div className="flex flex-wrap gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={publish}
            disabled={publishing || form?.state === 'published'}
            className="rounded-md bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
          >
            {publishing ? 'Publishing...' : form?.state === 'published' ? 'Published' : 'Publish'}
          </button>
          <a
            href="/admin/news"
            className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Back
          </a>
        </div>
      }
    >
      {success && (
        <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

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
    </PageLayout>
  );
}


