export const dynamic = 'force-dynamic'

import NavBar from '@/components/NavBar'
import VendorCard from '@/components/VendorCard'
import { supabase } from '@/lib/supabase'
import { Vendor } from '@/lib/types'

const FILTERS = [
  { label: 'All Vendors', value: '' },
  { label: '🍕 Food', value: 'food' },
  { label: '🍹 Drinks', value: 'drinks' },
  { label: '🎯 Experience', value: 'experience' },
  { label: '🎭 Entertainment', value: 'entertainment' },
]

export default async function CirclePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; available?: string }>
}) {
  const params = await searchParams
  let query = supabase
    .from('vendors')
    .select('*')
    .eq('is_active', true)
    .order('is_beta', { ascending: false })
    .order('name')

  if (params.category) query = query.eq('category', params.category)
  if (params.available === '1') query = query.eq('is_available', true)

  const { data: vendors } = await query
  const allVendors = (vendors as Vendor[]) ?? []

  return (
    <>
      <NavBar />

      {/* Hero */}
      <div
        className="text-center py-12 sm:py-16 px-5 sm:px-10 border-b"
        style={{ background: 'linear-gradient(135deg,#303e66,#1b1f3b)', borderColor: '#3c4f80' }}
      >
        <h1 className="text-[34px] sm:text-[42px] font-black text-gold">Our Circle</h1>
        <p className="mt-3 text-[14px] sm:text-[15px] font-light max-w-lg mx-auto leading-relaxed" style={{ color: '#c5b098' }}>
          A handpicked collective of Auckland&apos;s finest vendors — food, drink, and experiences —
          available for your next private or corporate event.
        </p>
        <div className="w-14 h-[3px] rounded-full mx-auto mt-5" style={{ background: '#f9d378' }} />
      </div>

      {/* Filters — horizontal scroll on mobile */}
      <div
        className="flex gap-2 items-center overflow-x-auto px-4 sm:px-10 py-3.5 border-b"
        style={{ background: '#303e66', borderColor: '#3c4f80', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest mr-1 flex-shrink-0" style={{ color: '#baa182' }}>
          Filter
        </span>
        {FILTERS.map(f => (
          <a
            key={f.value}
            href={f.value ? `/circle?category=${f.value}` : '/circle'}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all border"
            style={{
              borderColor: params.category === f.value || (!params.category && !f.value) ? '#f9d378' : '#3c4f80',
              background: params.category === f.value || (!params.category && !f.value) ? '#f9d378' : 'transparent',
              color: params.category === f.value || (!params.category && !f.value) ? '#1b1f3b' : '#c5b098',
            }}
          >
            {f.label}
          </a>
        ))}
        <a
          href="/circle?available=1"
          className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all border ml-1"
          style={{
            borderColor: params.available ? '#f9d378' : '#3c4f80',
            background: params.available ? '#f9d378' : 'transparent',
            color: params.available ? '#1b1f3b' : '#c5b098',
          }}
        >
          ✅ Available Now
        </a>
      </div>

      {/* Grid */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-10 py-8 sm:py-10">
        <p className="text-[12px] mb-5 font-medium" style={{ color: '#baa182' }}>
          Showing <strong className="text-gold">{allVendors.length} vendor{allVendors.length !== 1 ? 's' : ''}</strong> in the Circle
        </p>

        {allVendors.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⭕</div>
            <p className="text-gold font-semibold text-lg">No vendors found</p>
            <p className="text-tan-2 text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {allVendors.map(vendor => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        className="mt-16 sm:mt-20 py-7 px-6 sm:px-10 text-center text-[12px] border-t"
        style={{ background: '#303e66', borderColor: '#3c4f80', color: '#baa182' }}
      >
        <strong className="text-gold">Open Circle Markets</strong> &nbsp;·&nbsp; The Circle
      </footer>
    </>
  )
}
