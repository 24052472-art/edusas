'use client';

import { Note } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime } from '@/lib/utils';
import { Download, Eye, Star } from 'lucide-react';
import Link from 'next/link';

interface NoteCardProps {
  note: Note;
  onDownload?: (note: Note) => void;
  isAuthenticated?: boolean;
}

const categoryColors = {
  Notes: 'default' as const,
  PYQ: 'info' as const,
  Entrance: 'warning' as const,
};

export function NoteCard({ note, onDownload, isAuthenticated }: NoteCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-brown-100 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <Badge variant={categoryColors[note.category]}>{note.category}</Badge>
        {note.rating > 0 && (
          <div className="flex items-center gap-1 text-xs text-brown-500">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            {note.rating.toFixed(1)}
          </div>
        )}
      </div>

      <Link href={`/notes/${note.id}`}>
        <h3 className="font-semibold text-brown-900 mb-1.5 group-hover:text-brown-700 transition-colors line-clamp-2">
          {note.title}
        </h3>
      </Link>

      <p className="text-xs text-brown-500 mb-3 line-clamp-2">{note.description}</p>

      <div className="text-xs text-brown-400 mb-4">
        <span>{note.topic}</span>
        <span className="mx-1">·</span>
        <span>{formatRelativeTime(note.createdAt)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-brown-400">
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {note.views || 0}
          </span>
          <span className="flex items-center gap-1">
            <Download size={12} />
            {note.downloads}
          </span>
        </div>
        <div className="flex gap-2">
          <Link href={`/notes/${note.id}`}>
            <Button size="sm" variant="secondary">
              <Eye size={13} />
              View
            </Button>
          </Link>
          {isAuthenticated ? (
            <Button size="sm" variant="primary" onClick={() => onDownload?.(note)}>
              <Download size={13} />
            </Button>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
