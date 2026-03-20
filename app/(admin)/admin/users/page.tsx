'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle, Ban } from 'lucide-react'
import { getAllUsers, blockUser, verifyUser } from '@/services/modules/usersService'
import { User } from '@/types/user'
import { Table } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { formatDate, getInitials } from '@/lib/utils'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchUsers = () => {
    getAllUsers().then(data => {
      setUsers(data)
      setLoading(false)
    })
  }

  useEffect(() => { fetchUsers() }, [])

  const filtered = users.filter(u =>
    u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleBlock = async (uid: string, blocked: boolean) => {
    await blockUser(uid, !blocked)
    toast.success(blocked ? 'User unblocked' : 'User blocked')
    fetchUsers()
  }

  const handleVerify = async (uid: string, verified: boolean) => {
    await verifyUser(uid, !verified)
    toast.success(verified ? 'Verification removed' : 'User verified')
    fetchUsers()
  }

  const columns = [
    {
      key: 'displayName',
      header: 'User',
      render: (_: unknown, row: User) => (
        <div className="flex items-center gap-3">
          {row.photoURL ? (
            <Image src={row.photoURL} alt={row.displayName} width={32} height={32} className="rounded-full" />
          ) : (
            <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-semibold">
              {getInitials(row.displayName)}
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 text-sm">{row.displayName}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (_: unknown, row: User) => (
        <Badge variant={row.role === 'admin' ? 'danger' : row.role === 'teacher' ? 'secondary' : 'default'}>
          {row.role}
        </Badge>
      ),
    },
    {
      key: 'verified',
      header: 'Status',
      render: (_: unknown, row: User) => (
        <div className="flex gap-1">
          {row.verified && <Badge variant="info">Verified</Badge>}
          {row.blocked && <Badge variant="danger">Blocked</Badge>}
          {!row.verified && !row.blocked && <Badge variant="success">Active</Badge>}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (_: unknown, row: User) => <span className="text-xs text-gray-500">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, row: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVerify(row.uid, row.verified)}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
            title={row.verified ? 'Remove verification' : 'Verify'}
          >
            <CheckCircle size={15} />
          </button>
          <button
            onClick={() => handleBlock(row.uid, row.blocked)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
            title={row.blocked ? 'Unblock' : 'Block'}
          >
            <Ban size={15} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">Manage platform users</p>
      </motion.div>

      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
        <Badge variant="default">{filtered.length} users</Badge>
      </div>

      <Table<Record<string, unknown>>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        columns={columns as any}
        data={filtered as unknown as Record<string, unknown>[]}
        loading={loading}
        emptyMessage="No users found"
      />
    </div>
  )
}
