'use client';

import Link from 'next/link';
import { Container } from '@/components/ui';
import {
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  ArrowRight,
  Smartphone,
  Mail
} from 'lucide-react';

const footerColumns = [
  {
    heading: 'Quick Links',
    items: [
      { label: 'Home', href: '/' },
      { label: 'Cricket', href: '/cricket' },
      { label: 'Football', href: '/football' },
      { label: 'News', href: '/news' },
      { label: 'Threads', href: '/threads' },
    ],
  },
  {
    heading: 'Coverage',
    items: [
      { label: 'Live Scores', href: '/cricket#live' },
      { label: 'Fixtures & Results', href: '/fixtures' },
      { label: 'Rankings', href: '/stats' },
      { label: 'Analysis', href: '/news?type=analysis' },
      { label: 'Interviews', href: '/news?type=interview' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'About Us', href: '/about' },
      { label: 'Advertise', href: '/advertise' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Support', href: '/support' },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
  { icon: Twitter, label: 'Twitter / X', href: 'https://twitter.com' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
];

const appLinks = [
  {
    label: 'Android App',
    href: '#',
    description: 'Download from Google Play',
  },
  {
    label: 'iOS App',
    href: '#',
    description: 'Get it on the App Store',
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-gray-300 border-t border-slate-900">
      <div className="border-b border-slate-900 bg-gradient-to-r from-emerald-600/10 via-transparent to-blue-600/10">
        <Container size="xl" className="py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                <span className="text-white text-xl font-semibold">SL</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">SportsLive</h2>
                <p className="text-sm text-gray-400">
                  Real-time sports coverage, stats, and stories delivered with accuracy.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-emerald-600/40 text-gray-200 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-600 transition-standard"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <Container size="xl" className="py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">{column.heading}</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 hover:text-emerald-400 transition-standard"
                    >
                      <ArrowRight className="w-3 h-3" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Get the App</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                {appLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 hover:border-emerald-500 hover:bg-slate-900 transition-standard"
                    >
                      <Smartphone className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-gray-200 font-medium">{link.label}</p>
                        <p className="text-xs text-gray-400">{link.description}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-900">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">Stay Updated</h3>
              <p className="text-sm text-gray-400 mb-4">
                Subscribe for match alerts, editorial highlights, and exclusive interviews.
              </p>
              <form className="flex flex-col gap-3" onSubmit={(event) => event.preventDefault()}>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="footer-email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-sm text-gray-100 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60 outline-none transition-standard"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-standard"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-slate-900 bg-slate-950/80">
        <Container size="xl" className="py-6">
          <div className="flex flex-col gap-4 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
            <p>&copy; {year} SportsLive Media Pvt. Ltd. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/legal/terms" className="hover:text-emerald-400 transition-standard">Terms of Use</Link>
              <Link href="/legal/privacy" className="hover:text-emerald-400 transition-standard">Privacy Policy</Link>
              <Link href="/legal/cookies" className="hover:text-emerald-400 transition-standard">Cookie Policy</Link>
              <Link href="/legal/accessibility" className="hover:text-emerald-400 transition-standard">Accessibility</Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

