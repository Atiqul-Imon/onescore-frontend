'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface CommentaryEntry {
  ball: string;
  commentary: string;
  over: number;
  ballNumber: number;
  runs: number;
  wickets?: number;
  batsman?: string;
  bowler?: string;
  timestamp?: string;
}

interface MatchCommentaryProps {
  matchId: string;
}

export function MatchCommentary({ matchId }: MatchCommentaryProps) {
  const [commentary, setCommentary] = useState<CommentaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const commentaryEndRef = useRef<HTMLDivElement>(null);

  const fetchCommentary = async () => {
    try {
      setError(null);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/cricket/matches/${matchId}/commentary`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to load commentary');
      }

      const json = await response.json();
      
      if (json.success && json.data) {
        // Sort by over and ball number (newest first)
        const sorted = (json.data as CommentaryEntry[]).sort((a, b) => {
          if (a.over !== b.over) return b.over - a.over;
          return b.ballNumber - a.ballNumber;
        });
        setCommentary(sorted);
      }
    } catch (err: any) {
      console.error('Error fetching commentary:', err);
      setError(err.message || 'Failed to load commentary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommentary();

    if (autoRefresh) {
      const interval = setInterval(fetchCommentary, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId, autoRefresh]);

  // Auto-scroll to bottom when new commentary arrives
  useEffect(() => {
    if (commentaryEndRef.current && autoRefresh) {
      commentaryEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commentary, autoRefresh]);

  if (loading && commentary.length === 0) {
    return (
      <Card>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading commentary...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5" />
            <span className="font-semibold text-lg">Ball-by-Ball Commentary</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="text-sm font-medium hover:text-blue-100 transition-colors"
            >
              {autoRefresh ? 'Auto-refresh: ON' : 'Auto-refresh: OFF'}
            </button>
            <button
              onClick={fetchCommentary}
              className="p-1.5 rounded hover:bg-blue-600 transition-colors"
              title="Refresh commentary"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {error ? (
          <div className="p-6 text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={fetchCommentary}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : commentary.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No commentary available yet.</p>
            <p className="text-sm mt-2">Commentary will appear here once the match starts.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {commentary.map((entry, index) => (
              <div
                key={`${entry.over}.${entry.ballNumber}-${index}`}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {entry.over}.{entry.ballNumber}
                    </div>
                    {entry.timestamp && (
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTime(entry.timestamp)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {entry.runs > 0 && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs font-semibold">
                          {entry.runs} {entry.runs === 1 ? 'run' : 'runs'}
                        </span>
                      )}
                      {entry.wickets && entry.wickets > 0 && (
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">
                          Wicket!
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 leading-relaxed">{entry.commentary}</p>
                    {(entry.batsman || entry.bowler) && (
                      <div className="mt-2 text-xs text-gray-500">
                        {entry.batsman && <span>Batting: {entry.batsman}</span>}
                        {entry.batsman && entry.bowler && <span> • </span>}
                        {entry.bowler && <span>Bowling: {entry.bowler}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={commentaryEndRef} />
          </div>
        )}
      </div>
    </Card>
  );
}

