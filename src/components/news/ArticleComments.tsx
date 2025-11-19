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
      const res = await fetch(`${base}/api/comments/article/${articleId}?sort=new&limit=50`);
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
      const res = await fetch(`${base}/api/comments`, {
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
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5" />
        <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border rounded-md px-4 py-2 mb-2 min-h-[100px]"
            rows={4}
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-md text-center">
          <p className="text-gray-600 mb-2">Please log in to comment</p>
          <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  {comment.author?.avatar ? (
                    <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full rounded-full" />
                  ) : (
                    <span className="text-sm">{comment.author?.name?.[0] || 'U'}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{comment.author?.name || 'Anonymous'}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <button className="hover:text-blue-600">↑ {comment.upvotes}</button>
                    <button className="hover:text-red-600">↓ {comment.downvotes}</button>
                    <button className="hover:text-blue-600">Reply</button>
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

