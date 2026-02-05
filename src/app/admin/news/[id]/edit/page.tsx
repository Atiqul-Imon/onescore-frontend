'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Send,
  ArrowLeft,
  Eye,
  Clock,
  User,
} from 'lucide-react';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700', icon: FileEdit },
  in_review: { label: 'In Review', color: 'bg-amber-100 text-amber-700', icon: Clock },
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700', icon: Calendar },
  published: { label: 'Published', color: 'bg-green-100 text-green-700', icon: Globe },
  archived: { label: 'Archived', color: 'bg-slate-100 text-slate-500', icon: FileText },
};

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
  const [articleMeta, setArticleMeta] = useState<any>(null);

  useEffect(() => {
    if (id) loadArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadArticle() {
    try {
      setLoading(true);
      setError(null);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // Use direct endpoint to fetch article by ID
      const res = await fetch(`${base}/api/v1/news/${id}`, {
        cache: 'no-store',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Article not found');
        }
        const errorData = await res.json();
        throw new Error(errorData?.message || 'Failed to load article');
      }

      const json = await res.json();
      const article = json?.data || json;

      if (!article || !article._id) {
        throw new Error('Invalid article data received');
      }

      setArticleMeta({
        state: article.state || 'draft',
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        publishedAt: article.publishedAt,
        author: article.author,
        viewCount: article.viewCount || 0,
        slug: article.slug,
      });

      setForm({
        title: article.title || '',
        summary: article.summary || '',
        body: article.body || '',
        type: article.type || 'breaking',
        category: article.category || 'cricket',
        tags: article.tags || [],
        heroImage: article.heroImage || '',
        state: article.state || 'draft',
      });
    } catch (e: any) {
      console.error('Error loading article:', e);
      setError(e?.message || 'Failed to load article');
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    try {
      setError(null);
      setSuccess(null);
      setSaving(true);

      // Validate required fields
      if (!form.title || !form.body || !form.type || !form.category) {
        throw new Error('Please fill in all required fields (title, body, type, category)');
      }

      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/v1/news/${id}`, {
        method: 'PUT',
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to save article' }));
        throw new Error(errorData?.message || `Failed to save: ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      setSuccess('Article saved successfully');

      // Reload article to get updated state
      await loadArticle();
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      console.error('Error saving article:', e);
      setError(e?.message || 'Save failed. Please try again.');
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
      const res = await fetch(`${base}/api/v1/news/${id}/publish`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to publish article' }));
        throw new Error(errorData?.message || `Failed to publish: ${res.status} ${res.statusText}`);
      }

      setSuccess('Article published successfully!');
      // Reload article to get updated state
      await loadArticle();
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      console.error('Error publishing article:', e);
      setError(e?.message || 'Publish failed. Please try again.');
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="text-lg font-semibold text-slate-600">Loading article...</p>
          <p className="mt-2 text-sm text-slate-500">Please wait while we fetch the article</p>
        </div>
      </div>
    );
  }

  if (!form && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="mx-auto max-w-2xl px-4 pt-12 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-900">Article Not Found</h2>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/admin/news')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to News List
              </button>
              <button
                onClick={() => router.push('/admin/news/create')}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:from-primary-700 hover:to-primary-800"
              >
                <FileEdit className="h-4 w-4" />
                Create New Article
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
        No article data available
      </div>
    );
  }

  const StatusBadge = statusConfig[form.state as keyof typeof statusConfig] || statusConfig.draft;
  const StatusIcon = StatusBadge.icon;
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
              <button
                onClick={() => router.push('/admin/news')}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25">
                <FileEdit className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Edit Article</h1>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${StatusBadge.color}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {StatusBadge.label}
                  </span>
                  {articleMeta?.viewCount > 0 && (
                    <span className="text-xs text-slate-500">{articleMeta.viewCount} views</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {articleMeta?.slug && (
                <a
                  href={`/news/${articleMeta.slug.split('/').slice(-1)[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50"
                >
                  <Eye className="h-4 w-4" />
                  View
                </a>
              )}
              <button
                type="button"
                onClick={save}
                disabled={saving || !isFormValid}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={publish}
                disabled={publishing || form?.state === 'published' || !isFormValid}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {publishing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : form?.state === 'published' ? (
                  <>
                    <Globe className="h-4 w-4" />
                    Published
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Publish
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
        <form className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
                placeholder="Write a brief, engaging summary..."
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 resize-none"
              />
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
                  value={form.body || ''}
                  onChange={(value) => setForm({ ...form, body: value })}
                  placeholder="Start writing your article here..."
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
                    tags={form.tags || []}
                    onChange={(tags) => setForm({ ...form, tags })}
                    placeholder="Add tags (press Enter)"
                  />
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
              </div>
            </div>

            {/* Article Info */}
            {articleMeta && (
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-slate-900">Article Information</h3>
                <div className="space-y-3 text-sm">
                  {articleMeta.author && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-600">
                        <User className="h-4 w-4" />
                        Author
                      </span>
                      <span className="font-semibold text-slate-900">
                        {articleMeta.author.name || articleMeta.author.email || 'Unknown'}
                      </span>
                    </div>
                  )}
                  {articleMeta.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4 w-4" />
                        Created
                      </span>
                      <span className="font-semibold text-slate-900">
                        {new Date(articleMeta.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {articleMeta.updatedAt && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-600">
                        <Clock className="h-4 w-4" />
                        Last Updated
                      </span>
                      <span className="font-semibold text-slate-900">
                        {new Date(articleMeta.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {articleMeta.publishedAt && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-600">
                        <Globe className="h-4 w-4" />
                        Published
                      </span>
                      <span className="font-semibold text-slate-900">
                        {new Date(articleMeta.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

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
