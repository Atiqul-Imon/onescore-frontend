import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Content {
  _id: string;
  title: string;
  content: string;
  type: 'video' | 'audio' | 'article';
  contributor: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  category: 'cricket' | 'football' | 'general';
  tags: string[];
  mediaUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  featured: boolean;
  views: number;
  likes: number;
  dislikes: number;
  comments: Array<{
    user: string;
    content: string;
    createdAt: string;
    likes: number;
  }>;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContentState {
  content: Content[];
  featuredContent: Content[];
  currentContent: Content | null;
  categories: string[];
  types: string[];
  stats: {
    totalContent: number;
    approvedContent: number;
    pendingContent: number;
    totalViews: number;
    totalLikes: number;
  };
  isLoading: boolean;
  error: string | null;
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

const initialState: ContentState = {
  content: [],
  featuredContent: [],
  currentContent: null,
  categories: ['cricket', 'football', 'general'],
  types: ['video', 'audio', 'article'],
  stats: {
    totalContent: 0,
    approvedContent: 0,
    pendingContent: 0,
    totalViews: 0,
    totalLikes: 0,
  },
  isLoading: false,
  error: null,
  pagination: {
    current: 1,
    pages: 0,
    total: 0,
    limit: 20,
  },
};

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setContent: (state, action: PayloadAction<Content[]>) => {
      state.content = action.payload;
    },
    setFeaturedContent: (state, action: PayloadAction<Content[]>) => {
      state.featuredContent = action.payload;
    },
    setCurrentContent: (state, action: PayloadAction<Content | null>) => {
      state.currentContent = action.payload;
    },
    addContent: (state, action: PayloadAction<Content>) => {
      state.content.unshift(action.payload);
    },
    updateContent: (state, action: PayloadAction<Content>) => {
      const index = state.content.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.content[index] = action.payload;
      }
      
      if (state.currentContent && state.currentContent._id === action.payload._id) {
        state.currentContent = action.payload;
      }
    },
    removeContent: (state, action: PayloadAction<string>) => {
      state.content = state.content.filter(item => item._id !== action.payload);
    },
    setStats: (state, action: PayloadAction<{
      totalContent: number;
      approvedContent: number;
      pendingContent: number;
      totalViews: number;
      totalLikes: number;
    }>) => {
      state.stats = action.payload;
    },
    setPagination: (state, action: PayloadAction<{
      current: number;
      pages: number;
      total: number;
      limit: number;
    }>) => {
      state.pagination = action.payload;
    },
    incrementViews: (state, action: PayloadAction<string>) => {
      const content = state.content.find(item => item._id === action.payload);
      if (content) {
        content.views += 1;
      }
      if (state.currentContent && state.currentContent._id === action.payload) {
        state.currentContent.views += 1;
      }
    },
    incrementLikes: (state, action: PayloadAction<string>) => {
      const content = state.content.find(item => item._id === action.payload);
      if (content) {
        content.likes += 1;
      }
      if (state.currentContent && state.currentContent._id === action.payload) {
        state.currentContent.likes += 1;
      }
    },
    incrementDislikes: (state, action: PayloadAction<string>) => {
      const content = state.content.find(item => item._id === action.payload);
      if (content) {
        content.dislikes += 1;
      }
      if (state.currentContent && state.currentContent._id === action.payload) {
        state.currentContent.dislikes += 1;
      }
    },
    addComment: (state, action: PayloadAction<{ contentId: string; comment: any }>) => {
      const content = state.content.find(item => item._id === action.payload.contentId);
      if (content) {
        content.comments.push(action.payload.comment);
      }
      if (state.currentContent && state.currentContent._id === action.payload.contentId) {
        state.currentContent.comments.push(action.payload.comment);
      }
    },
    clearContent: (state) => {
      state.content = [];
      state.featuredContent = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setContent,
  setFeaturedContent,
  setCurrentContent,
  addContent,
  updateContent,
  removeContent,
  setStats,
  setPagination,
  incrementViews,
  incrementLikes,
  incrementDislikes,
  addComment,
  clearContent,
  clearError,
} = contentSlice.actions;

export default contentSlice.reducer;
