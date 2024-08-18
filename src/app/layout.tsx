'use client';

import { Inter } from 'next/font/google'
import './globals.css'
import { Web3ReactProvider } from '@web3-react/core'
import { MetaMask } from "@web3-react/metamask"
import { hooks as metaMaskHooks, metaMask } from '../hooks/metaMask'

const inter = Inter({ subsets: ['latin'] })

const connectors: [MetaMask, typeof metaMaskHooks][] = [
  [metaMask, metaMaskHooks],
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3ReactProvider connectors={connectors}>
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
        </Web3ReactProvider>
      </body>
    </html>
  )
}