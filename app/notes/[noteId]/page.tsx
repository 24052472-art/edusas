import { NoteDetailPage } from '@/components/notes/NoteDetailPage';

export default async function NotePage({ params }: { params: Promise<{ noteId: string }> }) {
  const { noteId } = await params;
  return <NoteDetailPage noteId={noteId} />;
}
