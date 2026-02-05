'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Heart, MessageCircle } from 'lucide-react';

interface ArticleReactionsProps {
  articleId: string;
  initialLikes: number;
  initialDislikes: number;
}

export function ArticleReactions({
  articleId,
  initialLikes,
  initialDislikes,
}: ArticleReactionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [reacted, setReacted] = useState<'like' | 'dislike' | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (reacted === 'like') return;
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/v1/news/articles/${articleId}/like`, {
        method: 'POST',
      });
      if (res.ok) {
        const json = await res.json();
        setLikes(json.data.likes);
        setDislikes(json.data.dislikes);
        setReacted('like');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDislike() {
    if (reacted === 'dislike') return;
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/v1/news/articles/${articleId}/dislike`, {
        method: 'POST',
      });
      if (res.ok) {
        const json = await res.json();
        setLikes(json.data.likes);
        setDislikes(json.data.dislikes);
        setReacted('dislike');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
        What do you think?
      </h3>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          disabled={loading}
          className={`group flex flex-1 items-center justify-center gap-3 rounded-xl border-2 px-6 py-4 font-semibold transition-all ${
            reacted === 'like'
              ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
              : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700'
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <ThumbsUp
            className={`h-5 w-5 transition-transform group-hover:scale-110 ${
              reacted === 'like' ? 'text-primary-600' : ''
            }`}
          />
          <span className="text-lg">{likes}</span>
          <span className="hidden sm:inline">Like</span>
        </button>
        <button
          onClick={handleDislike}
          disabled={loading}
          className={`group flex flex-1 items-center justify-center gap-3 rounded-xl border-2 px-6 py-4 font-semibold transition-all ${
            reacted === 'dislike'
              ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
              : 'border-slate-200 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700'
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <ThumbsDown
            className={`h-5 w-5 transition-transform group-hover:scale-110 ${
              reacted === 'dislike' ? 'text-red-600' : ''
            }`}
          />
          <span className="text-lg">{dislikes}</span>
          <span className="hidden sm:inline">Dislike</span>
        </button>
      </div>
    </div>
  );
}
