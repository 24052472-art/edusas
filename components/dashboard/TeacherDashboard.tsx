'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { NoteCardSkeleton } from '@/components/ui/Skeleton';
import { getTeacherNotes, createNote } from '@/services/modules/notes/notesService';
import { uploadFile, generateFilePath } from '@/services/core/storageService';
import { getBranches, getAllSubjects } from '@/services/modules/branches/branchesService';
import { Note, Branch, Subject, NoteCategory } from '@/types';
import { Upload, FileText, Download, Eye, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const NOTE_CATEGORIES: NoteCategory[] = ['Notes', 'PYQ', 'Entrance'];

export function TeacherDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState({
    title: '', description: '', topic: '', category: 'Notes' as NoteCategory,
    branchId: '', subjectId: '', file: null as File | null,
  });

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return; }
    if (!loading && user && user.role !== 'teacher' && user.role !== 'admin' && user.role !== 'super_admin') {
      router.push('/dashboard/student');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getTeacherNotes(user.uid).then(setNotes).finally(() => setNotesLoading(false)),
      getBranches().then(setBranches),
      getAllSubjects().then(setSubjects),
    ]);
  }, [user]);

  if (!user) return null;

  const filteredSubjects = form.branchId
    ? subjects.filter((s) => s.branchId === form.branchId)
    : subjects;

  const handleUpload = async () => {
    if (!form.title || !form.branchId || !form.subjectId || !form.file) {
      toast.error('Please fill all required fields');
      return;
    }
    setUploading(true);
    try {
      const filePath = generateFilePath('notes', user.uid, form.file.name);
      const fileUrl = await uploadFile(form.file, filePath, setUploadProgress);
      await createNote({
        title: form.title,
        description: form.description,
        topic: form.topic,
        category: form.category,
        branchId: form.branchId,
        subjectId: form.subjectId,
        fileUrl,
        uploadedBy: user.uid,
        uploaderName: user.displayName,
        uploaderRole: user.role,
        status: 'pending',
      });
      toast.success('Note uploaded! Pending approval.');
      setShowUploadModal(false);
      setForm({ title: '', description: '', topic: '', category: 'Notes', branchId: '', subjectId: '', file: null });
      const updated = await getTeacherNotes(user.uid);
      setNotes(updated);
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const totalDownloads = notes.reduce((sum, n) => sum + (n.downloads || 0), 0);
  const totalViews = notes.reduce((sum, n) => sum + (n.views || 0), 0);

  const stats = [
    { label: 'Total Uploads', value: notes.length, icon: FileText },
    { label: 'Downloads', value: totalDownloads, icon: Download },
    { label: 'Views', value: totalViews, icon: Eye },
    { label: 'Pending', value: notes.filter((n) => n.status === 'pending').length, icon: Clock },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fefdf8' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-brown-100 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar src={user.photoURL} name={user.displayName} size="xl" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-brown-900">{user.displayName}</h1>
                  {user.verified && <Badge variant="success">Verified</Badge>}
                </div>
                <p className="text-brown-500 text-sm">{user.email}</p>
                <Badge className="mt-2">Teacher</Badge>
              </div>
            </div>
            <Button onClick={() => setShowUploadModal(true)}>
              <Plus size={16} /> Upload Note
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-brown-100">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-8 h-8 bg-brown-100 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                  <stat.icon size={16} className="text-brown-700" />
                </div>
                <p className="text-xl font-bold text-brown-900">{stat.value.toLocaleString()}</p>
                <p className="text-xs text-brown-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notes List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-semibold text-brown-900 mb-4">Your Uploads</h2>
          {notesLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <NoteCardSkeleton key={i} />)}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-brown-100">
              <Upload size={40} className="mx-auto mb-4 text-brown-400 opacity-40" />
              <p className="font-medium text-brown-700">No uploads yet</p>
              <p className="text-sm text-brown-500 mt-1 mb-4">Share your knowledge with students</p>
              <Button onClick={() => setShowUploadModal(true)}><Plus size={16} /> Upload First Note</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="bg-white rounded-2xl p-5 border border-brown-100 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-brown-900 truncate">{note.title}</h3>
                      {note.status === 'approved' && <CheckCircle size={14} className="text-green-500 flex-shrink-0" />}
                      {note.status === 'pending' && <Clock size={14} className="text-yellow-500 flex-shrink-0" />}
                      {note.status === 'draft' && <AlertCircle size={14} className="text-red-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-brown-500">{note.topic} · {note.category}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-brown-400 flex-shrink-0">
                    <span className="flex items-center gap-1"><Eye size={12} />{note.views}</span>
                    <span className="flex items-center gap-1"><Download size={12} />{note.downloads}</span>
                    <Badge variant={note.status === 'approved' ? 'success' : note.status === 'pending' ? 'warning' : 'danger'}>
                      {note.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Upload Modal */}
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload Note" size="lg">
        <div className="space-y-4">
          <Input
            label="Title *"
            placeholder="e.g., Data Structures Complete Notes"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            label="Topic"
            placeholder="e.g., Arrays, Linked Lists, Trees"
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brown-700">Description</label>
            <textarea
              className="w-full px-4 py-2.5 rounded-xl border border-brown-200 bg-white text-brown-900 placeholder-brown-400 focus:outline-none focus:ring-2 focus:ring-brown-300 resize-none"
              rows={3}
              placeholder="Brief description of the content..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brown-700">Category *</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-brown-200 bg-white text-brown-900 focus:outline-none focus:ring-2 focus:ring-brown-300"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as NoteCategory })}
              >
                {NOTE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-brown-700">Branch *</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-brown-200 bg-white text-brown-900 focus:outline-none focus:ring-2 focus:ring-brown-300"
                value={form.branchId}
                onChange={(e) => setForm({ ...form, branchId: e.target.value, subjectId: '' })}
              >
                <option value="">Select branch</option>
                {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brown-700">Subject *</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-brown-200 bg-white text-brown-900 focus:outline-none focus:ring-2 focus:ring-brown-300"
              value={form.subjectId}
              onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
            >
              <option value="">Select subject</option>
              {filteredSubjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brown-700">PDF File *</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
              className="w-full px-4 py-2.5 rounded-xl border border-brown-200 bg-white text-brown-900 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-brown-100 file:text-brown-700"
            />
          </div>
          {uploading && (
            <div className="space-y-1">
              <div className="h-2 bg-brown-100 rounded-full overflow-hidden">
                <div className="h-full bg-brown-700 transition-all duration-200 rounded-full" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="text-xs text-brown-500 text-right">{Math.round(uploadProgress)}%</p>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowUploadModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleUpload} loading={uploading}>
              <Upload size={16} /> Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
