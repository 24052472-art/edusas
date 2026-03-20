export type UserRole = 'student' | 'teacher' | 'admin' | 'super_admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  verified: boolean;
  createdAt: Date;
  following: string[];
  savedNotes: string[];
  downloadHistory: string[];
  branchId?: string;
  bio?: string;
  blocked: boolean;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  description?: string;
  subjectCount: number;
  noteCount: number;
  createdAt: Date;
}

export interface Subject {
  id: string;
  branchId: string;
  name: string;
  code: string;
  description?: string;
  noteCount: number;
  createdAt: Date;
}

export type NoteCategory = 'Notes' | 'PYQ' | 'Entrance';
export type NoteStatus = 'draft' | 'pending' | 'approved';

export interface Note {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  thumbnailUrl?: string;
  branchId: string;
  subjectId: string;
  topic: string;
  category: NoteCategory;
  uploadedBy: string;
  uploaderName: string;
  uploaderRole: UserRole;
  status: NoteStatus;
  downloads: number;
  rating: number;
  ratingCount: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Teacher {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio: string;
  branchId: string;
  branchName: string;
  subjects: string[];
  verified: boolean;
  followers: number;
  uploads: number;
  totalDownloads: number;
  createdAt: Date;
}

export type NotificationType = 'follow' | 'upload' | 'approval' | 'announcement' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: {
    noteId?: string;
    teacherId?: string;
    branchId?: string;
  };
}

export interface Post {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherPhoto?: string;
  content: string;
  type: 'announcement' | 'post';
  branchId?: string;
  createdAt: Date;
  likes: number;
}

export interface AnalyticsData {
  totalUsers: number;
  totalNotes: number;
  totalDownloads: number;
  pendingApprovals: number;
  totalTeachers: number;
  activeUsers: number;
}
