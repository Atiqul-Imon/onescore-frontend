'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Eye,
  Play,
  Square,
  Ban,
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

interface LocalMatch {
  _id: string;
  matchId: string;
  series: string;
  format: string;
  status: 'live' | 'completed' | 'upcoming' | 'cancelled';
  startTime: string;
  endTime?: string;
  teams: {
    home: { id: string; name: string; shortName: string; flag: string };
    away: { id: string; name: string; shortName: string; flag: string };
  };
  venue: {
    name: string;
    city: string;
    country: string;
    address?: string;
  };
  localLocation: {
    country: string;
    state?: string;
    city: string;
    district?: string;
    area?: string;
  };
  localLeague?: {
    id: string;
    name: string;
    level: string;
    season: string;
    year: number;
  };
  scorerInfo: {
    scorerId: string;
    scorerName: string;
    scorerType: string;
    verificationStatus: string;
    lastUpdate: string;
  };
  isVerified: boolean;
  currentScore?: {
    home: { runs: number; wickets: number; overs: number; balls: number };
    away: { runs: number; wickets: number; overs: number; balls: number };
  };
  createdAt: string;
  updatedAt: string;
}

export default function LocalMatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;
  const [match, setMatch] = useState<LocalMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadMatch();
  }, [matchId]);

  const loadMatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/v1/admin/local-matches/${matchId}`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        setMatch(data.data);
      } else {
        setError('Failed to load match');
      }
    } catch (err) {
      setError('Error loading match');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (isVerified: boolean) => {
    if (!match) return;

    setUpdating(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/v1/admin/local-matches/${matchId}/verify`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVerified }),
      });

      if (response.ok) {
        loadMatch();
      } else {
        alert('Failed to update verification status');
      }
    } catch (err) {
      console.error('Error updating verification:', err);
      alert('Error updating verification status');
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusUpdate = async (newStatus: 'live' | 'completed' | 'upcoming' | 'cancelled') => {
    if (!match) return;

    if (
      !confirm(
        `Are you sure you want to change the match status from "${match.status}" to "${newStatus}"?`
      )
    ) {
      return;
    }

    setUpdatingStatus(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/v1/admin/local-matches/${matchId}/status`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        loadMatch();
      } else {
        alert('Failed to update match status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating match status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this match? This action cannot be undone.')) {
      return;
    }

    setUpdating(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/v1/admin/local-matches/${matchId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        router.push('/admin/local-matches');
      } else {
        alert('Failed to delete match');
      }
    } catch (err) {
      console.error('Error deleting match:', err);
      alert('Error deleting match');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      live: { bg: 'bg-red-100 text-red-800', icon: <Clock className="h-4 w-4" />, label: 'Live' },
      completed: {
        bg: 'bg-gray-100 text-gray-800',
        icon: <CheckCircle className="h-4 w-4" />,
        label: 'Completed',
      },
      upcoming: {
        bg: 'bg-blue-100 text-blue-800',
        icon: <Calendar className="h-4 w-4" />,
        label: 'Upcoming',
      },
      cancelled: {
        bg: 'bg-yellow-100 text-yellow-800',
        icon: <XCircle className="h-4 w-4" />,
        label: 'Cancelled',
      },
    };
    const badge = badges[status as keyof typeof badges] || badges.upcoming;
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${badge.bg}`}
      >
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const getFormatBadge = (format: string) => {
    const formatMap: Record<string, string> = {
      t20: 'T20',
      t20i: 'T20I',
      odi: 'ODI',
      test: 'Test',
      'first-class': 'First Class',
      'list-a': 'List A',
    };
    return formatMap[format] || format.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-slate-600">Loading match details...</div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <div className="text-lg font-medium text-slate-900 mb-2">{error || 'Match not found'}</div>
        <Link href="/admin/local-matches" className="text-blue-600 hover:text-blue-700">
          ← Back to matches
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/local-matches"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {match.teams.home.name} vs {match.teams.away.name}
            </h1>
            <p className="text-sm text-slate-600 mt-1">{match.series}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(match.status)}
          {match.isVerified ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              Pending Verification
            </span>
          )}
        </div>
      </div>

      {/* Status Control */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Match Status Control</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            onClick={() => handleStatusUpdate('live')}
            disabled={match.status === 'live' || updatingStatus}
            className={`flex flex-col items-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
              match.status === 'live'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-slate-300 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50 disabled:opacity-50'
            }`}
          >
            <Play className="h-5 w-5" />
            Set Live
          </button>
          <button
            onClick={() => handleStatusUpdate('completed')}
            disabled={match.status === 'completed' || updatingStatus}
            className={`flex flex-col items-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
              match.status === 'completed'
                ? 'border-gray-500 bg-gray-50 text-gray-700'
                : 'border-slate-300 bg-white text-slate-700 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50'
            }`}
          >
            <CheckCircle className="h-5 w-5" />
            Mark Completed
          </button>
          <button
            onClick={() => handleStatusUpdate('upcoming')}
            disabled={match.status === 'upcoming' || updatingStatus}
            className={`flex flex-col items-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
              match.status === 'upcoming'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50'
            }`}
          >
            <Calendar className="h-5 w-5" />
            Set Upcoming
          </button>
          <button
            onClick={() => handleStatusUpdate('cancelled')}
            disabled={match.status === 'cancelled' || updatingStatus}
            className={`flex flex-col items-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
              match.status === 'cancelled'
                ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                : 'border-slate-300 bg-white text-slate-700 hover:border-yellow-300 hover:bg-yellow-50 disabled:opacity-50'
            }`}
          >
            <Ban className="h-5 w-5" />
            Cancel Match
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <button
          onClick={() => handleVerify(!match.isVerified)}
          disabled={updating}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            match.isVerified
              ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              : 'bg-green-50 text-green-700 hover:bg-green-100'
          } disabled:opacity-50`}
        >
          {match.isVerified ? (
            <>
              <XCircle className="h-4 w-4" />
              Unverify Match
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Verify Match
            </>
          )}
        </button>
        <Link
          href={`/cricket/match/${match.matchId}`}
          target="_blank"
          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Eye className="h-4 w-4" />
          View Public Page
        </Link>
        <button
          onClick={handleDelete}
          disabled={updating}
          className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete Match
        </button>
      </div>

      {/* Match Details Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Match Information</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-600">Match ID</div>
              <div className="mt-1 font-mono text-sm text-slate-900">{match.matchId}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">Format</div>
              <div className="mt-1 text-sm text-slate-900">{getFormatBadge(match.format)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">Series/League</div>
              <div className="mt-1 text-sm text-slate-900">{match.series}</div>
            </div>
            {match.localLeague && (
              <div>
                <div className="text-sm font-medium text-slate-600">League Details</div>
                <div className="mt-1 text-sm text-slate-900">
                  {match.localLeague.name} ({match.localLeague.level}) - {match.localLeague.season}
                </div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-slate-600">Start Time</div>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-900">
                <Calendar className="h-4 w-4" />
                {new Date(match.startTime).toLocaleString()}
              </div>
            </div>
            {match.endTime && (
              <div>
                <div className="text-sm font-medium text-slate-600">End Time</div>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-900">
                  <Calendar className="h-4 w-4" />
                  {new Date(match.endTime).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Teams */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Teams</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
              <div>
                <div className="font-medium text-slate-900">{match.teams.home.name}</div>
                <div className="text-sm text-slate-600">{match.teams.home.shortName}</div>
              </div>
              {match.currentScore && (
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900">
                    {match.currentScore.home.runs}/{match.currentScore.home.wickets}
                  </div>
                  <div className="text-xs text-slate-600">
                    {match.currentScore.home.overs}.{match.currentScore.home.balls} overs
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center text-slate-400">vs</div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
              <div>
                <div className="font-medium text-slate-900">{match.teams.away.name}</div>
                <div className="text-sm text-slate-600">{match.teams.away.shortName}</div>
              </div>
              {match.currentScore && (
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900">
                    {match.currentScore.away.runs}/{match.currentScore.away.wickets}
                  </div>
                  <div className="text-xs text-slate-600">
                    {match.currentScore.away.overs}.{match.currentScore.away.balls} overs
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Venue & Location */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Venue & Location</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-600">Venue</div>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-900">
                <Trophy className="h-4 w-4" />
                {match.venue.name}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {match.venue.city}, {match.venue.country}
              </div>
              {match.venue.address && (
                <div className="mt-1 text-sm text-slate-600">{match.venue.address}</div>
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">Location</div>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-900">
                <MapPin className="h-4 w-4" />
                {match.localLocation.city}
                {match.localLocation.district && `, ${match.localLocation.district}`}
                {match.localLocation.area && `, ${match.localLocation.area}`}
              </div>
              <div className="mt-1 text-sm text-slate-600">{match.localLocation.country}</div>
            </div>
          </div>
        </div>

        {/* Scorer Information */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Scorer Information</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-600">Scorer Name</div>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-900">
                <Users className="h-4 w-4" />
                {match.scorerInfo.scorerName}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">Scorer ID</div>
              <div className="mt-1 font-mono text-sm text-slate-900">
                {match.scorerInfo.scorerId}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">Scorer Type</div>
              <div className="mt-1 text-sm text-slate-900 capitalize">
                {match.scorerInfo.scorerType}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">Verification Status</div>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                    match.scorerInfo.verificationStatus === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : match.scorerInfo.verificationStatus === 'suspended'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {match.scorerInfo.verificationStatus}
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">Last Update</div>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-900">
                <Clock className="h-4 w-4" />
                {new Date(match.scorerInfo.lastUpdate).toLocaleString()}
              </div>
            </div>
            <Link
              href={`/admin/scorers/${match.scorerInfo.scorerId}`}
              className="block text-sm text-blue-600 hover:text-blue-700"
            >
              View Scorer Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Metadata</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-slate-600">Created At</div>
            <div className="mt-1 text-slate-900">{new Date(match.createdAt).toLocaleString()}</div>
          </div>
          <div>
            <div className="font-medium text-slate-600">Last Updated</div>
            <div className="mt-1 text-slate-900">{new Date(match.updatedAt).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
