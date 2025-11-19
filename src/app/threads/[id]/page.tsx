'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';
import { ThreadCard } from '@/components/threads/ThreadCard';
import { CommentCard } from '@/components/threads/CommentCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Container } from '@/components/ui/Container';
import { getAuthHeaders } from '@/lib/auth';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

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
    description?: string;
  };
  poll?: {
    question: string;
    options: Array<{
      text: string;
      votes: number;
    }>;
    expiresAt: string;
    allowMultiple: boolean;
    totalVotes: number;
  };
  awards: Array<{
    type: string;
    count: number;
  }>;
}

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  upvotes: number;
  downvotes: number;
  score: number;
  replies: string[];
  depth: number;
  createdAt: string;
  editedAt?: string;
  awards: Array<{
    type: string;
    count: number;
  }>;
}

export default function ThreadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const threadId = params?.id as string;
  
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentSort, setCommentSort] = useState('top');
  const [userVotes, setUserVotes] = useState<{ [id: string]: 'upvote' | 'downvote' }>({});
  const [commentVotes, setCommentVotes] = useState<{ [id: string]: 'upvote' | 'downvote' }>({});
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingReply, setSubmittingReply] = useState<string | null>(null);

  useEffect(() => {
    if (threadId) {
      loadThread();
      loadComments();
    }
  }, [threadId, commentSort]);

  async function loadThread() {
    try {
      setLoading(true);
      setError(null);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/threads/${threadId}`, {
        cache: 'no-store',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error('Failed to load thread');
      }

      const json = await res.json();
      if (json.success && json.data) {
        setThread(json.data.thread);
        if (json.data.comments) {
          setComments(json.data.comments);
        }
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load thread');
    } finally {
      setLoading(false);
    }
  }

  async function loadComments() {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/threads/${threadId}?sort=${commentSort}`, {
        cache: 'no-store',
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.comments) {
          setComments(json.data.comments);
        }
      }
    } catch (e: any) {
      console.error('Error loading comments:', e);
    }
  }

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/threads/${threadId}/vote`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ voteType }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && thread) {
          setThread({
            ...thread,
            upvotes: json.data.upvotes,
            downvotes: json.data.downvotes,
            score: json.data.score,
          });
        }
      }
    } catch (e: any) {
      console.error('Error voting:', e);
    }
  };

  const handleCommentVote = async (commentId: string, voteType: 'upvote' | 'downvote') => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/comments/${commentId}/vote`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ voteType }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setCommentVotes(prev => {
            const currentVote = prev[commentId];
            if (currentVote === voteType) {
              const newVotes = { ...prev };
              delete newVotes[commentId];
              return newVotes;
            } else {
              return { ...prev, [commentId]: voteType };
            }
          });

          setComments(prev => prev.map(comment => {
            if (comment._id === commentId) {
              return {
                ...comment,
                upvotes: json.data.upvotes,
                downvotes: json.data.downvotes,
                score: json.data.score,
              };
            }
            return comment;
          }));
        }
      }
    } catch (e: any) {
      console.error('Error voting on comment:', e);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          content: replyContent.trim(),
          threadId: threadId,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setReplyContent('');
          await loadComments();
          if (thread) {
            setThread({ ...thread, commentCount: thread.commentCount + 1 });
          }
        }
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to post comment');
      }
    } catch (e: any) {
      console.error('Error posting comment:', e);
      alert('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReply = async (commentId: string, content: string) => {
    if (!content.trim() || submittingReply === commentId) return;

    try {
      setSubmittingReply(commentId);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          content: content.trim(),
          threadId: threadId,
          parentCommentId: commentId,
        }),
      });

      if (res.ok) {
        setShowReplyForm(null);
        await loadComments();
        if (thread) {
          setThread({ ...thread, commentCount: thread.commentCount + 1 });
        }
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to post reply');
      }
    } catch (e: any) {
      console.error('Error posting reply:', e);
      alert('Failed to post reply');
    } finally {
      setSubmittingReply(null);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      cricket: 'bg-green-100 text-green-800',
      football: 'bg-blue-100 text-blue-800',
      general: 'bg-gray-100 text-gray-800',
      news: 'bg-red-100 text-red-800',
      discussion: 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Thread Not Found</h2>
          <p className="text-gray-600">{error || 'The thread you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/threads')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Threads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Container size="lg">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Threads', href: '/threads' },
            { label: thread.title || 'Thread' }
          ]}
        />
        {/* Thread Content */}
        <div className="bg-white rounded-lg border border-gray-200 mb-4">
          <div className="p-6">
            {/* Thread Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2 flex-wrap">
                {thread.isPinned && (
                  <Pin className="w-4 h-4 text-yellow-500" />
                )}
                {thread.isLocked && (
                  <Lock className="w-4 h-4 text-red-500" />
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(thread.category)}`}>
                  {thread.category}
                </span>
                {thread.flair && (
                  <span className="px-2 py-1 bg-gray-100">
                    {thread.flair}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{formatTime(thread.createdAt)}</span>
              </div>
            </div>

            {/* Thread Title */}
            <h1 className="text-2xl font-bold text-gray-900">
              {thread.title}
            </h1>

            {/* Thread Content */}
            <div className="text-gray-800">
              {thread.content}
            </div>

            {/* Media */}
            {thread.media && (
              <div className="mb-4">
                {thread.media.type === 'image' && (
                  <img
                    src={thread.media.url}
                    alt="Thread media"
                    className="w-full rounded-lg shadow-md bg-gray-100"
                    style={{ maxHeight: '520px', objectFit: 'contain' }}
                  />
                )}
                {thread.media.type === 'link' && (
                  <div className="border border-gray-200">
                    <a 
                      href={thread.media.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-sm text-blue-600">
                          {thread.media.title || 'External Link'}
                        </span>
                      </div>
                      {thread.media.description && (
                        <p className="text-sm text-gray-600">
                          {thread.media.description}
                        </p>
                      )}
                    </a>
                  </div>
                )}
                {thread.media.type === 'video' && (
                  <div className="aspect-video">
                    <iframe
                      src={thread.media.url}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            )}

            {/* Poll */}
            {thread.poll && (
              <div className="mb-4 p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900">{thread.poll.question}</h3>
                <div className="space-y-2">
                  {thread.poll.options.map((option, index) => {
                    const percentage = thread.poll!.totalVotes > 0 
                      ? (option.votes / thread.poll!.totalVotes) * 100 
                      : 0;
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{option.text}</span>
                          <span className="text-gray-500">{option.votes} votes ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500">
                  {thread.poll.totalVotes} total votes
                </p>
              </div>
            )}

            {/* Tags */}
            {thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {thread.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author Info */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300">
                  <span className="text-sm font-medium text-gray-600">
                    {thread.author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-700">u/{thread.author.name}</span>
              </div>
            </div>

            {/* Thread Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Voting */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleVote('upvote')}
                    className={`p-1 rounded hover:bg-gray-200
                      userVotes[thread._id] === 'upvote' ? 'text-orange-500' : 'text-gray-500'
                    }`}
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                  <span className={`text-sm font-medium px-2 ${
                    thread.score > 0 ? 'text-orange-500' : 
                    thread.score < 0 ? 'text-blue-500' : 'text-gray-500'
                  }`}>
                    {thread.score}
                  </span>
                  <button
                    onClick={() => handleVote('downvote')}
                    className={`p-1 rounded hover:bg-gray-200
                      userVotes[thread._id] === 'downvote' ? 'text-blue-500' : 'text-gray-500'
                    }`}
                  >
                    <ArrowDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Comments */}
                <div className="flex items-center space-x-1 text-gray-500">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{thread.commentCount} comments</span>
                </div>

                {/* Share */}
                <button className="flex items-center space-x-1 text-gray-500">
                  <Share className="w-5 h-5" />
                  <span className="text-sm">Share</span>
                </button>

                {/* Bookmark */}
                <button className="flex items-center space-x-1 text-gray-500">
                  <Bookmark className="w-5 h-5" />
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
          </div>
        </div>

        {/* Comment Form */}
        {!thread.isLocked && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Add a comment</h3>
            <form onSubmit={handleSubmitComment} className="space-y-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="What are your thoughts?"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300"
                maxLength={10000}
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!replyContent.trim() || submittingComment}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {submittingComment && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{submittingComment ? 'Posting...' : 'Comment'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {thread.commentCount} {thread.commentCount === 1 ? 'Comment' : 'Comments'}
            </h3>
            <select
              value={commentSort}
              onChange={(e) => setCommentSort(e.target.value)}
              className="px-3 py-1 border border-gray-300"
            >
              <option value="top">Top</option>
              <option value="new">New</option>
              <option value="old">Old</option>
              <option value="controversial">Controversial</option>
            </select>
          </div>

          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentCard
                  key={comment._id}
                  comment={comment}
                  onVote={handleCommentVote}
                  onReply={handleReply}
                  userVote={commentVotes[comment._id]}
                  showReplyForm={showReplyForm === comment._id}
                  onToggleReply={(id) => setShowReplyForm(showReplyForm === id ? null : id)}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

