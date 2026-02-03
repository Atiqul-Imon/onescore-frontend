'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Clock,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Play,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

interface Match {
  matchId: string;
  series: string;
  format: string;
  status: string;
  startTime: string;
  teams: {
    home: { name: string; shortName: string };
    away: { name: string; shortName: string };
  };
  venue: {
    name: string;
    city: string;
    country: string;
  };
  currentScore?: {
    home: { runs: number; wickets: number; overs: number; balls: number };
    away: { runs: number; wickets: number; overs: number; balls: number };
  };
}

interface CommentaryEntry {
  _id?: string;
  id?: string;
  matchId: string;
  innings: number;
  over: number;
  ball: number | null;
  commentaryType: 'pre-ball' | 'ball' | 'post-ball';
  commentary: string;
  authorId: string;
  authorName: string;
  order: number;
  createdAt?: string;
  timestamp?: string;
}

export default function CommentaryManagementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;
  const [match, setMatch] = useState<Match | null>(null);
  const [commentary, setCommentary] = useState<CommentaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    innings: 1,
    over: 0,
    ball: null as number | null,
    commentaryType: 'ball' as 'pre-ball' | 'ball' | 'post-ball',
    commentary: '',
    order: 0,
  });

  const commentaryEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMatch();
    loadCommentary();
  }, [matchId]);

  useEffect(() => {
    if (autoRefresh && match?.status === 'live') {
      const interval = setInterval(() => {
        loadCommentary();
        loadMatch();
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, match?.status, matchId]);

  // Auto-scroll to bottom when new commentary arrives
  useEffect(() => {
    if (commentaryEndRef.current && autoRefresh) {
      commentaryEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commentary, autoRefresh]);

  const loadMatch = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // Try to get match from live matches first
      let response = await fetch(`${base}/api/v1/cricket/matches/${matchId}`, {
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setMatch({
            matchId: data.data.matchId || matchId,
            series: data.data.series || 'Match',
            format: data.data.format || 't20',
            status: data.data.status || 'upcoming',
            startTime: data.data.startTime || new Date().toISOString(),
            teams: data.data.teams || {
              home: { name: 'Team A', shortName: 'A' },
              away: { name: 'Team B', shortName: 'B' },
            },
            venue: data.data.venue || { name: 'Venue', city: 'City', country: 'Country' },
            currentScore: data.data.currentScore,
          });
          return;
        }
      }

      // Fallback: Try local match
      response = await fetch(`${base}/api/v1/admin/local-matches/${matchId}`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setMatch({
            matchId: data.data.matchId || matchId,
            series: data.data.series || 'Match',
            format: data.data.format || 't20',
            status: data.data.status || 'upcoming',
            startTime: data.data.startTime || new Date().toISOString(),
            teams: data.data.teams || {
              home: { name: 'Team A', shortName: 'A' },
              away: { name: 'Team B', shortName: 'B' },
            },
            venue: data.data.venue || { name: 'Venue', city: 'City', country: 'Country' },
            currentScore: data.data.currentScore,
          });
        }
      }
    } catch (err) {
      console.error('Error loading match:', err);
    }
  };

  const loadCommentary = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${base}/api/v1/cricket/matches/${matchId}/commentary/in-house`,
        {
          headers: getAuthHeaders(),
          cache: 'no-store',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCommentary(data.data || []);
      } else {
        console.error('Failed to load commentary');
      }
    } catch (err) {
      console.error('Error loading commentary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/v1/cricket/matches/${matchId}/commentary`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setCommentary([...commentary, data.data]);
        setFormData({
          innings: formData.innings,
          over: formData.over,
          ball: formData.ball,
          commentaryType: 'ball',
          commentary: '',
          order: 0,
        });
        loadCommentary(); // Reload to get updated list
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add commentary');
      }
    } catch (err: any) {
      setError(err.message || 'Error adding commentary');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (commentaryId: string, newText: string) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${base}/api/v1/cricket/matches/${matchId}/commentary/${commentaryId}`,
        {
          method: 'PUT',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ commentary: newText }),
        }
      );

      if (response.ok) {
        setEditingId(null);
        loadCommentary();
      } else {
        alert('Failed to update commentary');
      }
    } catch (err) {
      console.error('Error updating commentary:', err);
      alert('Error updating commentary');
    }
  };

  const handleDelete = async (commentaryId: string) => {
    if (!confirm('Are you sure you want to delete this commentary?')) {
      return;
    }

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${base}/api/v1/cricket/matches/${matchId}/commentary/${commentaryId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        loadCommentary();
      } else {
        alert('Failed to delete commentary');
      }
    } catch (err) {
      console.error('Error deleting commentary:', err);
      alert('Error deleting commentary');
    }
  };

  const getCurrentOver = () => {
    if (!match?.currentScore) return { over: 0, ball: 0 };
    // Try to determine current over from score (simplified)
    const homeOvers = match.currentScore.home.overs || 0;
    const homeBalls = match.currentScore.home.balls || 0;
    return { over: homeOvers, ball: homeBalls };
  };

  const quickAddForCurrent = () => {
    const current = getCurrentOver();
    setFormData({
      ...formData,
      over: current.over,
      ball: current.ball,
      commentaryType: 'ball',
    });
  };

  const quickAddPreBall = () => {
    const current = getCurrentOver();
    setFormData({
      ...formData,
      over: current.over + 1,
      ball: null,
      commentaryType: 'pre-ball',
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
        Loading commentary management...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/commentary"
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-slate-900">Commentary Management</h1>
          {match && (
            <p className="mt-1 text-sm text-slate-500">
              {match.teams.home.name} vs {match.teams.away.name} • {match.series}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            Auto-refresh
          </label>
          <button
            onClick={() => {
              loadMatch();
              loadCommentary();
            }}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RefreshCw className="h-5 w-5 text-slate-600" />
          </button>
          <Link
            href={`/cricket/match/${matchId}`}
            target="_blank"
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-sm"
          >
            View Match
          </Link>
        </div>
      </div>

      {/* Match Info Card */}
      {match && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <Trophy className="h-4 w-4" />
                <span>Series</span>
              </div>
              <p className="font-semibold text-slate-900">{match.series}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <MapPin className="h-4 w-4" />
                <span>Venue</span>
              </div>
              <p className="font-semibold text-slate-900">
                {match.venue.name}, {match.venue.city}
              </p>
            </div>
            {match.currentScore && (
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                  <Play className="h-4 w-4" />
                  <span>Current Score</span>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">
                    {match.teams.home.shortName}: {match.currentScore.home.runs}/
                    {match.currentScore.home.wickets} ({match.currentScore.home.overs}.
                    {match.currentScore.home.balls})
                  </p>
                  <p className="font-semibold text-slate-900">
                    {match.teams.away.shortName}: {match.currentScore.away.runs}/
                    {match.currentScore.away.wickets} ({match.currentScore.away.overs}.
                    {match.currentScore.away.balls})
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Commentary Form */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sticky top-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Commentary
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Commentary Type
                </label>
                <select
                  value={formData.commentaryType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commentaryType: e.target.value as 'pre-ball' | 'ball' | 'post-ball',
                      ball: e.target.value === 'pre-ball' ? null : formData.ball,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="pre-ball">Pre-Ball (Before Ball)</option>
                  <option value="ball">Ball Commentary</option>
                  <option value="post-ball">Post-Ball (After Ball)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Innings</label>
                <select
                  value={formData.innings}
                  onChange={(e) => setFormData({ ...formData, innings: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={1}>First Innings</option>
                  <option value={2}>Second Innings</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Over</label>
                  <input
                    type="number"
                    value={formData.over}
                    onChange={(e) => setFormData({ ...formData, over: Number(e.target.value) })}
                    min="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ball {formData.commentaryType === 'pre-ball' && '(Optional)'}
                  </label>
                  <input
                    type="number"
                    value={formData.ball ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ball: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    min="0"
                    max="5"
                    disabled={formData.commentaryType === 'pre-ball'}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100"
                    placeholder={formData.commentaryType === 'pre-ball' ? 'N/A' : '0-5'}
                  />
                </div>
              </div>

              {formData.commentaryType === 'post-ball' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    min="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0 for first post-ball, 1 for second, etc."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Commentary{' '}
                  <span className="text-slate-500">({formData.commentary.length}/1000)</span>
                </label>
                <textarea
                  value={formData.commentary}
                  onChange={(e) => setFormData({ ...formData, commentary: e.target.value })}
                  rows={6}
                  maxLength={1000}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  placeholder="Enter your commentary..."
                />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={quickAddForCurrent}
                  className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Use Current Over/Ball
                </button>
                <button
                  type="button"
                  onClick={quickAddPreBall}
                  className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Pre-Ball for Next Over
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting || !formData.commentary.trim()}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Commentary
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Commentary List */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  In-House Commentary ({commentary.length})
                </h2>
                <div className="text-sm text-slate-500">
                  {commentary.filter((c) => c.commentaryType === 'pre-ball').length} pre-ball •{' '}
                  {commentary.filter((c) => c.commentaryType === 'ball').length} ball •{' '}
                  {commentary.filter((c) => c.commentaryType === 'post-ball').length} post-ball
                </div>
              </div>
            </div>

            <div className="max-h-[800px] overflow-y-auto p-6">
              {commentary.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-semibold">No commentary yet</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Start adding commentary using the form on the left
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {commentary
                    .sort((a, b) => {
                      // Sort by innings, over, ball, type, order
                      if (a.innings !== b.innings) return a.innings - b.innings;
                      if (a.over !== b.over) return b.over - a.over; // Higher over first
                      if (a.ball !== b.ball) {
                        if (a.ball === null) return 1;
                        if (b.ball === null) return -1;
                        return b.ball - a.ball;
                      }
                      const typeOrder = { 'pre-ball': 0, ball: 1, 'post-ball': 2 };
                      const orderA = typeOrder[a.commentaryType] ?? 1;
                      const orderB = typeOrder[b.commentaryType] ?? 1;
                      if (orderA !== orderB) return orderA - orderB;
                      return a.order - b.order;
                    })
                    .map((entry) => {
                      const isEditing = editingId === (entry._id || entry.id);
                      const [editText, setEditText] = useState(entry.commentary);

                      return (
                        <div
                          key={entry._id || entry.id}
                          className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-semibold">
                                  {entry.commentaryType === 'pre-ball' && 'Pre-Ball'}
                                  {entry.commentaryType === 'ball' && 'Ball'}
                                  {entry.commentaryType === 'post-ball' && 'Post-Ball'}
                                </span>
                                <span className="text-sm text-slate-600">
                                  Innings {entry.innings} • Over {entry.over}
                                  {entry.ball !== null && ` • Ball ${entry.ball}`}
                                  {entry.commentaryType === 'post-ball' &&
                                    entry.order > 0 &&
                                    ` • Order ${entry.order}`}
                                </span>
                                <span className="text-xs text-slate-400">
                                  by {entry.authorName}
                                </span>
                              </div>
                              {isEditing ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    rows={3}
                                    maxLength={1000}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        handleUpdate(entry._id || entry.id || '', editText)
                                      }
                                      className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-semibold flex items-center gap-1"
                                    >
                                      <Save className="h-3 w-3" />
                                      Save
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingId(null);
                                        setEditText(entry.commentary);
                                      }}
                                      className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-semibold flex items-center gap-1"
                                    >
                                      <X className="h-3 w-3" />
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-slate-800 leading-relaxed">{entry.commentary}</p>
                              )}
                              {entry.createdAt && (
                                <p className="text-xs text-slate-400 mt-2">
                                  {new Date(entry.createdAt).toLocaleString()}
                                </p>
                              )}
                            </div>
                            {!isEditing && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingId(entry._id || entry.id || null)}
                                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <Edit className="h-4 w-4 text-slate-600" />
                                </button>
                                <button
                                  onClick={() => handleDelete(entry._id || entry.id || '')}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  <div ref={commentaryEndRef} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
