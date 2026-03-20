'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Search, Users, TrendingUp, ChevronRight, Star, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';

const BRANCHES = [
  { name: 'Computer Science', code: 'CSE', icon: '💻', notes: 120 },
  { name: 'Electronics', code: 'ECE', icon: '⚡', notes: 89 },
  { name: 'Mechanical', code: 'ME', icon: '⚙️', notes: 76 },
  { name: 'Civil Engineering', code: 'CE', icon: '🏗️', notes: 54 },
  { name: 'Information Tech', code: 'IT', icon: '🌐', notes: 98 },
  { name: 'Mathematics', code: 'MATH', icon: '📐', notes: 67 },
  { name: 'Physics', code: 'PHY', icon: '🔬', notes: 45 },
  { name: 'Chemistry', code: 'CHEM', icon: '🧪', notes: 38 },
];

const SAMPLE_NOTES = [
  { id: '1', title: 'Data Structures & Algorithms', topic: 'Linked Lists, Trees, Graphs', category: 'Notes', downloads: 1240, views: 3500, rating: 4.8 },
  { id: '2', title: 'GATE 2023 Previous Year Paper', topic: 'Computer Science', category: 'PYQ', downloads: 890, views: 2100, rating: 4.9 },
  { id: '3', title: 'JEE Advanced Mathematics', topic: 'Calculus & Integration', category: 'Entrance', downloads: 670, views: 1800, rating: 4.7 },
  { id: '4', title: 'Operating Systems Notes', topic: 'Process Management, Memory', category: 'Notes', downloads: 540, views: 1400, rating: 4.6 },
  { id: '5', title: 'Digital Electronics PYQ', topic: 'Logic Gates, Flip Flops', category: 'PYQ', downloads: 430, views: 980, rating: 4.5 },
  { id: '6', title: 'Thermodynamics Complete Guide', topic: 'Laws of Thermodynamics', category: 'Notes', downloads: 380, views: 860, rating: 4.4 },
];

const STATS = [
  { label: 'Study Materials', value: '10,000+', icon: BookOpen },
  { label: 'Students', value: '50,000+', icon: Users },
  { label: 'Downloads', value: '2M+', icon: Download },
  { label: 'Top Rated', value: '4.8★', icon: Star },
];

const categoryColors: Record<string, string> = {
  Notes: 'bg-brown-100 text-brown-700',
  PYQ: 'bg-blue-100 text-blue-700',
  Entrance: 'bg-yellow-100 text-yellow-700',
};

export function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fefdf8' }}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brown-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-beige-200 rounded-full blur-3xl opacity-50" />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-brown-100 text-brown-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <TrendingUp size={14} />
              {APP_TAGLINE}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-brown-900 mb-6 leading-tight">
              Your Gateway to
              <span className="text-brown-600"> Academic Excellence</span>
            </h1>
            <p className="text-lg text-brown-600 mb-10 max-w-2xl mx-auto">
              Access thousands of curated notes, previous year papers, and entrance exam materials.
              Learn from expert teachers and ace your exams.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            {user ? (
              <Link href={
                user.role === 'teacher' ? '/dashboard/teacher' :
                user.role === 'admin' || user.role === 'super_admin' ? '/dashboard/admin' :
                '/dashboard/student'
              }>
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard <ChevronRight size={18} />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free <ChevronRight size={18} />
                  </Button>
                </Link>
                <Link href="/notes">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Browse Notes
                  </Button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-xl mx-auto"
          >
            <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 shadow-md border border-brown-100">
              <Search size={18} className="text-brown-400" />
              <input
                type="text"
                placeholder="Search notes, subjects, topics..."
                className="flex-1 bg-transparent text-sm text-brown-800 placeholder-brown-400 outline-none"
              />
              <Button size="sm">Search</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-white border-y border-brown-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-10 h-10 bg-brown-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <stat.icon size={20} className="text-brown-700" />
              </div>
              <p className="text-2xl font-bold text-brown-900">{stat.value}</p>
              <p className="text-sm text-brown-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Branch Explorer */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-brown-900">Explore by Branch</h2>
              <p className="text-brown-500 text-sm mt-1">Find materials for your field of study</p>
            </div>
            <Link href="/notes" className="text-sm text-brown-600 hover:text-brown-900 flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {BRANCHES.map((branch, i) => (
              <motion.div
                key={branch.code}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="flex-shrink-0 bg-white rounded-2xl p-5 border border-brown-100 hover:shadow-md transition-all cursor-pointer hover:border-brown-300 min-w-[160px]"
              >
                <div className="text-3xl mb-3">{branch.icon}</div>
                <h3 className="font-semibold text-brown-900 text-sm mb-1">{branch.name}</h3>
                <p className="text-xs text-brown-500">{branch.notes} notes</p>
                <p className="text-xs font-mono text-brown-400 mt-1">{branch.code}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Notes */}
      <section className="py-16 px-4 bg-beige-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-brown-900">Trending Notes</h2>
              <p className="text-brown-500 text-sm mt-1">Most downloaded this week</p>
            </div>
            <Link href="/notes" className="text-sm text-brown-600 hover:text-brown-900 flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SAMPLE_NOTES.map((note, i) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-5 border border-brown-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${categoryColors[note.category]}`}>
                    {note.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-brown-500">
                    <Star size={11} className="fill-yellow-400 text-yellow-400" />
                    {note.rating}
                  </div>
                </div>
                <h3 className="font-semibold text-brown-900 mb-1.5 group-hover:text-brown-700 transition-colors">
                  {note.title}
                </h3>
                <p className="text-xs text-brown-500 mb-4">{note.topic}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-brown-400">
                    <span className="flex items-center gap-1"><Eye size={12} />{note.views.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Download size={12} />{note.downloads.toLocaleString()}</span>
                  </div>
                  <Link href={user ? `/notes/${note.id}` : '/login'}>
                    <Button size="sm" variant="secondary">View</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-brown-700 rounded-3xl p-12 text-white"
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={24} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Ready to Excel?</h2>
            <p className="text-brown-200 mb-8 text-lg">
              Join thousands of students already using EduHub to achieve academic success.
            </p>
            {!user && (
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-white text-brown-800 hover:bg-beige-100 font-semibold"
                >
                  Start Learning for Free <ChevronRight size={18} />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-brown-100 text-center">
        <p className="text-sm text-brown-500">
          © 2024 {APP_NAME}. Built for students, by educators.
        </p>
      </footer>
    </div>
  );
}
