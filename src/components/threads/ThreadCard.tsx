'use client';

import { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Share,
  Bookmark,
  Flag,
  MoreHorizontal,
  Pin,
  Lock,
  Award,
  Clock,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

interface ThreadCardProps {
  thread: {
    _id: string;
    title: string;
    content: string;
    author: {
      _id: string;
      name: string;
      avatar?: string;
    };
    category: string;
    tags: string[];
    flair?: string;
    upvotes: number;
    downvotes: number;
    score: number;
    views: number;
    commentCount: number;
    isPinned: boolean;
    isLocked: boolean;
    createdAt: string;
    lastActivity: string;
    media?: {
      type: 'image' | 'video' | 'link';
      url: string;
      thumbnail?: string;
      title?: string;
    };
    awards: Array<{
      type: string;
      count: number;
    }>;
  };
  onVote?: (threadId: string, voteType: 'upvote' | 'downvote') => void;
  onReport?: (threadId: string, reason: string) => void;
  onBookmark?: (threadId: string) => void;
  userVote?: 'upvote' | 'downvote' | null;
  isBookmarked?: boolean;
}

export function ThreadCard({
  thread,
  onVote,
  onReport,
  onBookmark,
  userVote,
  isBookmarked,
}: ThreadCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      cricket: 'bg-green-100 text-green-800',
      football: 'bg-blue-100 text-blue-800',
      general: 'bg-gray-100 text-gray-800',
      news: 'bg-red-100 text-red-800',
      discussion: 'bg-purple-100 text-purple-800',
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200">
      {/* Thread Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {thread.isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
            {thread.isLocked && <Lock className="w-4 h-4 text-red-500" />}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(thread.category)}`}
            >
              {thread.category}
            </span>
            {thread.flair && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {thread.flair}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{formatTime(thread.createdAt)}</span>
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <Link href={`/threads/${thread._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer mb-2">
            {thread.title}
          </h3>
        </Link>

        <div className="text-gray-700 text-sm line-clamp-3 mb-3">{thread.content}</div>

        {/* Media Preview */}
        {thread.media && (
          <div className="mb-3">
            {thread.media.type === 'image' && (
              <img
                src={thread.media.thumbnail || thread.media.url}
                alt={thread.content ? `${thread.content.substring(0, 100)}...` : 'Thread image'}
                className="w-full rounded-lg bg-gray-100 shadow-sm"
                style={{ maxHeight: '360px', objectFit: 'contain' }}
              />
            )}
            {thread.media.type === 'link' && (
              <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-blue-600 font-medium">
                    {thread.media.title || 'External Link'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {thread.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
            {thread.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{thread.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {thread.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-600">u/{thread.author.name}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{formatTime(thread.lastActivity)}</span>
          </div>
        </div>
      </div>

      {/* Thread Actions */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
        <div className="flex items-center space-x-4">
          {/* Voting */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onVote?.(thread._id, 'upvote')}
              className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                userVote === 'upvote' ? 'text-orange-500' : 'text-gray-500'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <span
              className={`text-sm font-medium px-1 ${
                thread.score > 0
                  ? 'text-orange-500'
                  : thread.score < 0
                    ? 'text-blue-500'
                    : 'text-gray-500'
              }`}
            >
              {thread.score}
            </span>
            <button
              onClick={() => onVote?.(thread._id, 'downvote')}
              className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                userVote === 'downvote' ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          {/* Comments */}
          <Link href={`/threads/${thread._id}`}>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{thread.commentCount}</span>
            </button>
          </Link>

          {/* Share */}
          <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
            <Share className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => onBookmark?.(thread._id)}
            className={`flex items-center space-x-1 transition-colors ${
              isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="text-sm">Save</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{thread.views}</span>
          </div>
          {thread.awards.length > 0 && (
            <div className="flex items-center space-x-1">
              <Award className="w-4 h-4 text-yellow-500" />
              <span>{thread.awards.reduce((sum, award) => sum + award.count, 0)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Menu */}
      {showActions && (
        <div className="absolute right-4 top-16 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            <Flag className="w-4 h-4" />
            <span>Report</span>
          </button>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Report Thread</h3>
            <div className="space-y-2">
              {['spam', 'harassment', 'hate_speech', 'misinformation', 'violence', 'other'].map(
                (reason) => (
                  <button
                    key={reason}
                    onClick={() => {
                      onReport?.(thread._id, reason);
                      setShowReportModal(false);
                      setShowActions(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    {reason.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </button>
                )
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
