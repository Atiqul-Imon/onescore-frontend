"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthHeaders } from '@/lib/auth';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { MediaPicker } from '@/components/admin/MediaPicker';
import { TagInput } from '@/components/admin/TagInput';

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
      const res = await fetch(`${base}/api/v1/news/articles`, {
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
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Newsroom</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create article</h1>
        <p className="mt-2 text-sm text-slate-500">
          Fill in the editorial brief, attach media, and hand it off to the newsroom queue.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-6">
          {/* Main Content Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary-500"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Enter article title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary-500"
                value={form.summary}
                onChange={e => setForm({ ...form, summary: e.target.value })}
                placeholder="Write a brief summary of the article..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
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
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Article metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-primary-500"
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
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-primary-500"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  <option value="cricket">Cricket</option>
                  <option value="football">Football</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium mb-2 text-slate-700">
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
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Media</h2>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Hero Image
              </label>
              <MediaPicker
                currentUrl={form.heroImage}
                onSelect={(url) => setForm({ ...form, heroImage: url })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <a
              href="/admin/news"
              className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-primary-600 text-white shadow hover:bg-primary-500 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Article'}
            </button>
          </div>
      </form>
    </div>
  );
}


