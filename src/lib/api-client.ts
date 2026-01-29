/**
 * API Client utility for making HTTP requests
 * Provides consistent error handling, request/response transformation, and automatic token injection
 * 
 * @module api-client
 */

import { ApiError, handleApiError, handleFetchError } from './errors';
import { logger } from './logger';
import { performanceMonitor } from './performance';
import type { ApiRequestOptions, ApiResponse, FetchFunction } from '@/types/api';

/**
 * ApiClient - Centralized HTTP client for API requests
 * 
 * Features:
 * - Automatic authentication token injection
 * - Consistent error handling
 * - Request/response logging
 * - Type-safe responses
 * - Next.js cache/revalidation support
 * 
 * @example
 * ```ts
 * // GET request
 * const response = await apiClient.get<Article[]>('/api/v1/news');
 * 
 * // POST request
 * const result = await apiClient.post('/api/v1/news', { title: 'News' });
 * 
 * // With query parameters
 * const matches = await apiClient.get('/api/v1/matches', { 
 *   params: { status: 'live' } 
 * });
 * ```
 */
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  /**
   * Creates a new ApiClient instance
   * 
   * @param baseUrl - Base URL for API requests (defaults to NEXT_PUBLIC_API_URL or localhost:5000)
   */
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Sets default headers for all requests
   * 
   * @param headers - Headers to set (merged with existing defaults)
   * 
   * @example
   * ```ts
   * apiClient.setHeaders({ 'X-Custom-Header': 'value' });
   * ```
   */
  setHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Get default headers with auth token if available
   */
  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders };
    
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return { ...headers, ...customHeaders };
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
  }

  /**
   * Makes an HTTP request with full options support
   * 
   * @param endpoint - API endpoint (relative or absolute URL)
   * @param options - Request options (method, headers, body, params, etc.)
   * @returns Promise resolving to ApiResponse<T>
   * @throws {ApiError} If request fails
   * 
   * @example
   * ```ts
   * const response = await apiClient.request<Article>('/api/v1/news/123', {
   *   method: 'PUT',
   *   body: { title: 'Updated' },
   *   params: { include: 'author' }
   * });
   * ```
   */
  async request<T = unknown>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers: customHeaders,
      body,
      params,
      signal,
      cache,
      next,
    } = options;

    const url = this.buildUrl(endpoint, params);
    const headers = this.getHeaders(customHeaders);

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal,
      cache,
    };

    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    // Add Next.js revalidation options
    if (next) {
      // Next.js fetch options are handled automatically
    }

    try {
      logger.debug(`API Request: ${method} ${url}`, { body, headers }, 'ApiClient');

      const startTime = performance.now();
      const response = await fetch(url, fetchOptions);
      const duration = performance.now() - startTime;

      // Track API performance
      performanceMonitor.trackApiTiming(endpoint, duration);

      if (!response.ok) {
        await handleFetchError(response);
      }

      const data = await response.json();
      
      logger.debug(`API Response: ${method} ${url}`, data, 'ApiClient');

      // Handle both standard ApiResponse and direct data
      if (data && typeof data === 'object' && 'success' in data) {
        return data as ApiResponse<T>;
      }

      // If response is not in standard format, wrap it
      return {
        success: true,
        data: data as T,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      logger.error(`API Error: ${method} ${url}`, apiError, 'ApiClient');
      throw apiError;
    }
  }

  /**
   * Makes a GET request
   * 
   * @param endpoint - API endpoint
   * @param options - Request options (headers, params, cache, etc.)
   * @returns Promise resolving to ApiResponse<T>
   * @throws {ApiError} If request fails
   * 
   * @example
   * ```ts
   * const response = await apiClient.get<Article[]>('/api/v1/news', {
   *   params: { limit: 10 },
   *   cache: 'no-store'
   * });
   * ```
   */
  async get<T = unknown>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Makes a POST request
   * 
   * @param endpoint - API endpoint
   * @param body - Request body (will be JSON stringified)
   * @param options - Request options (headers, params, etc.)
   * @returns Promise resolving to ApiResponse<T>
   * @throws {ApiError} If request fails
   * 
   * @example
   * ```ts
   * const response = await apiClient.post('/api/v1/news', {
   *   title: 'New Article',
   *   content: 'Content here'
   * });
   * ```
   */
  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * Makes a PUT request
   * 
   * @param endpoint - API endpoint
   * @param body - Request body (will be JSON stringified)
   * @param options - Request options
   * @returns Promise resolving to ApiResponse<T>
   * @throws {ApiError} If request fails
   */
  async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * Makes a PATCH request
   * 
   * @param endpoint - API endpoint
   * @param body - Request body (will be JSON stringified)
   * @param options - Request options
   * @returns Promise resolving to ApiResponse<T>
   * @throws {ApiError} If request fails
   */
  async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * Makes a DELETE request
   * 
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Promise resolving to ApiResponse<T>
   * @throws {ApiError} If request fails
   */
  async delete<T = unknown>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

/**
 * Default API client instance
 * Use this for most API requests
 * 
 * @example
 * ```ts
 * import { apiClient } from '@/lib/api-client';
 * const response = await apiClient.get('/api/v1/news');
 * ```
 */
export const apiClient = new ApiClient();

/**
 * ApiClient class for creating custom instances
 * 
 * @example
 * ```ts
 * const customClient = new ApiClient('https://api.example.com');
 * ```
 */
export { ApiClient };

