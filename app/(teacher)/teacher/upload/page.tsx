'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, FileText, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getAllBranches, getSubjectsByBranch } from '@/services/modules/branchesService'
import { uploadNote } from '@/services/modules/uploadsService'
import { Branch, Subject } from '@/types/branch'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import toast from 'react-hot-toast'

const STEPS = ['Branch & Subject', 'Details', 'Upload File']

export default function UploadPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [branches, setBranches] = useState<Branch[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const [form, setForm] = useState({
    branchId: '',
    branchName: '',
    subjectId: '',
    subjectName: '',
    topic: '',
    category: 'notes' as 'notes' | 'pyq' | 'entrance',
    title: '',
    description: '',
    tags: [] as string[],
    file: null as File | null,
    tagInput: '',
  })

  useEffect(() => {
    getAllBranches().then(setBranches)
  }, [])

  useEffect(() => {
    if (form.branchId) {
      getSubjectsByBranch(form.branchId).then(setSubjects)
    }
  }, [form.branchId])

  const handleSubmit = async () => {
    if (!user || !form.file) return
    setLoading(true)
    try {
      await uploadNote(
        {
          title: form.title,
          description: form.description,
          branchId: form.branchId,
          branchName: form.branchName,
          subjectId: form.subjectId,
          subjectName: form.subjectName,
          topic: form.topic,
          category: form.category,
          tags: form.tags,
          file: form.file,
        },
        user,
        setProgress
      )
      toast.success(user.role === 'teacher' ? 'Submitted for review!' : 'Published!')
      router.push(user.role === 'teacher' ? '/teacher/dashboard' : '/admin/dashboard')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Upload failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Notes</h1>
        <p className="text-gray-500 text-sm mt-1">Share your knowledge with students</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
              i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {i < step ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-primary-600' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5"
      >
        {step === 0 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
              <select
                value={form.branchId}
                onChange={e => {
                  const branch = branches.find(b => b.id === e.target.value)
                  setForm(f => ({ ...f, branchId: e.target.value, branchName: branch?.name || '', subjectId: '', subjectName: '' }))
                }}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select branch...</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            {form.branchId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={form.subjectId}
                  onChange={e => {
                    const subject = subjects.find(s => s.id === e.target.value)
                    setForm(f => ({ ...f, subjectId: e.target.value, subjectName: subject?.name || '' }))
                  }}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select subject...</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'notes', label: 'Notes' },
                  { value: 'pyq', label: 'Previous Year Q' },
                  { value: 'entrance', label: 'Entrance' },
                ].map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, category: cat.value as 'notes' | 'pyq' | 'entrance' }))}
                    className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                      form.category === cat.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <Input
              label="Title"
              placeholder="Enter note title..."
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="What is this note about?"
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
            <Input
              label="Topic"
              placeholder="e.g., Data Structures, Thermodynamics"
              value={form.topic}
              onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input
                value={form.tagInput}
                onChange={e => setForm(f => ({ ...f, tagInput: e.target.value }))}
                onKeyDown={e => {
                  if (e.key === 'Enter' && form.tagInput.trim()) {
                    setForm(f => ({ ...f, tags: [...f.tags, f.tagInput.trim()], tagInput: '' }))
                  }
                }}
                placeholder="Press Enter to add tag"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {tag}
                    <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))} className="text-gray-400 hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">PDF File</label>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                form.file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-primary-400'
              }`}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault()
                const file = e.dataTransfer.files[0]
                if (file?.type === 'application/pdf') setForm(f => ({ ...f, file }))
              }}
            >
              {form.file ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText size={32} className="text-green-500" />
                  <p className="font-medium text-gray-900">{form.file.name}</p>
                  <p className="text-sm text-gray-500">{(form.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button onClick={() => setForm(f => ({ ...f, file: null }))} className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload size={32} className="text-gray-400" />
                  <p className="font-medium text-gray-700">Drag & drop PDF here</p>
                  <p className="text-sm text-gray-400">or</p>
                  <label className="cursor-pointer px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                    Browse File
                    <input type="file" accept=".pdf" className="hidden" onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) setForm(f => ({ ...f, file }))
                    }} />
                  </label>
                </div>
              )}
            </div>

            {loading && progress > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Uploading...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(s => s - 1)} icon={<ArrowLeft size={16} />}>
            Back
          </Button>
        )}
        <Button
          className="flex-1"
          onClick={step < 2 ? () => setStep(s => s + 1) : handleSubmit}
          loading={loading}
          disabled={
            (step === 0 && (!form.branchId || !form.subjectId)) ||
            (step === 1 && (!form.title || !form.description || !form.topic)) ||
            (step === 2 && !form.file)
          }
          icon={step < 2 ? <ArrowRight size={16} /> : <Upload size={16} />}
        >
          {step < 2 ? 'Next' : 'Upload'}
        </Button>
      </div>
    </div>
  )
}
