'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ArticleReactionsProps {
  articleId: string;
  initialLikes: number;
  initialDislikes: number;
}

export function ArticleReactions({ articleId, initialLikes, initialDislikes }: ArticleReactionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [reacted, setReacted] = useState<'like' | 'dislike' | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (reacted === 'like') return;
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/news/articles/${articleId}/like`, { method: 'POST' });
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
      const res = await fetch(`${base}/api/news/articles/${articleId}/dislike`, { method: 'POST' });
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
    <div className="flex items-center gap-4 py-4 border-t border-b">
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          reacted === 'like' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
        }`}
      >
        <ThumbsUp className="w-5 h-5" />
        <span>{likes}</span>
      </button>
      <button
        onClick={handleDislike}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          reacted === 'dislike' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'
        }`}
      >
        <ThumbsDown className="w-5 h-5" />
        <span>{dislikes}</span>
      </button>
    </div>
  );
}

