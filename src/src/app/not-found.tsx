import Link from 'next/link'
import NavBar from '@/components/NavBar'

export default function NotFound() {
  return (
    <>
      <NavBar />
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center"
        style={{ background: '#1b1f3b' }}
      >
        {/* Decorative ring */}
        <div className="relative mb-8">
          <div
            className="w-32 h-32 rounded-full border-4 flex items-center justify-center"
            style={{ borderColor: '#f9d378', opacity: 0.15 }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center text-[56px] font-black"
            style={{ color: '#f9d378' }}
          >
            404
          </div>
        </div>

        <h1 className="text-[28px] sm:text-[36px] font-black text-white mb-3">
          This page isn&apos;t in the circle.
        </h1>
        <p className="text-[15px] max-w-[400px] mb-10" style={{ color: '#baa182' }}>
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Head back and explore our curated vendor directory.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/circle"
            className="px-7 py-3 rounded-full text-[14px] font-bold transition-all hover:opacity-90"
            style={{ background: '#f9d378', color: '#1b1f3b' }}
          >
            Browse Vendors
          </Link>
          <Link
            href="/"
            className="px-7 py-3 rounded-full text-[14px] font-semibold border transition-all hover:text-white"
            style={{ border: '1.5px solid #3c4f80', color: '#baa182' }}
          >
            Go Home
          </Link>
        </div>
      </div>

      <footer className="py-7 px-10 text-center text-[12px] border-t"
        style={{ background: '#303e66', borderColor: '#3c4f80', color: '#baa182' }}>
        <strong className="text-gold">Open Circle Markets</strong> &nbsp;·&nbsp; Auckland
      </footer>
    </>
  )
}
