'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface ThreadFiltersProps {
  onFilterChange?: (filters: any) => void;
  onSortChange?: (sort: string) => void;
}

export function ThreadFilters({ onFilterChange, onSortChange }: ThreadFiltersProps) {
  const [filters, setFilters] = useState({
    category: '',
    time: 'all',
    tags: [] as string[],
    author: ''
  });

  const [sort, setSort] = useState('hot');

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'cricket', label: 'Cricket' },
    { value: 'football', label: 'Football' },
    { value: 'general', label: 'General' },
    { value: 'news', label: 'News' },
    { value: 'discussion', label: 'Discussion' }
  ];

  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'day', label: 'Past 24 Hours' },
    { value: 'week', label: 'Past Week' },
    { value: 'month', label: 'Past Month' },
    { value: 'year', label: 'Past Year' }
  ];

  const sortOptions = [
    { value: 'hot', label: 'Hot' },
    { value: 'new', label: 'New' },
    { value: 'top', label: 'Top' },
    { value: 'controversial', label: 'Controversial' }
  ];

  const popularTags = [
    'cricket', 'football', 'worldcup', 'ipl', 'premierleague', 
    'championsleague', 'transfer', 'match', 'analysis', 'news'
  ];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    onSortChange?.(newSort);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      time: 'all',
      tags: [],
      author: ''
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  const hasActiveFilters = filters.category || filters.time !== 'all' || filters.tags.length > 0 || filters.author;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <X className="w-4 h-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Time Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time
          </label>
          <select
            value={filters.time}
            onChange={(e) => handleFilterChange('time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timeFilters.map((time) => (
              <option key={time.value} value={time.value}>
                {time.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort by
          </label>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Author Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author
          </label>
          <input
            type="text"
            placeholder="Search by author..."
            value={filters.author}
            onChange={(e) => handleFilterChange('author', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Popular Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filters.tags.includes(tag)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
        {filters.tags.length > 0 && (
          <div className="mt-2">
            <span className="text-sm text-gray-600">Selected: </span>
            {filters.tags.map((tag, index) => (
              <span key={tag} className="text-sm text-blue-600">
                #{tag}{index < filters.tags.length - 1 && ', '}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Active Filters:</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {filters.category && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Category: {categories.find(c => c.value === filters.category)?.label}
              </span>
            )}
            {filters.time !== 'all' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Time: {timeFilters.find(t => t.value === filters.time)?.label}
              </span>
            )}
            {filters.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                #{tag}
              </span>
            ))}
            {filters.author && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Author: {filters.author}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
