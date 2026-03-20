'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { getNoteById, incrementViews, incrementDownloads } from '@/services/modules/notes/notesService';
import { addToDownloadHistory } from '@/services/modules/users/usersService';
import { Note } from '@/types';
import { Download, Eye, Star, BookOpen, ArrowLeft, Calendar, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface NoteDetailPageProps {
  noteId: string;
}

const categoryColors = {
  Notes: 'default' as const,
  PYQ: 'info' as const,
  Entrance: 'warning' as const,
};

export function NoteDetailPage({ noteId }: NoteDetailPageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = await getNoteById(noteId);
        if (!data || data.status !== 'approved') {
          router.push('/notes');
          return;
        }
        setNote(data);
        await incrementViews(noteId);
      } catch {
        router.push('/notes');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [noteId, router]);

  const handleDownload = async () => {
    if (!user) { router.push('/login'); return; }
    if (!note) return;
    setDownloading(true);
    try {
      await Promise.all([
        addToDownloadHistory(user.uid, note.id),
        incrementDownloads(note.id),
      ]);
      window.open(note.fileUrl, '_blank');
      setNote((prev) => prev ? { ...prev, downloads: prev.downloads + 1 } : null);
      toast.success('Download started!');
    } catch {
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fefdf8' }}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-brown-100 rounded-xl w-3/4" />
            <div className="h-4 bg-brown-100 rounded-xl w-1/2" />
            <div className="h-64 bg-brown-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fefdf8' }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/notes" className="inline-flex items-center gap-2 text-sm text-brown-600 hover:text-brown-900 mb-6 transition-colors">
          <ArrowLeft size={16} />
          Back to Notes
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-8 border border-brown-100 mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <Badge variant={categoryColors[note.category]}>{note.category}</Badge>
              {note.rating > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-brown-600">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{note.rating.toFixed(1)}</span>
                  <span className="text-brown-400">({note.ratingCount} ratings)</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold text-brown-900 mb-3">{note.title}</h1>
            <p className="text-brown-600 mb-6">{note.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-brown-500 mb-6">
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} />
                {note.topic}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={14} />
                {note.views || 0} views
              </span>
              <span className="flex items-center gap-1.5">
                <Download size={14} />
                {note.downloads} downloads
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(note.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-beige-50 rounded-xl mb-6">
              <div className="w-10 h-10 bg-brown-200 rounded-full flex items-center justify-center">
                <User size={18} className="text-brown-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-brown-900">{note.uploaderName}</p>
                <p className="text-xs text-brown-500 capitalize">{note.uploaderRole.replace('_', ' ')}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button size="lg" onClick={handleDownload} loading={downloading} className="flex-1 sm:flex-none">
                <Download size={18} />
                {user ? 'Download PDF' : 'Login to Download'}
              </Button>
              {!user && (
                <Link href="/login">
                  <Button size="lg" variant="secondary">Sign in Free</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Preview placeholder */}
          <div className="bg-white rounded-2xl border border-brown-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-brown-100 flex items-center justify-between">
              <h2 className="font-semibold text-brown-900">Document Preview</h2>
              {!user && (
                <Badge variant="warning">Login required for full access</Badge>
              )}
            </div>
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 bg-brown-100 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen size={28} className="text-brown-500" />
              </div>
              <h3 className="font-semibold text-brown-900 mb-2">PDF Document</h3>
              <p className="text-sm text-brown-500 mb-6 max-w-md">
                {user
                  ? 'Click the download button above to open this document in a new tab.'
                  : 'Sign in to download and view this study material.'}
              </p>
              <Button onClick={handleDownload} loading={downloading}>
                <Download size={16} />
                {user ? 'Open Document' : 'Login to Access'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
