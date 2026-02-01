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
  Mail,
  Phone,
  Shield,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

interface Scorer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  scorerProfile: {
    isScorer: boolean;
    scorerId: string;
    scorerType: 'official' | 'volunteer' | 'community';
    verificationStatus: 'pending' | 'verified' | 'suspended';
    location?: {
      city: string;
      district?: string;
      area?: string;
    };
    matchesScored: number;
    accuracyScore: number;
  };
  createdAt: string;
  lastLogin?: string;
}

interface Match {
  matchId: string;
  series: string;
  format: string;
  status: 'live' | 'completed' | 'upcoming' | 'cancelled';
  startTime: string;
  teams: {
    home: { name: string };
    away: { name: string };
  };
  isVerified: boolean;
}

export default function ScorerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const scorerId = params.id as string;
  const [scorer, setScorer] = useState<Scorer | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [matchesPage, setMatchesPage] = useState(1);
  const [matchesTotal, setMatchesTotal] = useState(0);

  useEffect(() => {
    loadScorer();
    loadMatches();
  }, [scorerId, matchesPage]);

  const loadScorer = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/v1/admin/scorers/${scorerId}`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        setScorer(data.data || data);
      } else {
        setError('Failed to load scorer');
      }
    } catch (err) {
      setError('Error loading scorer');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${base}/api/v1/admin/scorers/${scorerId}/matches?page=${matchesPage}&limit=10`,
        {
          headers: getAuthHeaders(),
          cache: 'no-store',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || data.data?.matches || []);
        setMatchesTotal(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Error loading matches:', err);
    }
  };

  const handleVerification = async (status: 'verified' | 'pending' | 'suspended') => {
    if (!scorer) return;

    setUpdating(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/v1/admin/scorers/${scorerId}/verification`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationStatus: status }),
      });

      if (response.ok) {
        loadScorer();
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

  const getStatusBadge = (status: string) => {
    const badges = {
      verified: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="h-4 w-4" /> },
      pending: { bg: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> },
      suspended: { bg: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${badge.bg}`}
      >
        {badge.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-slate-600">Loading scorer details...</div>
      </div>
    );
  }

  if (error || !scorer) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <div className="text-lg font-medium text-slate-900 mb-2">{error || 'Scorer not found'}</div>
        <Link href="/admin/scorers" className="text-blue-600 hover:text-blue-700">
          ← Back to scorers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/scorers" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{scorer.name}</h1>
            <p className="text-sm text-slate-600 mt-1">{scorer.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(scorer.scorerProfile.verificationStatus)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
        {scorer.scorerProfile.verificationStatus !== 'verified' && (
          <button
            onClick={() => handleVerification('verified')}
            disabled={updating}
            className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            Verify Scorer
          </button>
        )}
        {scorer.scorerProfile.verificationStatus !== 'suspended' && (
          <button
            onClick={() => handleVerification('suspended')}
            disabled={updating}
            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            Suspend Scorer
          </button>
        )}
        {scorer.scorerProfile.verificationStatus === 'suspended' && (
          <button
            onClick={() => handleVerification('pending')}
            disabled={updating}
            className="flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100 disabled:opacity-50"
          >
            <Clock className="h-4 w-4" />
            Restore Scorer
          </button>
        )}
      </div>

      {/* Scorer Details Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-600">Name</div>
              <div className="mt-1 text-sm text-slate-900">{scorer.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">Email</div>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-900">
                <Mail className="h-4 w-4" />
                {scorer.email}
              </div>
            </div>
            {scorer.phone && (
              <div>
                <div className="text-sm font-medium text-slate-600">Phone</div>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-900">
                  <Phone className="h-4 w-4" />
                  {scorer.phone}
                </div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-slate-600">Role</div>
              <div className="mt-1 text-sm text-slate-900 capitalize">{scorer.role}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">Account Status</div>
              <div className="mt-1">
                {scorer.isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    <AlertCircle className="h-3 w-3" />
                    Unverified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scorer Profile */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Scorer Profile</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-600">Scorer ID</div>
              <div className="mt-1 font-mono text-sm text-slate-900">
                {scorer.scorerProfile.scorerId}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">Scorer Type</div>
              <div className="mt-1 text-sm text-slate-900 capitalize">
                {scorer.scorerProfile.scorerType}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">Matches Scored</div>
              <div className="mt-1 flex items-center gap-2 text-lg font-bold text-slate-900">
                <Trophy className="h-5 w-5" />
                {scorer.scorerProfile.matchesScored}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600">Accuracy Score</div>
              <div className="mt-1 text-lg font-bold text-slate-900">
                {scorer.scorerProfile.accuracyScore}%
              </div>
            </div>
            {scorer.scorerProfile.location && (
              <div>
                <div className="text-sm font-medium text-slate-600">Location</div>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-900">
                  <MapPin className="h-4 w-4" />
                  {scorer.scorerProfile.location.city}
                  {scorer.scorerProfile.location.district &&
                    `, ${scorer.scorerProfile.location.district}`}
                  {scorer.scorerProfile.location.area && `, ${scorer.scorerProfile.location.area}`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Matches Section */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Matches Created</h2>
          <div className="text-sm text-slate-600">{matchesTotal} total matches</div>
        </div>
        {matches.length === 0 ? (
          <div className="py-8 text-center text-slate-600">No matches found</div>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <Link
                key={match.matchId}
                href={`/admin/local-matches/${match.matchId}`}
                className="block rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900">
                      {match.teams.home.name} vs {match.teams.away.name}
                    </div>
                    <div className="text-sm text-slate-600">{match.series}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {new Date(match.startTime).toLocaleDateString()} •{' '}
                      {match.format.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        match.status === 'live'
                          ? 'bg-red-100 text-red-800'
                          : match.status === 'completed'
                            ? 'bg-gray-100 text-gray-800'
                            : match.status === 'upcoming'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {match.status}
                    </span>
                    {match.isVerified ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <Eye className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {matchesTotal > 10 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setMatchesPage(Math.max(1, matchesPage - 1))}
              disabled={matchesPage === 1}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {matchesPage} of {Math.ceil(matchesTotal / 10)}
            </span>
            <button
              onClick={() =>
                setMatchesPage(Math.min(Math.ceil(matchesTotal / 10), matchesPage + 1))
              }
              disabled={matchesPage >= Math.ceil(matchesTotal / 10)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Account Metadata</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-slate-600">Created At</div>
            <div className="mt-1 text-slate-900">{new Date(scorer.createdAt).toLocaleString()}</div>
          </div>
          {scorer.lastLogin && (
            <div>
              <div className="font-medium text-slate-600">Last Login</div>
              <div className="mt-1 text-slate-900">
                {new Date(scorer.lastLogin).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
