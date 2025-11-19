'use client';

import { useState } from 'react';
import { Plus, X, Image as ImageIcon, Link as LinkIcon, Video, Upload, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAuthHeaders } from '@/lib/auth';
import { MediaPicker } from '@/components/admin/MediaPicker';

export function CreateThreadButton() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    flair: '',
    mediaType: null as 'image' | 'video' | 'link' | null,
    mediaUrl: '',
    mediaTitle: '',
    mediaDescription: '',
    showPoll: false,
    pollQuestion: '',
    pollOptions: ['', ''],
    pollExpiresAt: '',
    pollAllowMultiple: false,
  });
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleAddPollOption = () => {
    if (formData.pollOptions.length < 10) {
      setFormData(prev => ({
        ...prev,
        pollOptions: [...prev.pollOptions, '']
      }));
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (formData.pollOptions.length > 2) {
      setFormData(prev => ({
        ...prev,
        pollOptions: prev.pollOptions.filter((_, i) => i !== index)
      }));
    }
  };

  const handleMediaSelect = (url: string) => {
    setFormData(prev => ({ ...prev, mediaUrl: url }));
    setShowMediaPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
        throw new Error('Title, content, and category are required');
      }

      // Prepare tags array
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .slice(0, 10); // Max 10 tags

      // Prepare media object
      let media = undefined;
      if (formData.mediaType && formData.mediaUrl) {
        media = {
          type: formData.mediaType,
          url: formData.mediaUrl,
          ...(formData.mediaTitle && { title: formData.mediaTitle }),
          ...(formData.mediaDescription && { description: formData.mediaDescription }),
        };
      }

      // Prepare poll object
      let poll = undefined;
      if (formData.showPoll && formData.pollQuestion.trim()) {
        const pollOptions = formData.pollOptions
          .map(opt => opt.trim())
          .filter(opt => opt.length > 0);
        
        if (pollOptions.length < 2) {
          throw new Error('Poll must have at least 2 options');
        }

        poll = {
          question: formData.pollQuestion,
          options: pollOptions.map(text => ({ text, votes: 0 })),
          expiresAt: formData.pollExpiresAt ? new Date(formData.pollExpiresAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
          allowMultiple: formData.pollAllowMultiple,
          totalVotes: 0,
        };
      }

      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base}/api/threads`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          tags,
          ...(formData.flair.trim() && { flair: formData.flair.trim() }),
          ...(media && { media }),
          ...(poll && { poll }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create thread');
      }

      const result = await response.json();
      
      if (!result.success || !result.data?._id) {
        throw new Error(result.message || 'Thread creation failed');
      }
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        category: '',
        tags: '',
        flair: '',
        mediaType: null,
        mediaUrl: '',
        mediaTitle: '',
        mediaDescription: '',
        showPoll: false,
        pollQuestion: '',
        pollOptions: ['', ''],
        pollExpiresAt: '',
        pollAllowMultiple: false,
      });
      
      setShowModal(false);
      
      // Redirect to the new thread
      router.push(`/threads/${result.data._id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create thread');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Create Thread</span>
      </button>

      {/* Create Thread Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create New Thread</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                  }}
                  className="p-1 hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter thread title..."
                    className="w-full px-3 py-2 border border-gray-300"
                    maxLength={300}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {formData.title.length}/300 characters
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="cricket">Cricket</option>
                    <option value="football">Football</option>
                    <option value="general">General</option>
                    <option value="news">News</option>
                    <option value="discussion">Discussion</option>
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300"
                    maxLength={40000}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {formData.content.length}/40,000 characters
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="Enter tags separated by commas (e.g., cricket, ipl, match)"
                    className="w-full px-3 py-2 border border-gray-300"
                  />
                  <p className="text-xs text-gray-500">
                    Separate multiple tags with commas (max 10 tags)
                  </p>
                </div>

                {/* Flair */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Flair (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.flair}
                    onChange={(e) => handleInputChange('flair', e.target.value)}
                    placeholder="Add a flair (e.g., Discussion, Question, Analysis)"
                    className="w-full px-3 py-2 border border-gray-300"
                    maxLength={100}
                  />
                </div>

                {/* Media Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Add Media (Optional)
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('mediaType', formData.mediaType === 'image' ? null : 'image');
                        if (formData.mediaType !== 'image') setShowMediaPicker(true);
                      }}
                      className={`p-3 border rounded-lg transition-colors text-center ${
                        formData.mediaType === 'image'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <ImageIcon className={`w-6 h-6 mx-auto mb-2 ${
                        formData.mediaType === 'image' ? 'text-blue-500' : 'text-gray-500'
                      }`} />
                      <span className="text-sm text-gray-700">Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('mediaType', formData.mediaType === 'link' ? null : 'link')}
                      className={`p-3 border rounded-lg transition-colors text-center ${
                        formData.mediaType === 'link'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <LinkIcon className={`w-6 h-6 mx-auto mb-2 ${
                        formData.mediaType === 'link' ? 'text-blue-500' : 'text-gray-500'
                      }`} />
                      <span className="text-sm text-gray-700">Link</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('mediaType', formData.mediaType === 'video' ? null : 'video')}
                      className={`p-3 border rounded-lg transition-colors text-center ${
                        formData.mediaType === 'video'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <Video className={`w-6 h-6 mx-auto mb-2 ${
                        formData.mediaType === 'video' ? 'text-blue-500' : 'text-gray-500'
                      }`} />
                      <span className="text-sm text-gray-700">Video</span>
                    </button>
                  </div>

                  {/* Media URL Input */}
                  {formData.mediaType && (
                    <div className="space-y-3 mt-3 p-3 border border-gray-200">
                      {formData.mediaType === 'image' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Image URL
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={formData.mediaUrl}
                                onChange={(e) => handleInputChange('mediaUrl', e.target.value)}
                                placeholder="Image URL or click to browse"
                                className="flex-1 px-3 py-2 border border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={() => setShowMediaPicker(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                              >
                                <Upload className="w-4 h-4" />
                                <span>Browse</span>
                              </button>
                            </div>
                          </div>
                          {formData.mediaUrl && (
                            <div className="mt-2">
                              <img
                                src={formData.mediaUrl}
                                alt="Preview"
                                className="max-w-full h-48 object-cover rounded-lg"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </>
                      )}
                      {formData.mediaType === 'link' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Link URL *
                            </label>
                            <input
                              type="url"
                              value={formData.mediaUrl}
                              onChange={(e) => handleInputChange('mediaUrl', e.target.value)}
                              placeholder="https://example.com"
                              className="w-full px-3 py-2 border border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Link Title (Optional)
                            </label>
                            <input
                              type="text"
                              value={formData.mediaTitle}
                              onChange={(e) => handleInputChange('mediaTitle', e.target.value)}
                              placeholder="Link title"
                              className="w-full px-3 py-2 border border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Link Description (Optional)
                            </label>
                            <textarea
                              value={formData.mediaDescription}
                              onChange={(e) => handleInputChange('mediaDescription', e.target.value)}
                              placeholder="Link description"
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300"
                            />
                          </div>
                        </>
                      )}
                      {formData.mediaType === 'video' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Video URL *
                          </label>
                          <input
                            type="url"
                            value={formData.mediaUrl}
                            onChange={(e) => handleInputChange('mediaUrl', e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full px-3 py-2 border border-gray-300"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Poll Option */}
                <div className="border-t border-gray-200">
                  <label className="flex items-center space-x-2 mb-3">
                    <input
                      type="checkbox"
                      checked={formData.showPoll}
                      onChange={(e) => handleInputChange('showPoll', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Create a poll
                    </span>
                  </label>

                  {formData.showPoll && (
                    <div className="space-y-3 mt-3 p-3 border border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Poll Question *
                        </label>
                        <input
                          type="text"
                          value={formData.pollQuestion}
                          onChange={(e) => handleInputChange('pollQuestion', e.target.value)}
                          placeholder="What's your question?"
                          className="w-full px-3 py-2 border border-gray-300"
                          maxLength={300}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Poll Options *
                        </label>
                        {formData.pollOptions.map((option, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...formData.pollOptions];
                                newOptions[index] = e.target.value;
                                handleInputChange('pollOptions', newOptions);
                              }}
                              placeholder={`Option ${index + 1}`}
                              className="flex-1 px-3 py-2 border border-gray-300"
                              maxLength={200}
                            />
                            {formData.pollOptions.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePollOption(index)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        {formData.pollOptions.length < 10 && (
                          <button
                            type="button"
                            onClick={handleAddPollOption}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            + Add Option
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Expires At
                          </label>
                          <input
                            type="datetime-local"
                            value={formData.pollExpiresAt}
                            onChange={(e) => handleInputChange('pollExpiresAt', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300"
                          />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.pollAllowMultiple}
                              onChange={(e) => handleInputChange('pollAllowMultiple', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              Allow multiple votes
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setError(null);
                    }}
                    className="px-4 py-2 text-gray-600"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{loading ? 'Creating...' : 'Create Thread'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowMediaPicker(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Image</h3>
                <button
                  onClick={() => setShowMediaPicker(false)}
                  className="p-1 hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <MediaPicker
                onSelect={(url) => {
                  handleMediaSelect(url);
                  setShowMediaPicker(false);
                }}
                currentUrl={formData.mediaUrl}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
