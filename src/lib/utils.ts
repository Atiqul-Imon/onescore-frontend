import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with clsx and tailwind-merge
 * Handles conditional classes and resolves conflicts
 * 
 * @param inputs - Class values (strings, objects, arrays)
 * @returns Merged class string
 * 
 * @example
 * ```tsx
 * cn('px-2', { 'bg-red-500': isActive }, 'py-1')
 * // Returns: 'px-2 py-1 bg-red-500' (if isActive is true)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string or Date object to a readable format
 * 
 * @param date - Date string or Date object to format
 * @param options - Intl.DateTimeFormatOptions for custom formatting
 * @returns Formatted date string (e.g., "January 29, 2026")
 * 
 * @example
 * ```ts
 * formatDate('2026-01-29') // "January 29, 2026"
 * formatDate(new Date(), { month: 'short' }) // "Jan 29, 2026"
 * ```
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj);
}

/**
 * Formats a date to time string (HH:MM AM/PM)
 * 
 * @param date - Date string or Date object
 * @returns Formatted time string (e.g., "02:30 PM")
 * 
 * @example
 * ```ts
 * formatTime('2026-01-29T14:30:00Z') // "02:30 PM"
 * ```
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
}

/**
 * Formats a date to date and time string
 * 
 * @param date - Date string or Date object
 * @returns Formatted date and time string (e.g., "Jan 29, 2026, 02:30 PM")
 * 
 * @example
 * ```ts
 * formatDateTime('2026-01-29T14:30:00Z') // "Jan 29, 2026, 02:30 PM"
 * ```
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
}

/**
 * Formats a date to relative time string (e.g., "2 hours ago", "Just now")
 * Falls back to formatted date if older than 7 days
 * 
 * @param date - Date string or Date object
 * @returns Relative time string or formatted date
 * 
 * @example
 * ```ts
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 * formatRelativeTime('2025-01-01') // "January 1, 2025"
 * ```
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return formatDate(dateObj);
}

/**
 * Formats a number with K (thousands) or M (millions) suffix
 * 
 * @param num - Number to format
 * @returns Formatted number string (e.g., "1.5K", "2.3M")
 * 
 * @example
 * ```ts
 * formatNumber(1500) // "1.5K"
 * formatNumber(2300000) // "2.3M"
 * ```
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Formats seconds to duration string (HH:MM:SS or MM:SS)
 * 
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "1:23:45" or "23:45")
 * 
 * @example
 * ```ts
 * formatDuration(5025) // "1:23:45"
 * formatDuration(1425) // "23:45"
 * ```
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Truncates text to a maximum length and adds ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with "..." if needed
 * 
 * @example
 * ```ts
 * truncateText('Very long text', 10) // "Very long ..."
 * ```
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Converts text to URL-friendly slug
 * Removes special characters, converts to lowercase, replaces spaces with hyphens
 * 
 * @param text - Text to slugify
 * @returns URL-friendly slug (e.g., "hello-world")
 * 
 * @example
 * ```ts
 * slugify('Hello World!') // "hello-world"
 * slugify('Test & Example') // "test-example"
 * ```
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a random alphanumeric ID
 * 
 * @returns Random 9-character alphanumeric string
 * 
 * @example
 * ```ts
 * generateId() // "k3j9x2m1p"
 * ```
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Creates a debounced version of a function
 * Delays execution until after wait time has passed since last invocation
 * 
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 * 
 * @example
 * ```ts
 * const debouncedSearch = debounce((query: string) => {
 *   search(query);
 * }, 300);
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Creates a throttled version of a function
 * Limits execution to once per limit time period
 * 
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 * 
 * @example
 * ```ts
 * const throttledScroll = throttle(() => {
 *   handleScroll();
 * }, 100);
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Validates email address format
 * 
 * @param email - Email address to validate
 * @returns True if email format is valid
 * 
 * @example
 * ```ts
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid') // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates URL format
 * 
 * @param url - URL string to validate
 * @returns True if URL format is valid
 * 
 * @example
 * ```ts
 * isValidUrl('https://example.com') // true
 * isValidUrl('not-a-url') // false
 * ```
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts initials from a name (first letter of each word, max 2)
 * 
 * @param name - Full name string
 * @returns Uppercase initials (e.g., "JD" for "John Doe")
 * 
 * @example
 * ```ts
 * getInitials('John Doe') // "JD"
 * getInitials('Mary Jane Watson') // "MJ"
 * ```
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Gets a random Tailwind CSS background color class
 * 
 * @returns Random color class (e.g., "bg-red-500")
 * 
 * @example
 * ```ts
 * getRandomColor() // "bg-blue-500"
 * ```
 */
export function getRandomColor(): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-gray-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Creates a promise that resolves after specified milliseconds
 * Useful for delays in async functions
 * 
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after delay
 * 
 * @example
 * ```ts
 * await sleep(1000); // Wait 1 second
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Copies text to clipboard
 * Uses modern Clipboard API with fallback for older browsers
 * 
 * @param text - Text to copy
 * @returns Promise that resolves when text is copied
 * 
 * @example
 * ```ts
 * await copyToClipboard('Hello World');
 * ```
 */
export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  return Promise.resolve();
}

/**
 * Triggers a file download
 * 
 * @param url - File URL to download
 * @param filename - Suggested filename for download
 * 
 * @example
 * ```ts
 * downloadFile('/api/file.pdf', 'document.pdf');
 * ```
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Extracts file extension from filename
 * 
 * @param filename - Filename with extension
 * @returns File extension (e.g., "pdf", "jpg")
 * 
 * @example
 * ```ts
 * getFileExtension('document.pdf') // "pdf"
 * ```
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * Formats file size in bytes to human-readable format
 * 
 * @param bytes - File size in bytes
 * @returns Formatted size string (e.g., "1.5 MB", "500 KB")
 * 
 * @example
 * ```ts
 * formatFileSize(1572864) // "1.5 MB"
 * formatFileSize(512000) // "500 KB"
 * ```
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
