'use client'
import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glass?: boolean
}

export function Card({ className, children, hover = false, glass = false, ...props }: CardProps) {
  const base = 'rounded-xl border border-gray-100 bg-white shadow-sm'
  const glassClass = 'backdrop-blur-xs bg-white/80 border-white/20'

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
        className={cn(base, glass && glassClass, className)}
        {...(props as any)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={cn(base, glass && glassClass, className)} {...props}>
      {children}
    </div>
  )
}
