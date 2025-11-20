"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthHeaders } from '@/lib/auth';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { MediaPicker } from '@/components/admin/MediaPicker';
import { TagInput } from '@/components/admin/TagInput';
import { PageLayout } from '@/components/layout/PageLayout';

export default function CreateArticlePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    summary: '',
    body: '',
    type: 'breaking',
    category: 'cricket',
    tags: [] as string[],
    heroImage: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/news/articles`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...form,
          tags: form.tags
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.message || 'Failed to create');
      } else {
        router.push(`/admin/news/${json.data._id}/edit`);
      }
    } catch (err: any) {
      setError(err?.message || 'Request failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageLayout
      title="Create Article"
      description="Fill in the editorial brief, attach media, and publish to the newsroom."
      size="xl"
      className="bg-gray-50 min-h-screen"
    >
      {error ? (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-6">
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
                value={form.body}
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
                  tags={form.tags}
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

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href="/admin/news"
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
            >
              {submitting ? 'Creating...' : 'Create Article'}
            </button>
          </div>
      </form>
    </PageLayout>
  );
}


