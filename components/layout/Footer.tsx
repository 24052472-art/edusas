import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-beige-50 border-t border-beige-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">EduHub</span>
            </div>
            <p className="text-sm text-gray-500">
              Academic knowledge platform connecting students with quality educational content.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-primary-600 transition-colors">Browse Notes</Link></li>
              <li><Link href="/" className="hover:text-primary-600 transition-colors">Find Teachers</Link></li>
              <li><Link href="/" className="hover:text-primary-600 transition-colors">Subjects</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/login" className="hover:text-primary-600 transition-colors">Sign In</Link></li>
              <li><Link href="/login" className="hover:text-primary-600 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><span className="cursor-pointer hover:text-primary-600 transition-colors">Help Center</span></li>
              <li><span className="cursor-pointer hover:text-primary-600 transition-colors">Privacy Policy</span></li>
              <li><span className="cursor-pointer hover:text-primary-600 transition-colors">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-beige-200 text-center text-sm text-gray-400">
          © 2024 EduHub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
