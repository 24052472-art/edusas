export const APP_NAME = 'EduHub';
export const APP_TAGLINE = 'Academic Knowledge Platform';

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export const NOTE_CATEGORIES = ['Notes', 'PYQ', 'Entrance'] as const;

export const NOTE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
} as const;

export const COLLECTIONS = {
  USERS: 'users',
  NOTES: 'notes',
  BRANCHES: 'branches',
  SUBJECTS: 'subjects',
  NOTIFICATIONS: 'notifications',
  POSTS: 'posts',
} as const;

export const PAGINATION_LIMIT = 12;
