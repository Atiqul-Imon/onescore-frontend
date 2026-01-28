'use client';

import Link from 'next/link';
import { ArrowLeft, Trophy, MapPin, Calendar, Share2, Heart, RefreshCw, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface MatchHeaderProps {
  match: {
    _id: string;
    matchId: string;
    name?: string;
    teams: {
      home: {
        name: string;
        shortName: string;
        flag: string;
      };
      away: {
        name: string;
        shortName: string;
        flag: string;
      };
    };
    status: 'live' | 'completed' | 'upcoming' | 'cancelled';
    format: string;
    series?: string;
    startTime: string;
    venue: {
      name: string;
      city: string;
      country: string;
    };
    currentScore?: {
      home: {
        runs: number;
        wickets: number;
        overs: number;
        balls: number;
      };
      away: {
        runs: number;
        wickets: number;
        overs: number;
        balls: number;
      };
    };
    result?: {
      winner: 'home' | 'away';
      winnerName: string;
      margin: number;
      marginType: 'runs' | 'wickets';
      resultText: string;
    };
  };
  onRefresh?: () => void;
}

export function MatchHeader({ match, onRefresh }: MatchHeaderProps) {
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';
  const homeScore = match.currentScore?.home;
  const awayScore = match.currentScore?.away;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${match.teams.home.name} vs ${match.teams.away.name}`,
        text: `Check out this cricket match on ScoreNews`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="bg-gradient-to-b from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Top Bar - Back Button and Actions */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 sm:gap-2 text-white/80 hover:text-white transition-colors text-xs sm:text-sm font-medium touch-target"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden xs:inline">Back to Home</span>
            <span className="xs:hidden">Back</span>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all touch-target"
                aria-label="Refresh match"
                title="Refresh match"
              >
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all touch-target"
              aria-label="Share match"
              title="Share match"
            >
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              className="p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all touch-target"
              aria-label="Favorite match"
              title="Favorite match"
            >
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Match Info Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Series and Format Badge */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/70 mb-3 sm:mb-4">
            <span className="inline-flex items-center gap-1.5 sm:gap-2">
              <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-400 flex-shrink-0" />
              <span className="truncate">{match.series || 'Cricket Match'}</span>
            </span>
            <span className="hidden sm:inline text-white/40">•</span>
            <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md bg-white/10 backdrop-blur-sm text-white/90 font-semibold text-xs sm:text-sm border border-white/20">
              {match.format?.toUpperCase() || 'MATCH'}
            </span>
            {isLive && (
              <>
                <span className="hidden sm:inline text-white/40">•</span>
                <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 font-bold text-xs sm:text-sm animate-pulse">
                  <span className="live-dot bg-red-500 animate-pulse" />
                  LIVE
                </span>
              </>
            )}
            {isCompleted && match.result && (
              <>
                <span className="hidden sm:inline text-white/40">•</span>
                <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gray-500/20 backdrop-blur-sm border border-gray-400/30 text-gray-300 font-semibold text-xs sm:text-sm">
                  COMPLETED
                </span>
              </>
            )}
          </div>

          {/* Team Names */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 leading-tight">
            <span className="block sm:inline">{match.teams.home.name}</span>
            <span className="hidden sm:inline text-white/60 font-normal mx-2 sm:mx-3">vs</span>
            <span className="sm:hidden text-white/60 font-normal mx-1.5">v</span>
            <span className="block sm:inline">{match.teams.away.name}</span>
          </h1>

          {/* Scores - Prominent Display */}
          {(homeScore || awayScore) && (
            <div className="mb-4 sm:mb-5 space-y-3 sm:space-y-4">
              {/* Home Team Score */}
              <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-white/10">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <span className="text-2xl sm:text-3xl flex-shrink-0">{match.teams.home.flag}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base sm:text-lg text-white truncate">{match.teams.home.name}</h3>
                    <p className="text-xs sm:text-sm text-white/60">{match.teams.home.shortName}</p>
                  </div>
                </div>
                {homeScore && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tabular-nums">
                      {homeScore.runs}
                      {homeScore.wickets !== undefined && (
                        <span className="text-xl sm:text-2xl md:text-3xl text-white/70 font-normal">/{homeScore.wickets}</span>
                      )}
                    </div>
                    {homeScore.overs > 0 && (
                      <div className="text-xs sm:text-sm text-white/60 mt-1">
                        ({homeScore.overs}.{homeScore.balls} ov)
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Away Team Score */}
              <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-white/10">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <span className="text-2xl sm:text-3xl flex-shrink-0">{match.teams.away.flag}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base sm:text-lg text-white truncate">{match.teams.away.name}</h3>
                    <p className="text-xs sm:text-sm text-white/60">{match.teams.away.shortName}</p>
                  </div>
                </div>
                {awayScore && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tabular-nums">
                      {awayScore.runs}
                      {awayScore.wickets !== undefined && (
                        <span className="text-xl sm:text-2xl md:text-3xl text-white/70 font-normal">/{awayScore.wickets}</span>
                      )}
                    </div>
                    {awayScore.overs > 0 && (
                      <div className="text-xs sm:text-sm text-white/60 mt-1">
                        ({awayScore.overs}.{awayScore.balls} ov)
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Result Text for Completed Matches */}
              {isCompleted && match.result && (
                <div className="text-center px-4 py-3 bg-primary-500/20 backdrop-blur-sm rounded-xl border border-primary-400/30">
                  <p className="text-base sm:text-lg font-bold text-primary-200">
                    {match.result.resultText}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Venue and Date Info */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/80">
            <span className="inline-flex items-center gap-1.5 sm:gap-2">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{match.venue.name}, {match.venue.city}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 sm:gap-2">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="hidden sm:inline">
                {new Date(match.startTime).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="sm:hidden">
                {new Date(match.startTime).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

