'use client';

/**
 * Google Analytics Component
 * Loads Google Analytics 4 (GA4) script and initializes tracking
 *
 * @example
 * ```tsx
 * <GoogleAnalytics />
 * ```
 */

import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId?: string;
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const trackingId = gaId || process.env.NEXT_PUBLIC_GA_ID;

  // Don't render if no tracking ID is provided
  if (!trackingId) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 - Global Site Tag (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackingId}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}
