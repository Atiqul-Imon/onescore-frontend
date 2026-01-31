'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Trophy, Clock, Target } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface MatchScorecardProps {
  match: {
    _id: string;
    matchId: string;
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
    startTime: string;
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
    score?: {
      home: number;
      away: number;
    };
    innings?: Array<{
      number: number;
      team: string;
      teamId?: string;
      runs: number;
      wickets: number;
      overs: number;
      balls: number;
      runRate: number;
    }>;
    matchNote?: string;
    round?: string;
    tossWon?: string;
    elected?: string;
    target?: number;
    result?: {
      winner: 'home' | 'away';
      winnerName: string;
      margin: number;
      marginType: 'runs' | 'wickets';
      resultText: string;
    };
  };
}

export function MatchScorecard({ match }: MatchScorecardProps) {
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';
  const isUpcoming = match.status === 'upcoming';

  const getScoreDisplay = (side: 'home' | 'away') => {
    if (isLive && match.currentScore) {
      const score = match.currentScore[side];
      return {
        runs: score.runs,
        wickets: score.wickets,
        overs: `${score.overs}.${score.balls}`,
        full: `${score.runs}/${score.wickets} (${score.overs}.${score.balls} ov)`,
      };
    }
    if (isCompleted && match.score) {
      return {
        runs: match.score[side],
        wickets: undefined,
        overs: undefined,
        full: match.score[side].toString(),
      };
    }
    return {
      runs: 0,
      wickets: undefined,
      overs: undefined,
      full: '—',
    };
  };

  const homeScore = getScoreDisplay('home');
  const awayScore = getScoreDisplay('away');

  return (
    <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-6 py-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-primary-100" />
            <span className="font-bold text-lg">Scorecard</span>
          </div>
          {isLive && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30">
              <span className="live-dot bg-white animate-pulse" />
              <span className="text-sm font-semibold">Live</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Team 1 Score - Cricinfo Style */}
        <div className="border-b-2 border-gray-200 pb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{match.teams.home.flag}</span>
              <div>
                <Link
                  href={`/cricket/match/${match.matchId}/team/${encodeURIComponent(match.teams.home.name.toLowerCase().replace(/\s+/g, '-'))}`}
                  className="hover:text-primary-600 transition-colors"
                >
                  <h3 className="font-bold text-xl text-secondary-900">{match.teams.home.name}</h3>
                </Link>
                <p className="text-sm text-gray-600 font-medium">{match.teams.home.shortName}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-secondary-900">
                {homeScore.runs}
                {homeScore.wickets !== undefined && (
                  <span className="text-2xl text-gray-600 font-normal">/{homeScore.wickets}</span>
                )}
              </div>
              {homeScore.wickets !== undefined && homeScore.overs && (
                <div className="text-sm text-gray-600 font-medium mt-1">
                  {homeScore.wickets} wickets • {homeScore.overs} overs
                </div>
              )}
            </div>
          </div>
          {homeScore.overs && parseFloat(homeScore.overs) > 0 && (
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 font-semibold">
                RR: {(homeScore.runs / parseFloat(homeScore.overs) || 0).toFixed(2)}
              </span>
              {isLive && (
                <span className="text-gray-600">
                  {match.currentScore?.home.balls !== undefined &&
                    `${match.currentScore.home.balls} balls`}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Team 2 Score - Cricinfo Style */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{match.teams.away.flag}</span>
              <div>
                <Link
                  href={`/cricket/match/${match.matchId}/team/${encodeURIComponent(match.teams.away.name.toLowerCase().replace(/\s+/g, '-'))}`}
                  className="hover:text-primary-600 transition-colors"
                >
                  <h3 className="font-bold text-xl text-secondary-900">{match.teams.away.name}</h3>
                </Link>
                <p className="text-sm text-gray-600 font-medium">{match.teams.away.shortName}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-secondary-900">
                {awayScore.runs}
                {awayScore.wickets !== undefined && (
                  <span className="text-2xl text-gray-600 font-normal">/{awayScore.wickets}</span>
                )}
              </div>
              {awayScore.wickets !== undefined && awayScore.overs && (
                <div className="text-sm text-gray-600 font-medium mt-1">
                  {awayScore.wickets} wickets • {awayScore.overs} overs
                </div>
              )}
            </div>
          </div>
          {awayScore.overs && parseFloat(awayScore.overs) > 0 && (
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 font-semibold">
                RR: {(awayScore.runs / parseFloat(awayScore.overs) || 0).toFixed(2)}
              </span>
              {isLive && (
                <span className="text-gray-600">
                  {match.currentScore?.away.balls !== undefined &&
                    `${match.currentScore.away.balls} balls`}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Match Note / Target - Cricinfo Style (Only for live matches or if different from result) */}
        {match.matchNote && match.status !== 'completed' && (
          <div className="pt-4 border-t-2 border-primary-200 bg-primary-50/50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm font-semibold text-primary-800 uppercase tracking-wide mb-1">
                Match Status
              </p>
              <p className="text-lg font-bold text-secondary-900">{match.matchNote}</p>
              {match.target && (
                <p className="text-sm text-gray-600 mt-1">Target: {match.target} runs</p>
              )}
            </div>
          </div>
        )}
        {/* For completed matches, only show target if result doesn't already show it */}
        {match.status === 'completed' &&
          match.target &&
          match.result &&
          !match.result.resultText.includes(`Target ${match.target}`) && (
            <div className="pt-4 border-t-2 border-primary-200 bg-primary-50/50 rounded-lg p-4">
              <div className="text-center">
                <p className="text-sm font-semibold text-primary-800 uppercase tracking-wide mb-1">
                  Target
                </p>
                <p className="text-lg font-bold text-secondary-900">Target: {match.target} runs</p>
              </div>
            </div>
          )}

        {/* Toss Information */}
        {(match.tossWon || match.elected) && (
          <div className="pt-4 border-t-2 border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Toss:</span>
              <span className="text-gray-900 font-semibold">
                {match.elected
                  ? `${match.tossWon} choose to ${match.elected.charAt(0).toUpperCase() + match.elected.slice(1)} First`
                  : `${match.tossWon} won the toss`}
              </span>
            </div>
          </div>
        )}

        {/* Innings Breakdown - Cricinfo Style */}
        {match.innings && match.innings.length > 0 && (
          <div className="pt-6 border-t-2 border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
              Innings Summary
            </h3>
            <div className="space-y-4">
              {match.innings.map((inning, index) => (
                <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-900">{inning.team}</p>
                      <p className="text-xs text-gray-600">Innings {inning.number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-secondary-900">
                        {inning.runs}
                        {inning.wickets > 0 && (
                          <span className="text-lg text-gray-600">/{inning.wickets}</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">
                        {inning.overs.toFixed(1)} overs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Run Rate</p>
                      <p className="text-sm font-bold text-primary-700">
                        {inning.runRate.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Wickets</p>
                      <p className="text-sm font-bold text-gray-900">{inning.wickets}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Overs</p>
                      <p className="text-sm font-bold text-gray-900">{inning.overs.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Match Status - Cricinfo Style */}
        <div className="pt-6 border-t-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Clock className="h-4 w-4 text-primary-600" />
              <span className="font-medium">
                {isUpcoming
                  ? `Starts at ${formatTime(match.startTime)}`
                  : isLive
                    ? 'Match in Progress'
                    : `Completed on ${new Date(match.startTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}`}
              </span>
            </div>
            <span className="px-4 py-2 rounded-lg bg-primary-100 text-primary-800 font-bold text-sm">
              {match.format?.toUpperCase() || 'MATCH'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
