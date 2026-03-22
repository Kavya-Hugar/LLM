import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Learning Platform',
  description: 'AI-powered learning management system with structured video courses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-white">
          {children}
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'glass-card',
            duration: 4000,
          }}
        />
      </body>
    </html>
  )
}
