import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'The Circle — Open Circle Markets',
  description: "A curated collective of Auckland's finest vendors for private and corporate events.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://thecircle.opencirclemarkets.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col" style={{ background: '#1b1f3b' }}>
        <NavBar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
