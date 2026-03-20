'use client'
import { useState, useEffect } from 'react'
import { UserPlus, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { followTeacher, unfollowTeacher } from '@/services/modules/teachersService'
import toast from 'react-hot-toast'

interface FollowButtonProps {
  teacherId: string
  className?: string
}

export function FollowButton({ teacherId, className }: FollowButtonProps) {
  const { user } = useAuth()
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFollowing(user.followingTeachers?.includes(teacherId) || false)
    }
  }, [user, teacherId])

  const handleToggle = async () => {
    if (!user) {
      toast.error('Please sign in to follow teachers')
      return
    }
    setLoading(true)
    try {
      if (following) {
        await unfollowTeacher(user.uid, teacherId)
        setFollowing(false)
        toast.success('Unfollowed')
      } else {
        await followTeacher(user.uid, teacherId)
        setFollowing(true)
        toast.success('Following!')
      }
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={following ? 'ghost' : 'outline'}
      size="sm"
      loading={loading}
      onClick={handleToggle}
      icon={following ? <UserCheck size={14} /> : <UserPlus size={14} />}
      className={className}
    >
      {following ? 'Following' : 'Follow'}
    </Button>
  )
}
