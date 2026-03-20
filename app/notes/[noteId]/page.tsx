import { NoteDetailPage } from '@/components/notes/NoteDetailPage';

export default function NotePage({ params }: { params: { noteId: string } }) {
  return <NoteDetailPage noteId={params.noteId} />;
}
