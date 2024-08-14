import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// If you're using a custom font, you can set it up like this:
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sign In | World Poll',
  description: 'Sign in or create an account for World Poll',
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="signin-layout">
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