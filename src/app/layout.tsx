import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Circle — Open Circle Markets',
  description: "A curated collective of Auckland's finest vendors for private and corporate events.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: '#1b1f3b' }}>
        {children}
      </body>
    </html>
  )
}
