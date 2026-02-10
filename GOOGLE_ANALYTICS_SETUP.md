# Google Analytics Setup Guide

This guide explains how to set up Google Analytics 4 (GA4) for the ScoreNews website.

## Prerequisites

1. A Google Analytics 4 property
2. A GA4 Measurement ID (format: `G-XXXXXXXXXX`)

## Setup Steps

### 1. Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use an existing one)
3. Copy your Measurement ID (starts with `G-`)

### 2. Configure Environment Variable

Add your Google Analytics Measurement ID to your environment variables:

**For Local Development:**
Create or update `.env.local` in the `frontend` directory:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**For Production (Vercel):**

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add a new variable:
   - **Name**: `NEXT_PUBLIC_GA_ID`
   - **Value**: Your GA4 Measurement ID (e.g., `G-XXXXXXXXXX`)
   - **Environment**: Production, Preview, Development (as needed)

### 3. Verify Installation

After deploying, verify that Google Analytics is working:

1. **Real-time Reports**: Go to Google Analytics → Reports → Real-time
2. Visit your website
3. You should see your visit appear in the real-time report within a few seconds

### 4. Test in Development

In development mode, Google Analytics events will be logged to the browser console instead of being sent to GA. This helps with debugging without polluting your analytics data.

## What's Being Tracked

### Automatic Tracking

1. **Page Views**: Automatically tracked on every route change
2. **Web Vitals**: Core Web Vitals (CLS, FCP, LCP, TTFB, INP) are automatically sent to GA
3. **Article Views**: Tracked when users view news articles
4. **Match Views**: Tracked when users view cricket/football matches

### Custom Events Available

You can use the analytics utility functions to track custom events:

```typescript
import { trackEvent, trackSearch, trackShare, trackError } from '@/lib/analytics';

// Track a custom event
trackEvent('button_click', {
  button_name: 'subscribe',
  location: 'header',
});

// Track search queries
trackSearch('cricket scores', 25);

// Track social shares
trackShare('facebook', 'article', 'article-123');

// Track errors
trackError(new Error('Something went wrong'), false, {
  page: '/news',
  user_action: 'load_article',
});
```

## Available Tracking Functions

### Page Tracking

- `trackPageView(path: string, title?: string)` - Track page views

### Event Tracking

- `trackEvent(eventName: string, eventParams?: Record<string, unknown>)` - Track custom events
- `trackArticleView(articleId: string, articleTitle: string, category?: string)` - Track article views
- `trackMatchView(matchId: string | number, matchType: string, leagueName?: string)` - Track match views
- `trackSearch(searchTerm: string, resultsCount?: number)` - Track search queries
- `trackInteraction(action: string, category: string, label?: string)` - Track user interactions
- `trackShare(platform: string, contentType: string, contentId: string)` - Track social shares
- `trackVideoPlay(videoId: string, videoTitle?: string)` - Track video plays
- `trackError(error: string | Error, fatal?: boolean, context?: Record<string, unknown>)` - Track errors

### User Properties

- `setUserProperties(properties: Record<string, unknown>)` - Set user properties

## Google Analytics Dashboard Setup

### Recommended Custom Reports

1. **Content Performance**
   - Track article views, categories, and engagement
   - Set up custom dimensions for article categories and types

2. **Match Engagement**
   - Track match views by sport type and league
   - Monitor live match engagement vs completed matches

3. **User Journey**
   - Track user flow from homepage to articles/matches
   - Identify popular entry and exit points

4. **Performance Monitoring**
   - Monitor Web Vitals metrics
   - Set up alerts for poor performance

### Custom Dimensions (Optional)

You can set up custom dimensions in Google Analytics for:

- Article Category
- Article Type
- Match Type (Cricket/Football)
- League Name
- User Role (if you have user authentication)

## Privacy & Compliance

### GDPR Compliance

- Google Analytics is configured to respect user privacy
- Consider implementing a cookie consent banner for EU users
- Review Google Analytics data retention settings

### Data Retention

1. Go to Google Analytics → Admin → Data Settings → Data Retention
2. Set retention period (recommended: 14 months for free tier, 50 months for GA360)

## Troubleshooting

### Analytics Not Working

1. **Check Environment Variable**: Ensure `NEXT_PUBLIC_GA_ID` is set correctly
2. **Check Browser Console**: Look for any errors related to `gtag`
3. **Verify GA ID Format**: Should start with `G-` (e.g., `G-XXXXXXXXXX`)
4. **Check Network Tab**: Verify that requests are being sent to `www.googletagmanager.com`

### Events Not Appearing

1. **Real-time Reports**: Check Real-time reports first (events appear within seconds)
2. **Standard Reports**: Standard reports may take 24-48 hours to update
3. **Debug Mode**: Use Google Analytics DebugView for real-time event debugging

### Development Mode

In development, events are logged to the console instead of being sent to GA. This is intentional to prevent polluting your analytics data during development.

## Additional Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 Event Tracking](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [Next.js Script Component](https://nextjs.org/docs/app/api-reference/components/script)

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Test in incognito mode to rule out ad blockers
4. Check Google Analytics Real-time reports
