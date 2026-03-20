'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useNotes } from '@/hooks/useNotes';
import { useAuth } from '@/hooks/useAuth';
import { addToDownloadHistory } from '@/services/modules/users/usersService';
import { incrementDownloads } from '@/services/modules/notes/notesService';
import { Note, NoteCategory } from '@/types';
import { BookOpen, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const CATEGORIES: NoteCategory[] = ['Notes', 'PYQ', 'Entrance'];

export default function NotesPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | undefined>();
  const { notes, loading } = useNotes({ category: selectedCategory });

  const handleDownload = async (note: Note) => {
    if (!user) return;
    try {
      await Promise.all([
        addToDownloadHistory(user.uid, note.id),
        incrementDownloads(note.id),
      ]);
      window.open(note.fileUrl, '_blank');
      toast.success('Download started!');
    } catch {
      toast.error('Download failed.');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fefdf8' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-brown-900">Browse Notes</h1>
            <p className="text-sm text-brown-500 mt-1">
              {notes.length > 0 ? `${notes.length} materials available` : 'Explore study materials'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-brown-500" />
            <span className="text-sm text-brown-600">Filter:</span>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              !selectedCategory ? 'bg-brown-700 text-white' : 'bg-white text-brown-600 border border-brown-100 hover:bg-beige-50'
            )}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                selectedCategory === cat ? 'bg-brown-700 text-white' : 'bg-white text-brown-600 border border-brown-100 hover:bg-beige-50'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <NoteCardSkeleton key={i} />)}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="mx-auto mb-4 text-brown-400 opacity-40" />
            <p className="font-semibold text-brown-700 text-lg">No notes found</p>
            <p className="text-sm text-brown-500 mt-2">Try changing your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDownload={handleDownload}
                isAuthenticated={!!user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
