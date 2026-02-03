'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Filter,
  MessageSquare,
  Plus,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  Play,
  Square,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

interface Match {
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
  currentScore?: {
    home: { runs: number; wickets: number; overs: number; balls: number };
    away: { runs: number; wickets: number; overs: number; balls: number };
  };
}

export default function CommentaryManagementPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('live');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadMatches();
  }, [statusFilter]);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // Fetch live matches from SportsMonk API
      const response = await fetch(`${base}/api/v1/cricket/matches/live`, {
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        let allMatches: Match[] = data.data || [];

        // Also fetch local matches
        try {
          const localResponse = await fetch(
            `${base}/api/v1/admin/local-matches?status=${statusFilter}&limit=50`,
            {
              headers: getAuthHeaders(),
              cache: 'no-store',
            }
          );
          if (localResponse.ok) {
            const localData = await localResponse.json();
            const localMatches = (localData.data?.matches || []).map((m: any) => ({
              matchId: m.matchId,
              series: m.series,
              format: m.format,
              status: m.status,
              startTime: m.startTime,
              teams: m.teams,
              venue: m.venue,
              currentScore: m.currentScore,
            }));
            allMatches = [...allMatches, ...localMatches];
          }
        } catch (err) {
          console.error('Error loading local matches:', err);
        }

        // Filter by status
        if (statusFilter && statusFilter !== 'all') {
          allMatches = allMatches.filter((m) => m.status === statusFilter);
        }

        // Filter by search term
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          allMatches = allMatches.filter(
            (m) =>
              m.series.toLowerCase().includes(term) ||
              m.teams.home.name.toLowerCase().includes(term) ||
              m.teams.away.name.toLowerCase().includes(term) ||
              m.venue.name.toLowerCase().includes(term)
          );
        }

        setMatches(allMatches);
      } else {
        console.error('Failed to load matches');
      }
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      live: { bg: 'bg-red-100 text-red-800', icon: <Play className="h-4 w-4" />, label: 'Live' },
      completed: {
        bg: 'bg-gray-100 text-gray-800',
        icon: <CheckCircle2 className="h-4 w-4" />,
        label: 'Completed',
      },
      upcoming: {
        bg: 'bg-blue-100 text-blue-800',
        icon: <Clock className="h-4 w-4" />,
        label: 'Upcoming',
      },
      cancelled: {
        bg: 'bg-yellow-100 text-yellow-800',
        icon: <Square className="h-4 w-4" />,
        label: 'Cancelled',
      },
    };
    const badge = badges[status as keyof typeof badges] || badges.completed;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.bg}`}
      >
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const formatScore = (score: { runs: number; wickets: number; overs: number; balls: number }) => {
    return `${score.runs}/${score.wickets} (${score.overs}.${score.balls})`;
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
        Loading matches...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Commentary Management</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage in-house commentary for cricket matches. Add, edit, and organize commentary
            alongside SportsMonk data.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by series, teams, venue..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Matches</option>
                <option value="live">Live</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={loadMatches}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Matches List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {matches.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 font-semibold">No matches found</p>
            <p className="text-sm text-slate-500 mt-2">
              {searchTerm
                ? 'Try adjusting your search filters'
                : 'No matches available for commentary'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {matches.map((match) => (
              <Link
                key={match.matchId}
                href={`/admin/commentary/${match.matchId}`}
                className="block p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {match.teams.home.name} vs {match.teams.away.name}
                          </h3>
                          {getStatusBadge(match.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4" />
                            <span>{match.series}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {match.venue.name}, {match.venue.city}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(match.startTime).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(match.startTime).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        {match.currentScore && (
                          <div className="mt-3 flex items-center gap-4 text-sm">
                            <div>
                              <span className="font-semibold text-slate-700">
                                {match.teams.home.shortName}:
                              </span>
                              <span className="ml-2 text-slate-600">
                                {formatScore(match.currentScore.home)}
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-slate-700">
                                {match.teams.away.shortName}:
                              </span>
                              <span className="ml-2 text-slate-600">
                                {formatScore(match.currentScore.away)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/commentary/${match.matchId}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold text-sm"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Manage Commentary
                    </Link>
                    <Link
                      href={`/cricket/match/${match.matchId}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      View Match
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
