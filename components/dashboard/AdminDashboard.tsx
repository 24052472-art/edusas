'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { getPendingNotes, approveNote, rejectNote } from '@/services/modules/notes/notesService';
import { getAllUsers, blockUser, unblockUser, assignRole } from '@/services/modules/users/usersService';
import { getBranches, createBranch, getSubjects, createSubject } from '@/services/modules/branches/branchesService';
import { getSystemAnalytics } from '@/services/modules/analytics/analyticsService';
import { Note, User, Branch, AnalyticsData, UserRole } from '@/types';
import { Users, FileText, Download, Clock, CheckCircle, XCircle, Shield, Plus, Eye, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

type Tab = 'overview' | 'approvals' | 'users' | 'branches';

export function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [pendingNotes, setPendingNotes] = useState<Note[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: '', code: '', description: '' });

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return; }
    if (!loading && user && user.role !== 'admin' && user.role !== 'super_admin') {
      router.push('/dashboard/student');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getSystemAnalytics().then(setAnalytics),
      getPendingNotes().then(setPendingNotes),
      getAllUsers().then(setUsers),
      getBranches().then(setBranches),
    ]).finally(() => setPageLoading(false));
  }, [user]);

  if (!user) return null;

  const handleApprove = async (noteId: string) => {
    try {
      await approveNote(noteId);
      setPendingNotes((prev) => prev.filter((n) => n.id !== noteId));
      toast.success('Note approved!');
    } catch { toast.error('Failed to approve note.'); }
  };

  const handleReject = async (noteId: string) => {
    try {
      await rejectNote(noteId);
      setPendingNotes((prev) => prev.filter((n) => n.id !== noteId));
      toast.success('Note rejected.');
    } catch { toast.error('Failed to reject note.'); }
  };

  const handleToggleBlock = async (u: User) => {
    try {
      if (u.blocked) { await unblockUser(u.uid); toast.success('User unblocked.'); }
      else { await blockUser(u.uid); toast.success('User blocked.'); }
      setUsers((prev) => prev.map((x) => x.uid === u.uid ? { ...x, blocked: !x.blocked } : x));
    } catch { toast.error('Action failed.'); }
  };

  const handleRoleChange = async (uid: string, role: UserRole) => {
    try {
      await assignRole(uid, role);
      setUsers((prev) => prev.map((x) => x.uid === uid ? { ...x, role } : x));
      toast.success('Role updated!');
    } catch { toast.error('Failed to update role.'); }
  };

  const handleCreateBranch = async () => {
    if (!newBranch.name || !newBranch.code) { toast.error('Name and code are required.'); return; }
    try {
      await createBranch(newBranch);
      const updated = await getBranches();
      setBranches(updated);
      setShowBranchModal(false);
      setNewBranch({ name: '', code: '', description: '' });
      toast.success('Branch created!');
    } catch { toast.error('Failed to create branch.'); }
  };

  const TABS: { key: Tab; label: string; icon: typeof Users }[] = [
    { key: 'overview', label: 'Overview', icon: Eye },
    { key: 'approvals', label: `Approvals (${pendingNotes.length})`, icon: CheckCircle },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'branches', label: 'Branches', icon: BookOpen },
  ];

  const analyticsCards = analytics ? [
    { label: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'bg-blue-100 text-blue-700' },
    { label: 'Total Notes', value: analytics.totalNotes, icon: FileText, color: 'bg-brown-100 text-brown-700' },
    { label: 'Downloads', value: analytics.totalDownloads, icon: Download, color: 'bg-green-100 text-green-700' },
    { label: 'Pending', value: analytics.pendingApprovals, icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Teachers', value: analytics.totalTeachers, icon: Shield, color: 'bg-purple-100 text-purple-700' },
  ] : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fefdf8' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brown-700 rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brown-900">Admin Dashboard</h1>
            <p className="text-sm text-brown-500 capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === key ? 'bg-brown-700 text-white' : 'bg-white text-brown-600 border border-brown-100 hover:bg-beige-50'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {analyticsCards.map((card) => (
                <div key={card.label} className="bg-white rounded-2xl p-5 border border-brown-100">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                    <card.icon size={18} />
                  </div>
                  <p className="text-2xl font-bold text-brown-900">{card.value.toLocaleString()}</p>
                  <p className="text-xs text-brown-500 mt-0.5">{card.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Approvals */}
        {activeTab === 'approvals' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {pendingNotes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-brown-100">
                <CheckCircle size={40} className="mx-auto mb-4 text-green-500 opacity-60" />
                <p className="font-medium text-brown-700">All caught up!</p>
                <p className="text-sm text-brown-500 mt-1">No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingNotes.map((note) => (
                  <div key={note.id} className="bg-white rounded-2xl p-5 border border-brown-100">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-brown-900 mb-1">{note.title}</h3>
                        <p className="text-sm text-brown-500 mb-1">{note.description}</p>
                        <div className="flex items-center gap-2 text-xs text-brown-400">
                          <span>By: {note.uploaderName}</span>
                          <span>·</span>
                          <span>{note.category}</span>
                          <span>·</span>
                          <span>{note.topic}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="sm" variant="secondary" onClick={() => window.open(note.fileUrl, '_blank')}>
                          <Eye size={13} /> Preview
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleReject(note.id)}>
                          <XCircle size={13} />
                        </Button>
                        <Button size="sm" onClick={() => handleApprove(note.id)}>
                          <CheckCircle size={13} /> Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.uid} className="bg-white rounded-2xl p-4 border border-brown-100 flex items-center gap-4">
                  <Avatar src={u.photoURL} name={u.displayName} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brown-900 truncate">{u.displayName}</p>
                    <p className="text-xs text-brown-500 truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.uid, e.target.value as UserRole)}
                      className="text-xs px-2 py-1.5 rounded-lg border border-brown-200 bg-white text-brown-700 focus:outline-none"
                      disabled={u.uid === user.uid}
                    >
                      {['student', 'teacher', 'admin', 'super_admin'].map((r) => (
                        <option key={r} value={r}>{r.replace('_', ' ')}</option>
                      ))}
                    </select>
                    {u.uid !== user.uid && (
                      <Button
                        size="sm"
                        variant={u.blocked ? 'secondary' : 'danger'}
                        onClick={() => handleToggleBlock(u)}
                      >
                        {u.blocked ? 'Unblock' : 'Block'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Branches */}
        {activeTab === 'branches' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowBranchModal(true)}><Plus size={16} /> Add Branch</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.map((branch) => (
                <div key={branch.id} className="bg-white rounded-2xl p-5 border border-brown-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-brown-900">{branch.name}</h3>
                      <p className="text-xs font-mono text-brown-500 mt-0.5">{branch.code}</p>
                    </div>
                    <Badge>{branch.noteCount} notes</Badge>
                  </div>
                  {branch.description && (
                    <p className="text-xs text-brown-500 mt-2">{branch.description}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Modal isOpen={showBranchModal} onClose={() => setShowBranchModal(false)} title="Create Branch">
        <div className="space-y-4">
          <Input label="Name *" placeholder="e.g., Computer Science" value={newBranch.name} onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })} />
          <Input label="Code *" placeholder="e.g., CSE" value={newBranch.code} onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value.toUpperCase() })} />
          <Input label="Description" placeholder="Brief description..." value={newBranch.description} onChange={(e) => setNewBranch({ ...newBranch, description: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowBranchModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleCreateBranch}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
