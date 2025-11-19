"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

const nav = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/news', label: 'News' },
  { href: '/admin/news/create', label: 'Create Article' },
  { href: '/admin/moderation/comments', label: 'Moderation' },
  { href: '/admin/users', label: 'Users' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-screen sticky top-0">
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="text-lg font-semibold text-gray-900 dark:text-white">Admin</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">Sports Platform</div>
      </div>
      <nav className="p-2 space-y-1">
        {nav.map(item => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? 'bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <ThemeToggle />
      </div>
    </aside>
  );
}


