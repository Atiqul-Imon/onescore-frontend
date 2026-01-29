/**
 * Error handling utilities for consistent error management
 */

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ApiError';
    
    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Check if error is a network error
   */
  isNetworkError(): boolean {
    return this.statusCode === 0 || this.statusCode >= 500;
  }

  /**
   * Check if error is a client error (4xx)
   */
  isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /**
   * Check if error is a server error (5xx)
   */
  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    if (this.isNetworkError()) {
      return 'Network error. Please check your connection and try again.';
    }
    
    if (this.statusCode === 401) {
      return 'You are not authorized. Please log in and try again.';
    }
    
    if (this.statusCode === 403) {
      return 'You do not have permission to perform this action.';
    }
    
    if (this.statusCode === 404) {
      return 'The requested resource was not found.';
    }
    
    if (this.isServerError()) {
      return 'Server error. Please try again later.';
    }
    
    return this.message || 'An unexpected error occurred.';
  }
}

/**
 * Validation Error class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ValidationError';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

/**
 * Handle API errors and convert to ApiError
 */
export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    // Check if it's a fetch error
    if (error.message.includes('fetch')) {
      return new ApiError('Network error', 0, undefined, error);
    }
    
    return new ApiError(error.message, 500, undefined, error);
  }

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    const message = (errorObj.message as string) || 'An error occurred';
    const statusCode = (errorObj.statusCode as number) || 500;
    const data = errorObj.data;
    
    return new ApiError(message, statusCode, data);
  }

  return new ApiError('An unexpected error occurred', 500);
}

/**
 * Handle fetch response errors
 */
export async function handleFetchError(response: Response): Promise<never> {
  let errorData: unknown;
  let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      errorData = await response.json();
      const data = errorData as { message?: string; error?: string };
      errorMessage = data.message || data.error || errorMessage;
    } else {
      errorMessage = await response.text() || errorMessage;
    }
  } catch {
    // If parsing fails, use default message
  }

  throw new ApiError(errorMessage, response.status, errorData);
}

/**
 * Safe error message extractor
 * Always returns a string, never throws
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.getUserMessage();
  }

  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    if (errorObj.message && typeof errorObj.message === 'string') {
      return errorObj.message;
    }
  }

  return 'An unexpected error occurred';
}

/**
 * Check if error is a specific type
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Create error from API response
 */
export function createApiError(
  message: string,
  statusCode: number,
  data?: unknown
): ApiError {
  return new ApiError(message, statusCode, data);
}

