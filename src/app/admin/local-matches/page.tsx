'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Trophy,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

interface LocalMatch {
  _id: string;
  matchId: string;
  series: string;
  format: string;
  status: 'live' | 'completed' | 'upcoming' | 'cancelled';
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
  localLocation: {
    city: string;
    district?: string;
    area?: string;
  };
  scorerInfo: {
    scorerId: string;
    scorerName: string;
    scorerType: string;
    verificationStatus: string;
  };
  isVerified: boolean;
  currentScore?: {
    home: { runs: number; wickets: number; overs: number };
    away: { runs: number; wickets: number; overs: number };
  };
  createdAt: string;
}

export default function LocalMatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<LocalMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    city: '',
    district: '',
    scorerId: '',
    isVerified: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '20');

      if (filters.status) params.append('status', filters.status);
      if (filters.city) params.append('city', filters.city);
      if (filters.district) params.append('district', filters.district);
      if (filters.scorerId) params.append('scorerId', filters.scorerId);
      if (filters.isVerified) params.append('isVerified', filters.isVerified);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`${base}/api/v1/admin/local-matches?${params.toString()}`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data.data?.matches || []);
        setTotalPages(data.data?.pagination?.pages || 1);
        setTotal(data.data?.pagination?.total || 0);
      } else {
        console.error('Failed to load matches');
      }
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const handleDelete = async (matchId: string) => {
    if (!confirm('Are you sure you want to delete this match? This action cannot be undone.')) {
      return;
    }

    setDeletingId(matchId);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/v1/admin/local-matches/${matchId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        loadMatches();
      } else {
        alert('Failed to delete match');
      }
    } catch (error) {
      console.error('Error deleting match:', error);
      alert('Error deleting match');
    } finally {
      setDeletingId(null);
    }
  };

  const handleVerify = async (matchId: string, isVerified: boolean) => {
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
        loadMatches();
      } else {
        alert('Failed to update verification status');
      }
    } catch (error) {
      console.error('Error updating verification:', error);
      alert('Error updating verification status');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      live: { bg: 'bg-red-100 text-red-800', icon: <Clock className="h-3 w-3" />, label: 'Live' },
      completed: {
        bg: 'bg-gray-100 text-gray-800',
        icon: <CheckCircle className="h-3 w-3" />,
        label: 'Completed',
      },
      upcoming: {
        bg: 'bg-blue-100 text-blue-800',
        icon: <Calendar className="h-3 w-3" />,
        label: 'Upcoming',
      },
      cancelled: {
        bg: 'bg-yellow-100 text-yellow-800',
        icon: <XCircle className="h-3 w-3" />,
        label: 'Cancelled',
      },
    };
    const badge = badges[status as keyof typeof badges] || badges.upcoming;
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${badge.bg}`}
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
      'first-class': 'FC',
      'list-a': 'List A',
    };
    return formatMap[format] || format.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Local Matches</h1>
          <p className="text-sm text-slate-600 mt-1">Manage community-created cricket matches</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-sm font-medium text-slate-600">Total Matches</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{total}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-sm font-medium text-slate-600">Live</div>
          <div className="mt-1 text-2xl font-bold text-red-600">
            {matches.filter((m) => m.status === 'live').length}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-sm font-medium text-slate-600">Verified</div>
          <div className="mt-1 text-2xl font-bold text-green-600">
            {matches.filter((m) => m.isVerified).length}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-sm font-medium text-slate-600">Pending</div>
          <div className="mt-1 text-2xl font-bold text-yellow-600">
            {matches.filter((m) => !m.isVerified).length}
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">All</option>
                <option value="live">Live</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                placeholder="Filter by city"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
              <input
                type="text"
                value={filters.district}
                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                placeholder="Filter by district"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Verification</label>
              <select
                value={filters.isVerified}
                onChange={(e) => setFilters({ ...filters, isVerified: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search matches..."
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() =>
                  setFilters({
                    status: '',
                    city: '',
                    district: '',
                    scorerId: '',
                    isVerified: '',
                    search: '',
                  })
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Matches Table */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-600">Loading matches...</div>
        ) : matches.length === 0 ? (
          <div className="p-8 text-center text-slate-600">No matches found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                    Match
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                    Scorer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                    Verification
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {matches.map((match) => (
                  <tr key={match._id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-slate-900">
                            {match.teams.home.name} vs {match.teams.away.name}
                          </div>
                          <div className="text-sm text-slate-600">{match.series}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {getFormatBadge(match.format)} •{' '}
                            {new Date(match.startTime).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">{getStatusBadge(match.status)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <MapPin className="h-4 w-4" />
                        <span>{match.localLocation.city}</span>
                        {match.localLocation.district && (
                          <span className="text-slate-400">• {match.localLocation.district}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-slate-900">
                          {match.scorerInfo.scorerName}
                        </div>
                        <div className="text-xs text-slate-500">{match.scorerInfo.scorerType}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {match.isVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          <AlertCircle className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {new Date(match.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/local-matches/${match.matchId}`}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleVerify(match.matchId, !match.isVerified)}
                          className={`rounded-lg p-2 ${
                            match.isVerified
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={match.isVerified ? 'Unverify' : 'Verify'}
                        >
                          {match.isVerified ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(match.matchId)}
                          disabled={deletingId === match.matchId}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing page {page} of {totalPages} ({total} total matches)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
