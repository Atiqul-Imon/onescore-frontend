/**
 * Common API types and interfaces
 * Replaces `any` types with proper TypeScript definitions
 */

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  requestId?: string;
  timestamp?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error?: string | Record<string, unknown>;
  requestId?: string;
  timestamp?: string;
  path?: string;
}

/**
 * Request options for API calls
 */
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}

/**
 * Fetch function type
 */
export type FetchFunction = (url: string, options?: ApiRequestOptions) => Promise<Response>;
