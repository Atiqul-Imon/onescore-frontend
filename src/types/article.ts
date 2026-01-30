/**
 * Article/News types
 * Replaces `any` types in article-related code
 */

export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleTag {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface BaseArticle {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  author: Author;
  category?: ArticleCategory;
  tags?: ArticleTag[];
  featuredImage?: ArticleImage;
  status: ArticleStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
  likes?: number;
  dislikes?: number;
  commentsCount?: number;
}

export interface Article extends BaseArticle {
  status: 'published';
  publishedAt: string;
}

export interface DraftArticle extends BaseArticle {
  status: 'draft';
}

export type ArticleType = Article | DraftArticle;
