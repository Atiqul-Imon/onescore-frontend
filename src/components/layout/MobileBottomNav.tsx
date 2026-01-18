'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Trophy, Play, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Matches',
    href: '/fixtures',
    icon: Calendar,
  },
  {
    name: 'Series',
    href: '/cricket',
    icon: Trophy,
  },
  {
    name: 'Videos',
    href: '/football',
    icon: Play,
  },
  {
    name: 'News',
    href: '/news',
    icon: Newspaper,
  },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
  const pathname = usePathname();

  // Don't show on admin pages or auth pages
  const shouldHide = pathname.startsWith('/admin') || 
                     pathname.startsWith('/login') || 
                     pathname.startsWith('/register');

  if (shouldHide) {
    return null;
  }

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-14 px-1 sm:px-2 max-w-screen-sm mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full min-w-0 px-1 transition-all duration-200 relative',
                isActive
                  ? 'text-emerald-600'
                  : 'text-gray-500 hover:text-gray-700 active:scale-95'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative flex items-center justify-center mb-0.5">
                <Icon 
                  className={cn(
                    'h-5 w-5 transition-all duration-200',
                    isActive && 'scale-110'
                  )} 
                />
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full" />
                )}
              </div>
              <span 
                className={cn(
                  'text-[10px] font-medium truncate max-w-full leading-tight',
                  isActive ? 'text-emerald-600 font-semibold' : 'text-gray-600'
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

