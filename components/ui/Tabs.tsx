'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (id: string) => void
  className?: string
  children?: (activeTab: string) => React.ReactNode
}

export function Tabs({ tabs, defaultTab, onChange, className, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleChange = (id: string) => {
    setActiveTab(id)
    onChange?.(id)
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                transition={{ type: 'spring', duration: 0.3 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        ))}
      </div>
      {children && <div className="mt-4">{children(activeTab)}</div>}
    </div>
  )
}
