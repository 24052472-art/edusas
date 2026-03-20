'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { APP_NAME } from '@/lib/constants';
import { BookOpen, LogOut, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { user, signOut, loading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student': return '/dashboard/student';
      case 'teacher': return '/dashboard/teacher';
      case 'admin':
      case 'super_admin': return '/dashboard/admin';
      default: return '/dashboard/student';
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-beige-50/90 backdrop-blur-md border-b border-brown-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brown-700 rounded-xl flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-bold text-brown-900 text-lg">{APP_NAME}</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-brown-600 hover:text-brown-900 transition-colors">
              Discover
            </Link>
            <Link href="/notes" className="text-sm text-brown-600 hover:text-brown-900 transition-colors">
              Notes
            </Link>
            <Link href="/teachers" className="text-sm text-brown-600 hover:text-brown-900 transition-colors">
              Teachers
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <>
                    <NotificationBell />
                    <div className="relative">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 p-1 rounded-xl hover:bg-brown-100 transition-colors"
                      >
                        <Avatar src={user.photoURL} name={user.displayName} size="sm" />
                        <span className="hidden md:block text-sm font-medium text-brown-800">
                          {user.displayName.split(' ')[0]}
                        </span>
                      </button>

                      <AnimatePresence>
                        {showUserMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-brown-100 py-2 z-50"
                          >
                            <div className="px-4 py-2 border-b border-brown-100">
                              <p className="text-sm font-medium text-brown-900">{user.displayName}</p>
                              <p className="text-xs text-brown-500 capitalize">{user.role.replace('_', ' ')}</p>
                            </div>
                            <Link
                              href={getDashboardLink()}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-brown-700 hover:bg-beige-50 transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Settings size={14} />
                              Dashboard
                            </Link>
                            <button
                              onClick={() => { signOut(); setShowUserMenu(false); }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut size={14} />
                              Sign out
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <Link href="/login">
                    <Button size="sm">Sign in</Button>
                  </Link>
                )}
              </>
            )}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-brown-100 text-brown-600"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-brown-100 bg-beige-50"
          >
            <div className="px-4 py-3 space-y-1">
              {['/', '/notes', '/teachers'].map((href, i) => (
                <Link
                  key={href}
                  href={href}
                  className="block py-2 text-sm text-brown-700 hover:text-brown-900"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {['Discover', 'Notes', 'Teachers'][i]}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
