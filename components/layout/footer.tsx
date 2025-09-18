import Link from 'next/link'
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">B-School Portal</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Your comprehensive guide to India's top business schools. Find, compare, and get 
              admitted to the best MBA programs in the country.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@bschoolportal.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 9999999999</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/bschools" className="hover:text-blue-600 transition-colors">
                  All B-Schools
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-blue-600 transition-colors">
                  Compare Schools
                </Link>
              </li>
              <li>
                <Link href="/deadlines" className="hover:text-blue-600 transition-colors">
                  Application Deadlines
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/bschools?type=government" className="hover:text-blue-600 transition-colors">
                  Government Schools
                </Link>
              </li>
              <li>
                <Link href="/bschools?type=private" className="hover:text-blue-600 transition-colors">
                  Private Schools
                </Link>
              </li>
              <li>
                <Link href="/bschools?exam=CAT" className="hover:text-blue-600 transition-colors">
                  CAT Accepting
                </Link>
              </li>
              <li>
                <Link href="/bschools?exam=XAT" className="hover:text-blue-600 transition-colors">
                  XAT Accepting
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 B-School Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}