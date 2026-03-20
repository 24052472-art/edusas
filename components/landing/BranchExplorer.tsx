'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { subscribeToBranches } from '@/services/modules/branchesService'
import { Branch } from '@/types/branch'
import { Skeleton } from '@/components/ui/Skeleton'

const BRANCH_COLORS = [
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-green-400 to-green-600',
  'from-orange-400 to-orange-600',
  'from-pink-400 to-pink-600',
  'from-teal-400 to-teal-600',
  'from-indigo-400 to-indigo-600',
  'from-red-400 to-red-600',
]

export function BranchExplorer() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToBranches(data => {
      setBranches(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Explore Branches</h2>
            <p className="text-gray-500 text-sm mt-1">Find notes by your academic branch</p>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-48 flex-shrink-0 rounded-xl" />
            ))}
          </div>
        ) : branches.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No branches available yet.</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {branches.map((branch, index) => (
              <motion.div
                key={branch.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0"
              >
                <Link href={`/?branch=${branch.id}`}>
                  <div className={`w-48 h-32 rounded-xl bg-gradient-to-br ${BRANCH_COLORS[index % BRANCH_COLORS.length]} p-4 flex flex-col justify-between text-white shadow-md cursor-pointer`}>
                    <div className="text-3xl">{branch.icon || '📚'}</div>
                    <div>
                      <p className="font-semibold text-sm">{branch.name}</p>
                      <p className="text-xs opacity-80">{branch.noteCount || 0} notes</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
