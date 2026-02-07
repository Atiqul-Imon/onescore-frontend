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
  ballNumber?: number | null;
  commentaryType: 'pre-ball' | 'ball' | 'post-ball';
  commentary: string;
  authorId?: string;
  authorName?: string;
  order: number;
  createdAt?: string;
  timestamp?: string;
  source?: 'sportsmonk' | 'in-house';
  runs?: number;
  wickets?: number;
  batsman?: string;
  bowler?: string;
}

interface MergedCommentaryData {
  firstInnings: CommentaryEntry[];
  secondInnings: CommentaryEntry[];
  all: CommentaryEntry[];
  sources?: {
    sportsMonk: number;
    inHouse: number;
  };
}

export default function CommentaryManagementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;
  const [match, setMatch] = useState<Match | null>(null);
  const [commentary, setCommentary] = useState<CommentaryEntry[]>([]); // In-house only
  const [mergedCommentary, setMergedCommentary] = useState<MergedCommentaryData | null>(null); // Merged (SportsMonk + in-house)
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showMergedView, setShowMergedView] = useState(true); // Show merged commentary by default

  // Inline commentary form state - keyed by entry position
  const [inlineForms, setInlineForms] = useState<{
    [key: string]: {
      type: 'pre-ball' | 'post-ball';
      commentary: string;
      innings: number;
      over: number;
      ball: number | null;
      order: number;
      submitting: boolean;
    };
  }>({});

  const commentaryEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMatch();
    loadCommentary();
    loadMergedCommentary();
  }, [matchId]);

  useEffect(() => {
    if (autoRefresh && match?.status === 'live') {
      const interval = setInterval(() => {
        loadCommentary();
        loadMergedCommentary();
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

  const loadMergedCommentary = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${base}/api/v1/cricket/matches/${matchId}/commentary?merge=true`,
        {
          cache: 'no-store',
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setMergedCommentary(data.data);
        }
      }
    } catch (err) {
      console.error('Error loading merged commentary:', err);
    }
  };

  const handleInlineSubmit = async (
    entryKey: string,
    type: 'pre-ball' | 'post-ball',
    entry: CommentaryEntry
  ) => {
    const form = inlineForms[entryKey];
    if (!form || !form.commentary.trim()) return;

    setError(null);
    setInlineForms((prev) => ({
      ...prev,
      [entryKey]: { ...prev[entryKey], submitting: true },
    }));

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // Validate and ensure proper values
      const innings = Math.max(1, Math.min(2, entry.innings || 1)); // Clamp between 1 and 2
      const over = Math.max(0, entry.over || 0);

      // For both pre-ball and post-ball, use the ball number from the entry
      const ballValue = entry.ballNumber ?? entry.ball ?? 0;
      const ball = Math.max(0, Math.min(5, ballValue)); // Clamp between 0 and 5

      const commentaryData = {
        innings,
        over,
        ball,
        commentaryType: type,
        commentary: form.commentary,
        order: type === 'post-ball' ? Math.max(0, form.order || 0) : 0,
      };

      const response = await fetch(`${base}/api/v1/cricket/matches/${matchId}/commentary`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentaryData),
      });

      if (response.ok) {
        // Clear the form
        setInlineForms((prev) => {
          const newForms = { ...prev };
          delete newForms[entryKey];
          return newForms;
        });
        // Reload commentary
        loadCommentary();
        loadMergedCommentary();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add commentary');
        setInlineForms((prev) => ({
          ...prev,
          [entryKey]: { ...prev[entryKey], submitting: false },
        }));
      }
    } catch (err: any) {
      setError(err.message || 'Error adding commentary');
      setInlineForms((prev) => ({
        ...prev,
        [entryKey]: { ...prev[entryKey], submitting: false },
      }));
    }
  };

  // Get the next available order number for post-ball commentary
  const getNextPostBallOrder = (entry: CommentaryEntry): number => {
    if (!mergedCommentary?.all) return 0;

    const ballNum = entry.ballNumber ?? entry.ball ?? 0;

    // Find all existing post-ball commentaries for this specific ball
    const existingPostBalls = mergedCommentary.all.filter((c) => {
      const cBall = c.ballNumber ?? c.ball ?? 0;
      return (
        c.commentaryType === 'post-ball' &&
        c.innings === entry.innings &&
        c.over === entry.over &&
        cBall === ballNum &&
        c.source === 'in-house' // Only count in-house commentaries
      );
    });

    // Find the highest order number
    const maxOrder =
      existingPostBalls.length > 0 ? Math.max(...existingPostBalls.map((c) => c.order || 0)) : -1;

    // Return the next order number (maxOrder + 1, or 0 if none exist)
    return maxOrder + 1;
  };

  const toggleInlineForm = (
    entryKey: string,
    type: 'pre-ball' | 'post-ball',
    entry: CommentaryEntry
  ) => {
    setInlineForms((prev) => {
      if (prev[entryKey] && prev[entryKey].type === type) {
        // Close if already open
        const newForms = { ...prev };
        delete newForms[entryKey];
        return newForms;
      }
      // Open new form with validated values
      const validatedInnings = Math.max(1, Math.min(2, entry.innings || 1));
      const validatedBall =
        entry.ball !== null && entry.ball !== undefined
          ? Math.max(0, Math.min(5, entry.ball))
          : null;

      // Auto-calculate order for post-ball commentary
      const initialOrder = type === 'post-ball' ? getNextPostBallOrder(entry) : 0;

      return {
        ...prev,
        [entryKey]: {
          type,
          commentary: '',
          innings: validatedInnings,
          over: Math.max(0, entry.over || 0),
          ball: validatedBall,
          order: initialOrder,
          submitting: false,
        },
      };
    });
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

  const getEntryKey = (entry: CommentaryEntry, index: number) => {
    return `${entry.innings}-${entry.over}-${entry.ball ?? 'null'}-${entry.commentaryType}-${index}-${entry._id || entry.id}`;
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

      {/* Main Commentary Section - Full Width */}
      <div>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Header Section */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary-600" />
                  Merged Commentary
                  <span className="text-lg font-semibold text-slate-500">
                    ({mergedCommentary?.all?.length || 0})
                  </span>
                </h2>
                {mergedCommentary && (
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span className="text-slate-600">
                        <strong>SportsMonk:</strong> {mergedCommentary.sources?.sportsMonk || 0}{' '}
                        entries
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span className="text-slate-600">
                        <strong>In-House:</strong> {mergedCommentary.sources?.inHouse || 0} entries
                      </span>
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMergedView(!showMergedView)}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold transition-colors"
                >
                  {showMergedView ? 'Show In-House Only' : 'Show Merged View'}
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Commentary List */}
          <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
            {showMergedView ? (
              // Show merged commentary (SportsMonk + in-house) with inline forms
              mergedCommentary && mergedCommentary.all && mergedCommentary.all.length > 0 ? (
                <div className="p-6 space-y-6">
                  {mergedCommentary.all
                    .sort((a, b) => {
                      // Sort by timestamp (newest first) - reversed for latest at top
                      const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
                      const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
                      if (timeA !== timeB) return timeB - timeA; // Reverse: newest first

                      // Fallback to innings, over, ball, type if timestamps are same
                      if (a.innings !== b.innings) return b.innings - a.innings; // Reverse: higher innings first
                      if (a.over !== b.over) return b.over - a.over; // Reverse: higher over first
                      const aBall = a.ballNumber ?? a.ball ?? 0;
                      const bBall = b.ballNumber ?? b.ball ?? 0;
                      if (aBall !== bBall) return bBall - aBall; // Reverse: higher ball first
                      const typeOrder = { 'pre-ball': 0, ball: 1, 'post-ball': 2 };
                      return (
                        (typeOrder[b.commentaryType || 'ball'] || 1) -
                        (typeOrder[a.commentaryType || 'ball'] || 1)
                      );
                    })
                    .map((entry, index) => {
                      const isInHouse = entry.source === 'in-house';
                      const ballNum = entry.ballNumber ?? entry.ball ?? 0;
                      const commentaryType = entry.commentaryType || 'ball';
                      const isEditing = isInHouse && editingId === (entry._id || entry.id);
                      const entryKey = getEntryKey(entry, index);
                      const isBallCommentary = commentaryType === 'ball';
                      const preBallForm =
                        inlineForms[entryKey]?.type === 'pre-ball' ? inlineForms[entryKey] : null;
                      const postBallForm =
                        inlineForms[entryKey]?.type === 'post-ball' ? inlineForms[entryKey] : null;

                      return (
                        <div key={entryKey} className="space-y-3">
                          {/* Pre-Ball Commentary Form (before ball commentary) */}
                          {isBallCommentary && (
                            <div className="relative">
                              {preBallForm ? (
                                <div className="ml-8 p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 border-2 border-amber-300 rounded-xl shadow-sm">
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold">
                                      Add Pre-Ball Commentary
                                    </span>
                                    <span className="text-xs text-slate-600">
                                      Over {entry.over} • Before Ball {ballNum}
                                    </span>
                                  </div>
                                  <textarea
                                    value={preBallForm.commentary}
                                    onChange={(e) =>
                                      setInlineForms({
                                        ...inlineForms,
                                        [entryKey]: { ...preBallForm, commentary: e.target.value },
                                      })
                                    }
                                    rows={3}
                                    maxLength={1000}
                                    placeholder="Add commentary before this ball..."
                                    className="w-full px-4 py-2.5 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none text-sm"
                                  />
                                  <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs text-slate-500">
                                      {preBallForm.commentary.length}/1000 characters
                                    </span>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          handleInlineSubmit(entryKey, 'pre-ball', entry)
                                        }
                                        disabled={
                                          !preBallForm.commentary.trim() || preBallForm.submitting
                                        }
                                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                                      >
                                        {preBallForm.submitting ? (
                                          <>
                                            <RefreshCw className="h-3 w-3 animate-spin" />
                                            Adding...
                                          </>
                                        ) : (
                                          <>
                                            <Plus className="h-3 w-3" />
                                            Add Pre-Ball
                                          </>
                                        )}
                                      </button>
                                      <button
                                        onClick={() => {
                                          setInlineForms((prev) => {
                                            const newForms = { ...prev };
                                            delete newForms[entryKey];
                                            return newForms;
                                          });
                                        }}
                                        className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-sm transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => toggleInlineForm(entryKey, 'pre-ball', entry)}
                                  className="ml-8 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1.5"
                                >
                                  <Plus className="h-3 w-3" />
                                  Add Pre-Ball Commentary
                                </button>
                              )}
                            </div>
                          )}

                          {/* Main Commentary Entry */}
                          <div className="p-5 border-2 border-slate-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold">
                                    Over {entry.over}
                                    {commentaryType === 'pre-ball' ? (
                                      <span className="text-xs text-slate-500"> (pre)</span>
                                    ) : commentaryType === 'post-ball' ? (
                                      <span className="text-xs text-slate-500">
                                        .{ballNum} (post)
                                      </span>
                                    ) : (
                                      <span>.{ballNum}</span>
                                    )}
                                  </span>
                                  {entry.runs !== undefined && entry.runs > 0 && (
                                    <span className="px-2.5 py-1 bg-green-500 text-white rounded-lg text-xs font-bold">
                                      {entry.runs} run{entry.runs !== 1 ? 's' : ''}
                                    </span>
                                  )}
                                  {entry.wickets && entry.wickets > 0 && (
                                    <span className="px-2.5 py-1 bg-red-500 text-white rounded-lg text-xs font-bold">
                                      Wicket!
                                    </span>
                                  )}
                                </div>
                                {isEditing ? (
                                  <div className="space-y-3">
                                    <textarea
                                      value={editText}
                                      onChange={(e) => setEditText(e.target.value)}
                                      rows={4}
                                      maxLength={1000}
                                      className="w-full px-4 py-3 border-2 border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          handleUpdate(entry._id || entry.id || '', editText)
                                        }
                                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold text-sm flex items-center gap-2 transition-colors"
                                      >
                                        <Save className="h-4 w-4" />
                                        Save
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingId(null);
                                          setEditText('');
                                        }}
                                        className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-sm flex items-center gap-2 transition-colors"
                                      >
                                        <X className="h-4 w-4" />
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-slate-800 leading-relaxed text-base mb-2">
                                    {entry.commentary}
                                  </p>
                                )}
                                {(entry.batsman || entry.bowler) && (
                                  <div className="mt-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg inline-block">
                                    {entry.batsman && (
                                      <span className="font-semibold">Batting:</span>
                                    )}{' '}
                                    {entry.batsman}
                                    {entry.batsman && entry.bowler && <span> • </span>}
                                    {entry.bowler && (
                                      <span className="font-semibold">Bowling:</span>
                                    )}{' '}
                                    {entry.bowler}
                                  </div>
                                )}
                                {entry.timestamp && (
                                  <p className="text-xs text-slate-400 mt-3">
                                    {new Date(entry.timestamp).toLocaleString()}
                                  </p>
                                )}
                              </div>
                              {isInHouse && !isEditing && (
                                <div className="flex gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => {
                                      setEditingId(entry._id || entry.id || null);
                                      setEditText(entry.commentary);
                                    }}
                                    className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                                    title="Edit"
                                  >
                                    <Edit className="h-4 w-4 text-slate-600" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(entry._id || entry.id || '')}
                                    className="p-2.5 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Post-Ball Commentary Form (after ball commentary) */}
                          {isBallCommentary && (
                            <div className="relative">
                              {postBallForm ? (
                                <div className="ml-8 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-300 rounded-xl shadow-sm">
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-xs font-bold">
                                      Add Post-Ball Commentary
                                    </span>
                                    <span className="text-xs text-slate-600">
                                      Over {entry.over} • After Ball {ballNum}
                                    </span>
                                  </div>
                                  <div className="mb-3">
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                      Order{' '}
                                      <span className="text-slate-500 font-normal">
                                        (auto-set: {postBallForm.order} for this ball)
                                      </span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        value={postBallForm.order}
                                        onChange={(e) =>
                                          setInlineForms({
                                            ...inlineForms,
                                            [entryKey]: {
                                              ...postBallForm,
                                              order: Number(e.target.value),
                                            },
                                          })
                                        }
                                        min="0"
                                        className="w-24 px-3 py-1.5 border-2 border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                      />
                                      <span className="text-xs text-slate-500">
                                        (0=first, 1=second, etc.)
                                      </span>
                                    </div>
                                  </div>
                                  <textarea
                                    value={postBallForm.commentary}
                                    onChange={(e) =>
                                      setInlineForms({
                                        ...inlineForms,
                                        [entryKey]: { ...postBallForm, commentary: e.target.value },
                                      })
                                    }
                                    rows={3}
                                    maxLength={1000}
                                    placeholder="Add commentary after this ball..."
                                    className="w-full px-4 py-2.5 border-2 border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-sm"
                                  />
                                  <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs text-slate-500">
                                      {postBallForm.commentary.length}/1000 characters
                                    </span>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          handleInlineSubmit(entryKey, 'post-ball', entry)
                                        }
                                        disabled={
                                          !postBallForm.commentary.trim() || postBallForm.submitting
                                        }
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                                      >
                                        {postBallForm.submitting ? (
                                          <>
                                            <RefreshCw className="h-3 w-3 animate-spin" />
                                            Adding...
                                          </>
                                        ) : (
                                          <>
                                            <Plus className="h-3 w-3" />
                                            Add Post-Ball
                                          </>
                                        )}
                                      </button>
                                      <button
                                        onClick={() => {
                                          setInlineForms((prev) => {
                                            const newForms = { ...prev };
                                            delete newForms[entryKey];
                                            return newForms;
                                          });
                                        }}
                                        className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-sm transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => toggleInlineForm(entryKey, 'post-ball', entry)}
                                  className="ml-8 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                                >
                                  <Plus className="h-3 w-3" />
                                  Add Post-Ball Commentary
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  <div ref={commentaryEndRef} />
                </div>
              ) : (
                <div className="p-12 text-center">
                  <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-700 font-bold text-lg">No commentary available</p>
                  <p className="text-sm text-slate-500 mt-2">
                    SportsMonk commentary will appear here when the match starts. You can add
                    in-house commentary directly inline when commentary appears.
                  </p>
                </div>
              )
            ) : // Show in-house commentary only
            commentary.length === 0 ? (
              <div className="p-12 text-center">
                <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-700 font-bold text-lg">No in-house commentary yet</p>
                <p className="text-sm text-slate-500 mt-2">
                  Switch to "Merged View" to see SportsMonk commentary and add your in-house
                  commentary inline.
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {commentary
                  .sort((a, b) => {
                    // Sort by timestamp (newest first) - reversed for latest at top
                    const timeA = new Date(a.createdAt || 0).getTime();
                    const timeB = new Date(b.createdAt || 0).getTime();
                    if (timeA !== timeB) return timeB - timeA; // Reverse: newest first

                    // Fallback to innings, over, ball, type, order if timestamps are same
                    if (a.innings !== b.innings) return b.innings - a.innings; // Reverse: higher innings first
                    if (a.over !== b.over) return b.over - a.over; // Reverse: higher over first
                    if (a.ball !== b.ball) {
                      if (a.ball === null) return 1; // Reverse: nulls last
                      if (b.ball === null) return -1;
                      return b.ball - a.ball; // Reverse: higher ball first
                    }
                    const typeOrder = { 'pre-ball': 0, ball: 1, 'post-ball': 2 };
                    const orderA = typeOrder[a.commentaryType] ?? 1;
                    const orderB = typeOrder[b.commentaryType] ?? 1;
                    if (orderA !== orderB) return orderB - orderA; // Reverse
                    return b.order - a.order; // Reverse: higher order first
                  })
                  .map((entry) => {
                    const isEditing = editingId === (entry._id || entry.id);

                    return (
                      <div
                        key={entry._id || entry.id}
                        className="p-5 border-2 border-slate-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold">
                                Over {entry.over}
                                {entry.ball !== null && `.${entry.ball}`}
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
                                      setEditText('');
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
                                onClick={() => {
                                  setEditingId(entry._id || entry.id || null);
                                  setEditText(entry.commentary);
                                }}
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
  );
}
