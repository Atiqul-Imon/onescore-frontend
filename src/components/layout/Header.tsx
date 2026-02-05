'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Activity,
  User,
  LogIn,
  LogOut,
  Settings,
  Search,
  ChevronDown,
  UserCircle,
  Shield,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { logout } from '@/store/slices/authSlice';
import clsx from 'clsx';

function isActivePath(pathname: string, target: string) {
  if (target === '/') return pathname === '/';
  return pathname === target || pathname.startsWith(`${target}/`);
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const navigation = [
    { name: 'Cricket', href: '/cricket' },
    { name: 'Teams', href: '/cricket/teams' },
    { name: 'Football', href: '/football' },
    { name: 'Matches', href: '/cricket/results' },
    { name: 'News', href: '/news' },
    { name: 'Crowd Thread', href: '/threads' },
    { name: 'Quiz', href: '/quiz' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logout());
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-[9999] transition-all duration-300',
          isScrolled
            ? 'bg-white shadow-lg border-b border-slate-200'
            : 'bg-white shadow-sm border-b border-slate-200'
        )}
        style={{ isolation: 'isolate' }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 max-w-7xl mx-auto">
            {/* Left Side - Mobile Menu Button & Logo */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 -ml-2 rounded-xl text-slate-700 hover:text-primary-600 hover:bg-slate-100 transition-all duration-200 flex-shrink-0"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
                <div className="relative">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:shadow-primary-500/40 transition-all duration-300 group-hover:scale-105">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300">
                    ScoreNews
                  </span>
                  <span className="hidden sm:block text-[10px] lg:text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Sports Media
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-1 flex-1 justify-center px-8"
              aria-label="Main navigation"
            >
              {navigation.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      'relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                      active
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.name}
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-primary-50 rounded-xl -z-10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Search Button - Desktop */}
              <button
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-slate-100 transition-all duration-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Menu - Desktop */}
              {isAuthenticated && user ? (
                <div className="hidden md:block relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
                  >
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-all duration-200">
                        {getUserInitials()}
                      </div>
                      {isAdmin && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Shield className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-sm font-semibold text-slate-900">
                        {user.name || 'User'}
                      </span>
                      <span className="text-xs text-slate-500 capitalize">
                        {user.role || 'User'}
                      </span>
                    </div>
                    <ChevronDown
                      className={clsx(
                        'w-4 h-4 text-slate-500 transition-transform duration-200 hidden lg:block',
                        isUserMenuOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200/80 overflow-hidden"
                      >
                        <div className="p-2">
                          {isAdmin && (
                            <Link
                              href="/admin"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
                            >
                              <Shield className="w-4 h-4" />
                              <span>Admin Panel</span>
                            </Link>
                          )}
                          <Link
                            href="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all duration-200"
                          >
                            <UserCircle className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all duration-200"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>
                          <div className="h-px bg-slate-200 my-1"></div>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:from-primary-700 hover:to-primary-800 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}

              {/* Mobile User Icon */}
              {isAuthenticated && user && (
                <Link
                  href="/profile"
                  className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white font-bold text-sm shadow-md"
                >
                  {getUserInitials()}
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Slide from right */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[9998] lg:hidden"
              style={{ isolation: 'isolate' }}
            />
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 right-0 bottom-0 w-80 sm:w-96 bg-white shadow-2xl z-[10000] lg:hidden overflow-y-auto"
              style={{ isolation: 'isolate' }}
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between h-16 sm:h-18 px-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg font-bold text-slate-900">Menu</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-slate-100 transition-all duration-200"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User Info Section */}
              {isAuthenticated && user && (
                <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-br from-primary-50/50 to-white">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {getUserInitials()}
                      </div>
                      {isAdmin && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-slate-900 truncate">
                        {user.name || 'User'}
                      </p>
                      <p className="text-sm text-slate-500 capitalize">{user.role || 'User'}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold shadow-md hover:bg-primary-700 transition-all duration-200"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Navigation Links */}
              <nav className="py-4">
                {navigation.map((item, index) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={clsx(
                          'flex items-center gap-3 px-6 py-4 mx-2 rounded-xl transition-all duration-200',
                          active
                            ? 'bg-primary-50 text-primary-600 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-primary-600'
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span className="text-base font-medium">{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile Actions */}
              <div className="px-6 py-4 border-t border-slate-200 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-all duration-200"
                    >
                      <UserCircle className="w-5 h-5" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-all duration-200"
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
