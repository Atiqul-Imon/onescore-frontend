'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Headphones, FileText, Heart, MessageCircle, Eye, Clock } from 'lucide-react';
import { Container, Button, Card } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';

interface Content {
  _id: string;
  title: string;
  content: string;
  type: 'video' | 'audio' | 'article';
  contributor: {
    name: string;
    avatar?: string;
  };
  category: 'cricket' | 'football' | 'general';
  tags: string[];
  mediaUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
}

export function FeaturedContentSection() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockContent: Content[] = [
        {
          _id: '1',
          title: 'India vs Australia: Match Highlights',
          content: 'Watch the best moments from the thrilling encounter between India and Australia...',
          type: 'video',
          contributor: {
            name: 'Sports Analyst',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
          },
          category: 'cricket',
          tags: ['highlights', 'india', 'australia', 'cricket'],
          mediaUrl: 'https://example.com/video1.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=225&fit=crop',
          duration: 180,
          views: 12500,
          likes: 450,
          comments: 23,
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '2',
          title: 'Premier League Weekly Review',
          content: 'A comprehensive analysis of this week\'s Premier League action...',
          type: 'audio',
          contributor: {
            name: 'Football Expert',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
          },
          category: 'football',
          tags: ['premier league', 'review', 'analysis'],
          mediaUrl: 'https://example.com/audio1.mp3',
          duration: 1200,
          views: 8500,
          likes: 120,
          comments: 15,
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '3',
          title: 'The Future of Cricket: T20 Revolution',
          content: 'How T20 cricket has transformed the sport and what it means for the future...',
          type: 'article',
          contributor: {
            name: 'Cricket Writer',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
          },
          category: 'cricket',
          tags: ['t20', 'cricket', 'future', 'analysis'],
          views: 3200,
          likes: 89,
          comments: 12,
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setContent(mockContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = content.filter(item => {
    if (selectedType === 'all') return true;
    return item.type === selectedType;
  });

  const typeFilters = [
    { id: 'all', label: 'All Content', icon: null },
    { id: 'video', label: 'Videos', icon: <Play className="w-4 h-4" /> },
    { id: 'audio', label: 'Audio', icon: <Headphones className="w-4 h-4" /> },
    { id: 'article', label: 'Articles', icon: <FileText className="w-4 h-4" /> }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-5 h-5" />;
      case 'audio':
        return <Headphones className="w-5 h-5" />;
      case 'article':
        return <FileText className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'text-red-600 bg-red-100';
      case 'audio':
        return 'text-purple-600 bg-purple-100';
      case 'article':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <section className="section-padding bg-gray-100">
        <Container>
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">
              Featured Content
            </h2>
            <p className="body-text-lg text-gray-600">
              Community-driven sports content
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded mb-4" />
                    <div className="h-3 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gray-100">
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-2 mb-4">
            Featured Content
          </h2>
          <p className="body-text-lg text-gray-600">
            Community-driven sports content from passionate fans
          </p>
        </motion.div>

        {/* Type Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {typeFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedType(filter.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-standard ${
                selectedType === filter.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </motion.div>

        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Content Available
            </h3>
            <p className="text-gray-600">
              Check back later for new content
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item, index) => (
              <motion.div
                key={item._id}
                className="hover:-translate-y-1 transition-standard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="interactive" padding="none" className="overflow-hidden">
                  {/* Media Thumbnail */}
                  {item.thumbnailUrl && (
                    <div className="relative">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        {getTypeIcon(item.type)}
                      </div>
                      {item.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                  {/* Content Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                      {item.type.toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(item.publishedAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Content Preview */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Contributor */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={item.contributor.avatar || 'https://via.placeholder.com/32'}
                      alt={item.contributor.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.contributor.name}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {item.category}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{item.comments}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4">
                    <Button fullWidth>
                      {item.type === 'video' ? 'Watch Now' : 
                       item.type === 'audio' ? 'Listen Now' : 
                       'Read More'}
                    </Button>
                  </div>
                </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {filteredContent.length > 0 && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button variant="outline">
              View All Content
            </Button>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
