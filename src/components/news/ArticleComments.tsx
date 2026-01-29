'use client';

import { useEffect, useState } from 'react';
import { getAuthHeaders } from '@/lib/auth';
import { MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';

interface ArticleCommentsProps {
  articleId: string;
}

interface Comment {
  _id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  upvotes: number;
  downvotes: number;
  createdAt: string;
  replies?: Comment[];
}

export function ArticleComments({ articleId }: ArticleCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadComments();
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    }
  }, [articleId]);

  async function loadComments() {
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/v1/comments/article/${articleId}?sort=new&limit=50`);
      if (res.ok) {
        const json = await res.json();
        setComments(json?.data?.comments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/v1/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          content: newComment,
          articleId,
        }),
      });
      if (res.ok) {
        setNewComment('');
        loadComments();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border-t border-gray-200 pt-8">
      <div className="flex items-center gap-2.5 mb-6">
        <MessageSquare className="w-5 h-5 text-gray-600" />
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Comments ({comments.length})</h3>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
            rows={4}
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-5 bg-gray-50 rounded-lg text-center border border-gray-200">
          <p className="text-gray-600 mb-2">Please log in to comment</p>
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">Log in</Link>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <div key={comment._id} className="border border-gray-200 rounded-lg p-5 bg-white hover:border-gray-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  {comment.author?.avatar ? (
                    <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{comment.author?.name?.[0]?.toUpperCase() || 'U'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="font-semibold text-gray-900">{comment.author?.name || 'Anonymous'}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed">{comment.content}</p>
                  <div className="flex items-center gap-5 text-sm">
                    <button className="text-gray-600 hover:text-primary-600 transition-colors font-medium">↑ {comment.upvotes}</button>
                    <button className="text-gray-600 hover:text-red-600 transition-colors font-medium">↓ {comment.downvotes}</button>
                    <button className="text-gray-600 hover:text-primary-600 transition-colors font-medium">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

