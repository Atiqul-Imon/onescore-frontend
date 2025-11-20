'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useMemo, useState } from 'react';
import {
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
  Image as ImageIcon,
  Settings,
  Newspaper,
  Trophy,
  PenSquare,
} from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    title: 'Command',
    items: [
      { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: 'Moderation', href: '/admin/moderation/comments', icon: <ShieldCheck className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Newsroom', href: '/admin/news', icon: <Newspaper className="h-4 w-4" /> },
      { label: 'Teams', href: '/admin/teams', icon: <Trophy className="h-4 w-4" /> },
      { label: 'Media', href: '/admin/media', icon: <ImageIcon className="h-4 w-4" /> },
    ],
  },
  {
    title: 'People',
    items: [
      { label: 'Users', href: '/admin/users', icon: <Users className="h-4 w-4" /> },
      { label: 'System Logs', href: '/admin', icon: <FileText className="h-4 w-4" /> },
      { label: 'Settings', href: '/admin', icon: <Settings className="h-4 w-4" /> },
    ],
  },
];

export function AdminLayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = useMemo(() => navSections, []);

  const renderNav = () => (
    <div className="flex h-full flex-col gap-8 overflow-y-auto px-6 pb-10 pt-8">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-lg font-bold">OS</span>
        Onescore Admin
      </Link>
      <div className="space-y-8">
        {nav.map((section) => (
          <div key={section.title} className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">{section.title}</p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white text-slate-900'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-xs">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button className="mt-auto inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-950 transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-6 lg:hidden">
          <span className="text-lg font-semibold text-white">Onescore Admin</span>
          <button
            className="rounded-xl border border-white/10 p-2 text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {renderNav()}
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Onescore Ops</p>
                <h1 className="text-base font-semibold text-slate-900">Control Center</h1>
              </div>
            </div>
            <div className="hidden flex-1 items-center justify-center px-8 lg:flex">
              <div className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                <PenSquare className="h-4 w-4" />
                <input
                  type="search"
                  placeholder="Search content, teams, or users…"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/news/create"
                className="hidden items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow lg:flex"
              >
                <PenSquare className="h-4 w-4" />
                New Article
              </Link>
              <button className="rounded-xl border border-slate-200 p-2 text-slate-600">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600" />
                <div className="hidden text-left text-xs lg:block">
                  <p className="font-semibold text-slate-900">Admin</p>
                  <p className="text-slate-500">Superuser</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

