'use client';

import { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  Reply, 
  Share, 
  Flag, 
  MoreHorizontal,
  Award,
  Clock
} from 'lucide-react';

interface CommentCardProps {
  comment: {
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
  };
  onVote?: (commentId: string, voteType: 'upvote' | 'downvote') => void;
  onReply?: (commentId: string, content: string) => void;
  onReport?: (commentId: string, reason: string) => void;
  userVote?: 'upvote' | 'downvote' | null;
  showReplyForm?: boolean;
  onToggleReply?: (commentId: string) => void;
}

export function CommentCard({ 
  comment, 
  onVote, 
  onReply, 
  onReport, 
  userVote,
  showReplyForm = false,
  onToggleReply
}: CommentCardProps) {
  const [replyContent, setReplyContent] = useState('');
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

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply?.(comment._id, replyContent.trim());
      setReplyContent('');
    }
  };

  const getDepthColor = (depth: number) => {
    const colors = [
      'border-l-blue-500',
      'border-l-green-500',
      'border-l-yellow-500',
      'border-l-purple-500',
      'border-l-red-500',
      'border-l-pink-500',
      'border-l-indigo-500',
      'border-l-orange-500'
    ];
    return colors[depth % colors.length];
  };

  return (
    <div 
      className={`bg-white rounded-lg border-l-4 ${getDepthColor(comment.depth)} ${
        comment.depth > 0 ? 'ml-4' : ''
      }`}
    >
      {/* Comment Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {comment.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">u/{comment.author.name}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{formatTime(comment.createdAt)}</span>
            {comment.editedAt && (
              <>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">edited {formatTime(comment.editedAt)}</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {comment.awards.length > 0 && (
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-gray-600">
                  {comment.awards.reduce((sum, award) => sum + award.count, 0)}
                </span>
              </div>
            )}
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Comment Content */}
        <div className="text-gray-800 mb-4 whitespace-pre-wrap">
          {comment.content}
        </div>

        {/* Comment Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Voting */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onVote?.(comment._id, 'upvote')}
                className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                  userVote === 'upvote' ? 'text-orange-500' : 'text-gray-500'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <span className={`text-sm font-medium px-1 ${
                comment.score > 0 ? 'text-orange-500' : 
                comment.score < 0 ? 'text-blue-500' : 'text-gray-500'
              }`}>
                {comment.score}
              </span>
              <button
                onClick={() => onVote?.(comment._id, 'downvote')}
                className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                  userVote === 'downvote' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* Reply */}
            <button
              onClick={() => onToggleReply?.(comment._id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Reply className="w-4 h-4" />
              <span className="text-sm">Reply</span>
            </button>

            {/* Share */}
            <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
              <Share className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{comment.replies.length} replies</span>
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <form onSubmit={handleReply} className="space-y-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={10000}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => onToggleReply?.(comment._id)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!replyContent.trim()}
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reply
                </button>
              </div>
            </form>
          </div>
        )}
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
            <h3 className="text-lg font-semibold mb-4">Report Comment</h3>
            <div className="space-y-2">
              {['spam', 'harassment', 'hate_speech', 'misinformation', 'violence', 'other'].map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    onReport?.(comment._id, reason);
                    setShowReportModal(false);
                    setShowActions(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                >
                  {reason.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
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
