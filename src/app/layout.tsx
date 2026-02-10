import type { Metadata } from 'next';
import { Inter, PT_Serif, Outfit } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';
import { WebVitalsReporter } from '@/components/performance/WebVitalsReporter';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const ptSerif = PT_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-serif',
  display: 'swap',
});

const geoformLike = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-geoform',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ScoreNews - Live Cricket & Football Scores',
    template: '%s | ScoreNews',
  },
  description:
    'Get live cricket and football scores, fixtures, and user-generated content. Stay updated with real-time sports news and match updates.',
  keywords: [
    'cricket',
    'football',
    'live scores',
    'sports news',
    'match updates',
    'fixtures',
    'sports content',
    'cricket scores',
    'football scores',
    'live cricket',
    'live football',
    'cricket news',
    'football news',
    'sports updates',
    'match reports',
    'cricket fixtures',
    'football fixtures',
    'sports analysis',
    'cricket commentary',
    'football commentary',
    'sports platform',
    'scorenews',
    'real-time sports',
    'sports coverage',
    'cricket live',
    'football live',
    'sports scores',
    'match results',
    'sports statistics',
  ],
  authors: [{ name: 'Pixel Forge Web Development Agency' }],
  creator: 'Pixel Forge Web Development Agency',
  publisher: 'ScoreNews',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'ScoreNews - Live Cricket & Football Scores',
    description: 'Get live cricket and football scores, fixtures, and user-generated content.',
    siteName: 'ScoreNews',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'ScoreNews',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScoreNews - Live Cricket & Football Scores',
    description: 'Get live cricket and football scores, fixtures, and user-generated content.',
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${ptSerif.variable} ${geoformLike.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* WebSite Structured Data */}
        <Script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'ScoreNews',
              url: siteUrl,
              description:
                'Get live cricket and football scores, fixtures, and user-generated content. Stay updated with real-time sports news and match updates.',
              publisher: {
                '@type': 'Organization',
                name: 'ScoreNews',
                url: siteUrl,
                logo: {
                  '@type': 'ImageObject',
                  url: `${siteUrl}/logo.png`,
                },
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${siteUrl}/news?search={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
              sameAs: [
                // Add social media links when available
                // 'https://www.facebook.com/scorenews',
                // 'https://twitter.com/scorenews',
                // 'https://www.instagram.com/scorenews',
              ],
            }),
          }}
        />
        <GoogleAnalytics />
        <Providers>
          <PageViewTracker />
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <div className="flex min-h-screen flex-col bg-gray-50">
            <ConditionalLayout>
              <main id="main-content" className="flex-1">
                {children}
              </main>
            </ConditionalLayout>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'dark:bg-gray-800 dark:text-white',
              style: {
                background: undefined,
                color: undefined,
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <WebVitalsReporter />
        </Providers>
      </body>
    </html>
  );
}
