export interface Branch {
  id: string
  name: string
  code: string
  description: string
  icon: string
  color: string
  subjects: Subject[]
  noteCount: number
  teacherCount: number
  createdAt: string
}

export interface Subject {
  id: string
  branchId: string
  name: string
  code: string
  description: string
  noteCount: number
  createdAt: string
}
