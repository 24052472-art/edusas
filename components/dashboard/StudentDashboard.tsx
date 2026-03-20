'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteCardSkeleton } from '@/components/ui/Skeleton';
import { useNotes } from '@/hooks/useNotes';
import { addToDownloadHistory } from '@/services/modules/users/usersService';
import { incrementDownloads } from '@/services/modules/notes/notesService';
import { Note } from '@/types';
import { BookOpen, Download, Bookmark, Users, TrendingUp, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { notes, loading: notesLoading } = useNotes();
  const [activeTab, setActiveTab] = useState<'discover' | 'saved'>('discover');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (!user) return null;

  const handleDownload = async (note: Note) => {
    try {
      await Promise.all([
        addToDownloadHistory(user.uid, note.id),
        incrementDownloads(note.id),
      ]);
      window.open(note.fileUrl, '_blank');
      toast.success('Download started!');
    } catch {
      toast.error('Download failed. Please try again.');
    }
  };

  const stats = [
    { label: 'Downloads', value: user.downloadHistory?.length || 0, icon: Download },
    { label: 'Saved Notes', value: user.savedNotes?.length || 0, icon: Bookmark },
    { label: 'Following', value: user.following?.length || 0, icon: Users },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fefdf8' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-brown-100 mb-6"
        >
          <div className="flex items-center gap-4">
            <Avatar src={user.photoURL} name={user.displayName} size="xl" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-brown-900">{user.displayName}</h1>
                {user.verified && <Badge variant="success">Verified</Badge>}
              </div>
              <p className="text-brown-500 text-sm">{user.email}</p>
              <Badge className="mt-2">{user.role}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-brown-100">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-8 h-8 bg-brown-100 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                  <stat.icon size={16} className="text-brown-700" />
                </div>
                <p className="text-xl font-bold text-brown-900">{stat.value}</p>
                <p className="text-xs text-brown-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        >
          {[
            { label: 'Browse Notes', icon: BookOpen, href: '/notes', color: 'bg-brown-700' },
            { label: 'Trending', icon: TrendingUp, href: '/notes?sort=trending', color: 'bg-amber-600' },
            { label: 'Recent', icon: Clock, href: '/notes?sort=recent', color: 'bg-blue-600' },
            { label: 'Saved', icon: Bookmark, href: '/notes?filter=saved', color: 'bg-green-600' },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="bg-white rounded-2xl p-4 border border-brown-100 hover:shadow-md transition-all text-center group"
            >
              <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                <action.icon size={18} className="text-white" />
              </div>
              <p className="text-sm font-medium text-brown-800">{action.label}</p>
            </a>
          ))}
        </motion.div>

        {/* Notes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-6">
            {['discover', 'saved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'discover' | 'saved')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-brown-700 text-white'
                    : 'text-brown-600 hover:bg-brown-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {notesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <NoteCardSkeleton key={i} />)}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-16 text-brown-500">
              <BookOpen size={40} className="mx-auto mb-4 opacity-40" />
              <p className="font-medium">No notes available yet</p>
              <p className="text-sm mt-1">Check back soon for new content</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDownload={handleDownload}
                  isAuthenticated
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
