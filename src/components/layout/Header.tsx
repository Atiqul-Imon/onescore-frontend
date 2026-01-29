'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Activity, User, Search, Bell } from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';
import { Container } from '@/components/ui/Container';

function isActivePath(pathname: string, target: string) {
  if (target === '/') return pathname === '/';
  return pathname === target || pathname.startsWith(`${target}/`);
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isConnected } = useSocket();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navigation = [
    { name: 'Cricket', href: '/cricket' },
    { name: 'Teams', href: '/cricket/teams' },
    { name: 'Football', href: '/football' },
    { name: 'Future', href: '/fixtures' },
    { name: 'News', href: '/news' },
    { name: 'Crowd Thread', href: '/threads' },
    { name: 'Quiz', href: '/quiz' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 fixed top-0 left-0 right-0 z-[9999] shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 max-w-7xl mx-auto">
          {/* Left Side - Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 -ml-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo - Centered on mobile, left on desktop */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-standard flex-shrink-0 md:flex-shrink"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-primary-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">ScoreNews</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-8 flex-1 justify-center"
            aria-label="Main navigation"
          >
            {navigation.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-standard font-medium ${active ? 'text-primary-600 font-semibold' : 'text-gray-700 hover:text-primary-600'}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions - Desktop Only */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {/* Search */}
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-600 hover:text-primary-600 transition-standard flex items-center justify-center"
              aria-expanded={isSearchOpen}
              aria-controls="global-search"
            >
              <Search className="w-5 h-5" />
              <span className="sr-only">Toggle search</span>
            </button>

            {/* Notifications */}
            <button
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-standard flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </span>
            </button>

            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
              />
              <span className="text-sm text-gray-600">{isConnected ? 'Live' : 'Offline'}</span>
            </div>

            {/* User Profile / Login */}
            <Link
              href="/login"
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">Login</span>
            </Link>
          </div>

          {/* Mobile - Empty space to balance layout */}
          <div className="md:hidden w-10 flex-shrink-0"></div>
        </div>

        {/* Search Bar - Desktop Only */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="hidden md:block border-t border-gray-200"
            >
              <div className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search matches, teams, players..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-standard"
                    id="global-search"
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        setIsSearchOpen(false);
                      }
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu - Slide from left */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
            />
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-64 sm:w-72 bg-white shadow-xl z-[9999] md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
                <span className="text-lg font-bold text-gray-900">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="py-4">
                {navigation.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-4 py-3 transition-standard font-medium ${active ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={active ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  );
                })}

                {/* Mobile Connection Status */}
                <div className="flex items-center space-x-3 px-4 py-3 border-t border-gray-200 mt-4">
                  <div
                    className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
                  />
                  <span className="text-sm text-gray-600">
                    {isConnected ? 'Live Connection' : 'Connection Lost'}
                  </span>
                </div>

                {/* Mobile Login Link */}
                <Link
                  href="/login"
                  className="block px-4 py-3 mt-4 border-t border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-standard font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span>Login</span>
                  </div>
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
