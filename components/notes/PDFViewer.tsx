'use client'
import { useState } from 'react'
import { ZoomIn, ZoomOut, Download } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

interface PDFViewerProps {
  fileUrl: string
  noteId: string
  noteTitle: string
  onDownload?: () => void
}

export function PDFViewer({ fileUrl, noteId, noteTitle, onDownload }: PDFViewerProps) {
  const { user } = useAuth()
  const [zoom, setZoom] = useState(100)

  const watermarkText = user ? `EduHub • ${user.email}` : 'EduHub Platform'

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden">
      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <span className="text-sm text-gray-300 truncate">{noteTitle}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(z => Math.max(50, z - 25))}
            className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs text-gray-400 w-12 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(z => Math.min(200, z + 25))}
            className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <ZoomIn size={16} />
          </button>
          {user && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onDownload}
              icon={<Download size={14} />}
            >
              Download
            </Button>
          )}
        </div>
      </div>

      {/* PDF Iframe with watermark overlay */}
      <div className="relative min-h-[600px] bg-gray-100">
        <iframe
          src={`${fileUrl}#toolbar=0&navpanes=0`}
          className="w-full h-[600px]"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
          title={noteTitle}
        />
        {/* Watermark */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            background: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 100px,
              rgba(0,0,0,0.03) 100px,
              rgba(0,0,0,0.03) 200px
            )`,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-gray-400 text-xs opacity-20 font-medium whitespace-nowrap"
              style={{
                top: `${15 + i * 18}%`,
                left: '50%',
                transform: 'translateX(-50%) rotate(-30deg)',
              }}
            >
              {watermarkText}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
