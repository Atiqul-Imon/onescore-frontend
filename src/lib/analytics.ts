/**
 * Google Analytics utility functions
 * Provides type-safe event tracking for GA4
 *
 * @module analytics
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Check if Google Analytics is loaded
 */
export function isGALoaded(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/**
 * Track a page view
 *
 * @param path - Page path
 * @param title - Page title (optional)
 */
export function trackPageView(path: string, title?: string): void {
  if (!isGALoaded() || !window.gtag) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA] Page View:', { path, title });
    }
    return;
  }

  window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
    page_path: path,
    page_title: title,
  });
}

/**
 * Track a custom event
 *
 * @param eventName - Event name
 * @param eventParams - Event parameters
 *
 * @example
 * ```ts
 * trackEvent('article_view', {
 *   article_id: '123',
 *   article_title: 'Cricket Match Update',
 *   category: 'news'
 * });
 * ```
 */
export function trackEvent(eventName: string, eventParams?: Record<string, unknown>): void {
  if (!isGALoaded() || !window.gtag) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA] Event:', eventName, eventParams);
    }
    return;
  }

  window.gtag('event', eventName, eventParams);
}

/**
 * Track article views
 *
 * @param articleId - Article ID
 * @param articleTitle - Article title
 * @param category - Article category
 */
export function trackArticleView(articleId: string, articleTitle: string, category?: string): void {
  trackEvent('article_view', {
    article_id: articleId,
    article_title: articleTitle,
    category: category || 'news',
  });
}

/**
 * Track match views
 *
 * @param matchId - Match ID
 * @param matchType - Match type (e.g., 'cricket', 'football')
 * @param leagueName - League name (optional)
 */
export function trackMatchView(
  matchId: string | number,
  matchType: string,
  leagueName?: string
): void {
  trackEvent('match_view', {
    match_id: String(matchId),
    match_type: matchType,
    league_name: leagueName,
  });
}

/**
 * Track search queries
 *
 * @param searchTerm - Search term
 * @param resultsCount - Number of results
 */
export function trackSearch(searchTerm: string, resultsCount?: number): void {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
}

/**
 * Track user interactions
 *
 * @param action - Action name (e.g., 'click', 'submit')
 * @param category - Category (e.g., 'button', 'form')
 * @param label - Label (optional)
 */
export function trackInteraction(action: string, category: string, label?: string): void {
  trackEvent('user_interaction', {
    action,
    category,
    label,
  });
}

/**
 * Track Web Vitals metrics
 *
 * @param metric - Web Vital metric
 */
export function trackWebVital(metric: {
  name: string;
  value: number;
  id: string;
  delta?: number;
}): void {
  trackEvent(metric.name, {
    value: Math.round(metric.value),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
  });
}

/**
 * Track errors
 *
 * @param error - Error message or Error object
 * @param fatal - Whether the error is fatal
 * @param context - Additional context
 */
export function trackError(
  error: string | Error,
  fatal = false,
  context?: Record<string, unknown>
): void {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  trackEvent('exception', {
    description: errorMessage,
    fatal,
    ...(errorStack && { error_stack: errorStack }),
    ...context,
  });
}

/**
 * Track social shares
 *
 * @param platform - Social platform (e.g., 'facebook', 'twitter')
 * @param contentType - Content type (e.g., 'article', 'match')
 * @param contentId - Content ID
 */
export function trackShare(platform: string, contentType: string, contentId: string): void {
  trackEvent('share', {
    method: platform,
    content_type: contentType,
    content_id: contentId,
  });
}

/**
 * Track video plays (if you add video content later)
 *
 * @param videoId - Video ID
 * @param videoTitle - Video title
 */
export function trackVideoPlay(videoId: string, videoTitle?: string): void {
  trackEvent('video_play', {
    video_id: videoId,
    video_title: videoTitle,
  });
}

/**
 * Set user properties
 *
 * @param properties - User properties
 */
export function setUserProperties(properties: Record<string, unknown>): void {
  if (!isGALoaded() || !window.gtag) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA] User Properties:', properties);
    }
    return;
  }

  window.gtag('set', 'user_properties', properties);
}
