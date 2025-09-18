import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'B-School Portal - Your Guide to Top MBA Programs in India',
  description: 'Find, compare, and get admitted to the best business schools in India. Comprehensive information about MBA programs, cutoffs, and application deadlines.',
  keywords: 'MBA, business school, IIM, XLRI, FMS, CAT, XAT, GMAT, application deadlines, cutoffs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}