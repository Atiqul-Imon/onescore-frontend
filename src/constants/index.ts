/**
 * Application constants
 * Centralized constants for consistent values across the application
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

/**
 * Cache Configuration
 */
export const CACHE_CONFIG = {
  NEWS_REVALIDATE: 300, // 5 minutes
  MATCHES_REVALIDATE: 0, // No cache for live matches
  RESULTS_REVALIDATE: 600, // 10 minutes
  FIXTURES_REVALIDATE: 300, // 5 minutes
} as const;

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * Match Status
 */
export const MATCH_STATUS = {
  LIVE: 'live',
  COMPLETED: 'completed',
  UPCOMING: 'upcoming',
  CANCELLED: 'cancelled',
} as const;

/**
 * Match Formats
 */
export const MATCH_FORMATS = {
  T20: 'T20',
  ODI: 'ODI',
  TEST: 'Test',
  T10: 'T10',
} as const;

/**
 * UI Constants
 */
export const UI = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 3000,
  MODAL_ANIMATION: 200,
} as const;

/**
 * Validation Constants
 */
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MAX_EMAIL_LENGTH: 254,
  MAX_TITLE_LENGTH: 200,
  MAX_CONTENT_LENGTH: 50000,
} as const;

/**
 * Date/Time Formats
 */
export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMMM dd, yyyy',
  DISPLAY_TIME: 'hh:mm a',
  DISPLAY_DATETIME: 'MMM dd, yyyy, hh:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
} as const;

/**
 * File Upload Limits
 */
export const FILE_LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_FILE_TYPES: ['application/pdf', 'text/plain'],
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized. Please log in and try again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  VALIDATION_ERROR: 'Please check your input and try again.',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  SAVED: 'Saved successfully',
  DELETED: 'Deleted successfully',
  UPDATED: 'Updated successfully',
  CREATED: 'Created successfully',
  COPIED: 'Copied to clipboard',
} as const;

