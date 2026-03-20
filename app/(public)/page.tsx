import { SearchHero } from '@/components/landing/SearchHero'
import { BranchExplorer } from '@/components/landing/BranchExplorer'
import { NotesPreview } from '@/components/landing/NotesPreview'
import { TeacherDirectory } from '@/components/landing/TeacherDirectory'

export default function LandingPage() {
  return (
    <div>
      <SearchHero />
      <BranchExplorer />
      <NotesPreview />
      <TeacherDirectory />
    </div>
  )
}
