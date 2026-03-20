'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getTeachers } from '@/services/modules/users/usersService';
import { followTeacher, unfollowTeacher } from '@/services/modules/users/usersService';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';
import { Users, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeachersPage() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeachers().then(setTeachers).finally(() => setLoading(false));
  }, []);

  const handleFollow = async (teacherId: string) => {
    if (!user) { toast.error('Please sign in to follow teachers'); return; }
    const isFollowing = user.following?.includes(teacherId);
    try {
      if (isFollowing) {
        await unfollowTeacher(user.uid, teacherId);
        toast.success('Unfollowed');
      } else {
        await followTeacher(user.uid, teacherId);
        toast.success('Following!');
      }
    } catch {
      toast.error('Action failed.');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fefdf8' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-brown-900">Meet Our Teachers</h1>
          <p className="text-sm text-brown-500 mt-1">Follow teachers to get notified of new content</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-brown-100 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brown-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-brown-100 rounded w-3/4" />
                    <div className="h-3 bg-brown-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="mx-auto mb-4 text-brown-400 opacity-40" />
            <p className="font-semibold text-brown-700">No teachers yet</p>
            <p className="text-sm text-brown-500 mt-2">Teachers will appear here once they join</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teachers.map((teacher, i) => (
              <motion.div
                key={teacher.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-brown-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3 mb-4">
                  <Avatar src={teacher.photoURL} name={teacher.displayName} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-brown-900 truncate">{teacher.displayName}</h3>
                      {teacher.verified && <CheckCircle size={14} className="text-green-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-brown-500 truncate">{teacher.email}</p>
                    {teacher.bio && <p className="text-xs text-brown-600 mt-1 line-clamp-2">{teacher.bio}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge>Teacher</Badge>
                  {user && user.uid !== teacher.uid && (
                    <Button
                      size="sm"
                      variant={user.following?.includes(teacher.uid) ? 'secondary' : 'primary'}
                      onClick={() => handleFollow(teacher.uid)}
                    >
                      {user.following?.includes(teacher.uid) ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
