'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, FileText } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getAllBranches, getSubjectsByBranch } from '@/services/modules/branchesService'
import { uploadNote } from '@/services/modules/uploadsService'
import { Branch, Subject } from '@/types/branch'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function AdminUploadPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [branches, setBranches] = useState<Branch[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [form, setForm] = useState({
    branchId: '', branchName: '', subjectId: '', subjectName: '',
    topic: '', category: 'notes' as 'notes' | 'pyq' | 'entrance',
    title: '', description: '',
    tags: [] as string[], file: null as File | null,
  })

  useEffect(() => { getAllBranches().then(setBranches) }, [])
  useEffect(() => {
    if (form.branchId) getSubjectsByBranch(form.branchId).then(setSubjects)
  }, [form.branchId])

  const handleSubmit = async () => {
    if (!user || !form.file) return
    setLoading(true)
    try {
      await uploadNote({ ...form, file: form.file }, user, setProgress)
      toast.success('Note published!')
      router.push('/admin/dashboard')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Upload failed'
      toast.error(message)
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Admin Upload</h1>
        <p className="text-gray-500 text-sm mt-1">Uploads are auto-approved</p>
      </motion.div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        {step === 0 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
              <select
                value={form.branchId}
                onChange={e => {
                  const b = branches.find(b => b.id === e.target.value)
                  setForm(f => ({ ...f, branchId: e.target.value, branchName: b?.name || '', subjectId: '', subjectName: '' }))
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
                    const s = subjects.find(s => s.id === e.target.value)
                    setForm(f => ({ ...f, subjectId: e.target.value, subjectName: s?.name || '' }))
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
                {[{ value: 'notes', label: 'Notes' }, { value: 'pyq', label: 'PYQ' }, { value: 'entrance', label: 'Entrance' }].map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, category: cat.value as 'notes' | 'pyq' | 'entrance' }))}
                    className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-colors ${form.category === cat.value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
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
            <Input label="Title" placeholder="Enter note title..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
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
            <Input label="Topic" placeholder="e.g., Data Structures" value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} />
          </>
        )}
        {step === 2 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">PDF File</label>
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${form.file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-primary-400'}`}>
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
                  <label className="cursor-pointer px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                    Browse PDF
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
                  <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>
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
        >
          {step < 2 ? 'Next' : 'Upload & Publish'}
        </Button>
      </div>
    </div>
  )
}
