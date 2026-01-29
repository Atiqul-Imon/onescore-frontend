'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { RefreshCw, Filter } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [filterOver, setFilterOver] = useState<number | null>(null);
  const commentaryEndRef = useRef<HTMLDivElement>(null);

  // Get unique overs for filter
  const uniqueOvers = Array.from(new Set(commentary.map(c => c.over))).sort((a, b) => b - a);

  const fetchCommentary = async () => {
    try {
      setError(null);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/v1/cricket/matches/${matchId}/commentary`, {
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading commentary...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-white">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-bold text-base sm:text-lg">Ball-by-Ball Commentary</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {uniqueOvers.length > 0 && (
              <div className="relative">
                <select
                  value={filterOver || ''}
                  onChange={(e) => setFilterOver(e.target.value ? parseInt(e.target.value) : null)}
                  className="text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/10 border border-white/20 text-white appearance-none pr-6 sm:pr-8 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="">All Overs</option>
                  {uniqueOvers.map(over => (
                    <option key={over} value={over} className="text-gray-900">{over}.0 - {over}.6</option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 pointer-events-none" />
              </div>
            )}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="text-xs sm:text-sm font-semibold hover:text-primary-100 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/10 border border-white/20 touch-target"
            >
              {autoRefresh ? 'Auto: ON' : 'Auto: OFF'}
            </button>
            <button
              onClick={fetchCommentary}
              className="p-2 sm:p-2.5 rounded-lg hover:bg-white/20 transition-colors border border-white/20 touch-target"
              title="Refresh commentary"
            >
              <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto scrollbar-hide">
        {error ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="mb-4 text-red-600">
              <p className="font-semibold text-sm sm:text-base">{error}</p>
            </div>
            <button
              onClick={fetchCommentary}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm sm:text-base shadow-md touch-target"
            >
              Retry
            </button>
          </div>
        ) : commentary.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="mb-4 text-gray-500">
              <p className="font-semibold text-sm sm:text-base">No commentary available yet.</p>
              <p className="text-xs sm:text-sm mt-2 text-gray-400">Commentary will appear here once the match starts.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {(filterOver !== null 
                ? commentary.filter(c => c.over === filterOver)
                : commentary
              ).map((entry, index) => {
                const isBoundary = entry.runs === 4 || entry.runs === 6;
                const isWicket = entry.wickets && entry.wickets > 0;
                
                return (
                  <motion.div
                    key={`${entry.over}.${entry.ballNumber}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 sm:p-4 sm:p-5 hover:bg-primary-50/50 transition-colors border-l-4 ${
                      isWicket 
                        ? 'border-l-red-500 bg-red-50/30' 
                        : isBoundary 
                        ? 'border-l-primary-500 bg-primary-50/30' 
                        : 'border-l-transparent hover:border-l-primary-400'
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-16 sm:w-20 text-right">
                        <div className="text-sm sm:text-base font-bold text-secondary-900 tabular-nums">
                          {entry.over}.{entry.ballNumber}
                        </div>
                        {entry.timestamp && (
                          <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 font-medium">
                            {formatTime(entry.timestamp)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                          {entry.runs > 0 && (
                            <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-xs font-bold border ${
                              entry.runs === 6
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                : entry.runs === 4
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : 'bg-primary-100 text-primary-800 border-primary-200'
                            }`}>
                              {entry.runs} {entry.runs === 1 ? 'run' : 'runs'}
                            </span>
                          )}
                          {isWicket && (
                            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-red-100 text-red-800 text-xs font-bold border border-red-300 animate-pulse">
                              🎯 Wicket!
                            </span>
                          )}
                        </div>
                        <p className="text-gray-800 leading-relaxed font-medium text-sm sm:text-base">{entry.commentary}</p>
                        {(entry.batsman || entry.bowler) && (
                          <div className="mt-2 text-[10px] sm:text-xs text-gray-600 font-medium flex flex-wrap gap-x-2">
                            {entry.batsman && <span className="text-secondary-700">Batting: {entry.batsman}</span>}
                            {entry.batsman && entry.bowler && <span className="text-gray-400">•</span>}
                            {entry.bowler && <span className="text-secondary-700">Bowling: {entry.bowler}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={commentaryEndRef} />
          </div>
        )}
      </div>
    </Card>
  );
}

