'use client';

import { useState, useEffect } from 'react';
import { ThreadCard } from './ThreadCard';
import { ThreadFilters } from './ThreadFilters';
import { CreateThreadButton } from './CreateThreadButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface Thread {
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
}

interface ThreadListProps {
  threads: Thread[];
  loading?: boolean;
  onVote?: (threadId: string, voteType: 'upvote' | 'downvote') => void;
  onReport?: (threadId: string, reason: string) => void;
  onBookmark?: (threadId: string) => void;
  userVotes?: { [threadId: string]: 'upvote' | 'downvote' };
  bookmarks?: string[];
  onFilterChange?: (filters: any) => void;
  onSortChange?: (sort: string) => void;
  onSearch?: (query: string) => void;
}

export function ThreadList({
  threads,
  loading = false,
  onVote,
  onReport,
  onBookmark,
  userVotes = {},
  bookmarks = [],
  onFilterChange,
  onSortChange,
  onSearch
}: ThreadListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No threads found</h3>
        <p className="text-gray-500 mb-4">Be the first to start a discussion!</p>
        <CreateThreadButton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
          </button>

          {/* Create Thread Button */}
          <CreateThreadButton />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <ThreadFilters
              onFilterChange={onFilterChange}
              onSortChange={onSortChange}
            />
          </div>
        )}
      </div>

      {/* Threads List */}
      <div className="space-y-4">
        {threads.map((thread) => (
          <ThreadCard
            key={thread._id}
            thread={thread}
            onVote={onVote}
            onReport={onReport}
            onBookmark={onBookmark}
            userVote={userVotes[thread._id]}
            isBookmarked={bookmarks.includes(thread._id)}
          />
        ))}
      </div>
    </div>
  );
}
