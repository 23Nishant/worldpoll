import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Poll Page | World Poll',
  description: 'Create and participate in polls on World Poll',
}

export default function PollPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="poll-page-layout">
          <header>
            {/* You can add a header here if needed */}
          </header>

          <main>
            {children}
          </main>

          <footer>
            {/* You can add a footer here if needed */}
          </footer>
        </div>
      </body>
    </html>
  )
}