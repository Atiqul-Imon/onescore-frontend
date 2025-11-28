'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThreadList } from './ThreadList';
import { Button } from '@/components/ui';
import { PageLayout } from '@/components/layout/PageLayout';
import { getAuthHeaders } from '@/lib/auth';

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

export function ThreadsPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    time: 'all',
    tags: [] as string[],
    author: ''
  });
  const [sort, setSort] = useState('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [userVotes, setUserVotes] = useState<{ [threadId: string]: 'upvote' | 'downvote' }>({});
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 20
  });

  useEffect(() => {
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, searchQuery, pagination.current]);

  async function loadThreads() {
    try {
      setLoading(true);
      setError(null);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.limit.toString(),
        sort: sort,
        time: filters.time,
      });

      if (filters.category) params.append('category', filters.category);
      if (searchQuery) params.append('search', searchQuery);
      if (filters.tags.length > 0) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }
      if (filters.author) params.append('author', filters.author);

      const res = await fetch(`${base}/api/threads?${params.toString()}`, {
        cache: 'no-store',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error('Failed to load threads');
      }

      const json = await res.json();
      if (json.success && json.data) {
        const threadsData = json.data.threads || [];
        // Append threads if loading more pages, otherwise replace
        if (pagination.current > 1) {
          setThreads(prev => [...prev, ...threadsData]);
        } else {
          setThreads(threadsData);
        }
        if (json.data.pagination) {
          setPagination(json.data.pagination);
        }
      } else {
        console.error('API response error:', json);
        setError(json.message || 'Failed to load threads');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load threads');
      console.error('Error loading threads:', e);
    } finally {
      setLoading(false);
    }
  }

  const handleVote = async (threadId: string, voteType: 'upvote' | 'downvote') => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/threads/${threadId}/vote`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ voteType }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          // Update local state
          setUserVotes(prev => {
            const currentVote = prev[threadId];
            if (currentVote === voteType) {
              // Remove vote
              const newVotes = { ...prev };
              delete newVotes[threadId];
              return newVotes;
            } else {
              // Change or add vote
              return { ...prev, [threadId]: voteType };
            }
          });

          // Update thread in list
          setThreads(prev => prev.map(thread => {
            if (thread._id === threadId) {
              return {
                ...thread,
                upvotes: json.data.upvotes,
                downvotes: json.data.downvotes,
                score: json.data.score,
              };
            }
            return thread;
          }));
        }
      }
    } catch (e: any) {
      console.error('Error voting:', e);
    }
  };

  const handleReport = async (threadId: string, reason: string) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/threads/${threadId}/report`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });

      if (res.ok) {
        alert('Thread reported successfully');
      }
    } catch (e: any) {
      console.error('Error reporting:', e);
      alert('Failed to report thread');
    }
  };

  const handleBookmark = async (threadId: string) => {
    // Bookmark endpoint pending server support; toggle locally for now
    setBookmarks(prev => 
      prev.includes(threadId) 
        ? prev.filter(id => id !== threadId)
        : [...prev, threadId]
    );
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleLoadMore = () => {
    if (pagination.current < pagination.pages) {
      setPagination(prev => ({ ...prev, current: prev.current + 1 }));
    }
  };

  return (
    <PageLayout
      title="Crowd Thread"
      description="Join the sports community discussions. Share your thoughts, ask questions, and engage with fellow sports fans."
      size="xl"
    >
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <ThreadList
        threads={threads}
        loading={loading}
        onVote={handleVote}
        onReport={handleReport}
        onBookmark={handleBookmark}
        userVotes={userVotes}
        bookmarks={bookmarks}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onSearch={handleSearch}
      />

      {!loading && pagination.current < pagination.pages && (
        <div className="text-center py-8">
          <Button onClick={handleLoadMore} size="lg">
            Load More Threads
          </Button>
        </div>
      )}
    </PageLayout>
  );
}
