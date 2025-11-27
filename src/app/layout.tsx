import type { Metadata } from 'next';
import { Inter, PT_Serif, Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import { Header, Footer } from '@/components/layout';

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
    default: 'Sports Platform - Live Cricket & Football Scores',
    template: '%s | Sports Platform',
  },
  description: 'Get live cricket and football scores, fixtures, and user-generated content. Stay updated with real-time sports news and match updates.',
  keywords: [
    'cricket',
    'football',
    'live scores',
    'sports news',
    'match updates',
    'fixtures',
    'sports content'
  ],
  authors: [{ name: 'Pixel Forge Web Development Agency' }],
  creator: 'Pixel Forge Web Development Agency',
  publisher: 'Sports Platform',
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
    title: 'Sports Platform - Live Cricket & Football Scores',
    description: 'Get live cricket and football scores, fixtures, and user-generated content.',
    siteName: 'Sports Platform',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Sports Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sports Platform - Live Cricket & Football Scores',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${ptSerif.variable} ${geoformLike.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <a
            href="#main-content"
            className="skip-link"
          >
            Skip to content
          </a>
          <div className="flex min-h-screen flex-col bg-gray-100">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
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
        </Providers>
      </body>
    </html>
  );
}
