'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthHeaders } from '@/lib/auth';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { MediaPicker } from '@/components/admin/MediaPicker';
import { TagInput } from '@/components/admin/TagInput';
import {
  FileText,
  Image as ImageIcon,
  Tag,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Type,
  FileEdit,
  Globe,
  Calendar,
  Loader2,
} from 'lucide-react';

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
  const [success, setSuccess] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'content' | 'metadata' | 'media'>('content');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!form.title || !form.body || !form.type || !form.category) {
        setError('Please fill in all required fields (title, body, type, category)');
        setSubmitting(false);
        return;
      }

      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/v1/news`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: form.title,
          summary: form.summary || '',
          body: form.body,
          type: form.type,
          category: form.category,
          tags: Array.isArray(form.tags) ? form.tags : [],
          heroImage: form.heroImage || '',
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        const errorMessage = json?.message || json?.error?.message || 'Failed to create article';
        setError(errorMessage);
        return;
      }

      // Show success message briefly before redirecting
      setSuccess('Article created successfully! Redirecting...');

      // Redirect to news list page after successful creation
      setTimeout(() => {
        router.push('/admin/news');
      }, 500);
    } catch (err: any) {
      console.error('Error creating article:', err);
      setError(err?.message || 'Request failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const titleLength = form.title.length;
  const summaryLength = form.summary.length;
  const isFormValid = form.title && form.body && form.type && form.category;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25">
                <FileEdit className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Create Article</h1>
                <p className="text-xs text-slate-500">Draft a new story for publication</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/admin/news')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                form="article-form"
                disabled={!isFormValid || submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Article
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 to-primary-100/50 p-4 shadow-sm">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary-900">{success}</p>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100/50 p-4 shadow-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">{error}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <form
          id="article-form"
          onSubmit={onSubmit}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Type className="h-5 w-5 text-slate-400" />
                <label className="text-sm font-semibold text-slate-900">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <span className="ml-auto text-xs text-slate-400">{titleLength} characters</span>
              </div>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter a compelling headline..."
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 py-3.5 text-lg font-semibold text-slate-900 placeholder-slate-400 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
              />
              <p className="mt-2 text-xs text-slate-500">
                A clear, engaging title that captures the essence of your story
              </p>
            </div>

            {/* Summary Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-400" />
                <label className="text-sm font-semibold text-slate-900">
                  Summary <span className="text-red-500">*</span>
                </label>
                <span className="ml-auto text-xs text-slate-400">{summaryLength} characters</span>
              </div>
              <textarea
                required
                rows={4}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="Write a brief, engaging summary that will appear in previews and search results..."
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 resize-none"
              />
              <p className="mt-2 text-xs text-slate-500">
                Keep it concise (150-200 characters recommended) for better engagement
              </p>
            </div>

            {/* Body Content Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <FileEdit className="h-5 w-5 text-slate-400" />
                <label className="text-sm font-semibold text-slate-900">
                  Article Content <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="rounded-xl border-2 border-slate-200 bg-slate-50/50 p-1 transition-all focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10">
                <RichTextEditor
                  value={form.body}
                  onChange={(value) => setForm({ ...form, body: value })}
                  placeholder="Start writing your article here. Use the toolbar to format text, add images, and more..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Article Metadata */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Sparkles className="h-5 w-5 text-primary-600" />
                <h2 className="text-base font-bold text-slate-900">Article Settings</h2>
              </div>

              <div className="space-y-5">
                {/* Type */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Article Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                  >
                    <option value="breaking">🔥 Breaking News</option>
                    <option value="match_report">📊 Match Report</option>
                    <option value="analysis">📈 Analysis</option>
                    <option value="feature">✨ Feature Story</option>
                    <option value="interview">🎤 Interview</option>
                    <option value="opinion">💭 Opinion</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                  >
                    <option value="cricket">🏏 Cricket</option>
                    <option value="football">⚽ Football</option>
                    <option value="general">📰 General</option>
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    <Tag className="h-3.5 w-3.5" />
                    Tags
                  </label>
                  <TagInput
                    tags={form.tags}
                    onChange={(tags) => setForm({ ...form, tags })}
                    placeholder="Add tags (press Enter)"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Add relevant tags to improve discoverability
                  </p>
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <ImageIcon className="h-5 w-5 text-primary-600" />
                <h2 className="text-base font-bold text-slate-900">Featured Image</h2>
              </div>
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Hero Image
                </label>
                {form.heroImage && (
                  <div className="mb-4 overflow-hidden rounded-xl border-2 border-slate-200">
                    <img
                      src={form.heroImage}
                      alt="Hero preview"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                )}
                <MediaPicker
                  currentUrl={form.heroImage}
                  onSelect={(url) => setForm({ ...form, heroImage: url })}
                />
                <p className="mt-3 text-xs text-slate-500">
                  Add a compelling image that represents your article
                </p>
              </div>
            </div>

            {/* Form Status */}
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-slate-900">Form Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Title</span>
                  <span className={form.title ? 'text-green-600' : 'text-slate-400'}>
                    {form.title ? '✓' : '○'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Summary</span>
                  <span className={form.summary ? 'text-green-600' : 'text-slate-400'}>
                    {form.summary ? '✓' : '○'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Content</span>
                  <span className={form.body ? 'text-green-600' : 'text-slate-400'}>
                    {form.body ? '✓' : '○'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Type & Category</span>
                  <span
                    className={form.type && form.category ? 'text-green-600' : 'text-slate-400'}
                  >
                    {form.type && form.category ? '✓' : '○'}
                  </span>
                </div>
                <div className="mt-4 rounded-lg bg-primary-50 p-3 text-center">
                  <p className="text-xs font-semibold text-primary-900">
                    {isFormValid ? 'Ready to publish' : 'Complete required fields'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
