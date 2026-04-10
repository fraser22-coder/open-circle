import Link from 'next/link'
import Image from 'next/image'
import { Vendor } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  food: '🍕 Food', drinks: '🍹 Drinks',
  experience: '🎯 Experience', entertainment: '🎭 Entertainment',
}

export default function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link href={`/circle/${vendor.slug}`} className="block group">
      <div
        className="rounded-2xl overflow-hidden border transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-2xl"
        style={{ background: '#303e66', borderColor: '#3c4f80' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#f9d378')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#3c4f80')}
      >
        {/* Image */}
        <div className="relative h-[210px] w-full overflow-hidden" style={{ background: '#1b1f3b' }}>
          {vendor.photos?.[0] ? (
            <Image src={vendor.photos[0]} alt={vendor.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col gap-2"
              style={{ background: 'linear-gradient(135deg,#1a0a05,#3d1a08,#c75a00)' }}>
              <span className="text-5xl">{vendor.category === 'food' ? '🍕' : vendor.category === 'drinks' ? '🍹' : '🎯'}</span>
              <span className="text-[10px] text-white/30 uppercase tracking-widest">Photo coming soon</span>
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
              style={{ background: '#f9d378', color: '#1b1f3b' }}>
              {CATEGORY_LABELS[vendor.category]}
            </span>
            {vendor.is_available && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                style={{ background: '#1d4731', color: '#b7e4c7' }}>
                ● Available
              </span>
            )}
            {vendor.is_beta && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                style={{ background: '#3c4f80', color: '#f9d378', border: '1px solid #f9d378' }}>
                Beta
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <h3 className="text-[20px] font-bold text-white mb-1.5">{vendor.name}</h3>
          <p className="text-[13px] font-light text-tan-2 leading-relaxed mb-4 line-clamp-2">
            {vendor.description}
          </p>
          <div className="flex gap-4 pt-3.5 border-t text-[12px] text-tan-1 font-medium"
            style={{ borderColor: '#3c4f80' }}>
            {vendor.space_required && (
              <span>📐 Space: <strong className="text-gold">{vendor.space_required}</strong></span>
            )}
            {vendor.location && (
              <span>📍 <strong className="text-gold">{vendor.location}</strong></span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 flex justify-between items-center border-t"
          style={{ borderColor: '#3c4f80' }}>
          <div className="text-[14px] font-bold text-gold">
            {vendor.price_range}
            <span className="text-[12px] font-light text-tan-1 ml-1">per item</span>
          </div>
          <div className="text-[12px] font-semibold text-gold">View Profile →</div>
        </div>
      </div>
    </Link>
  )
}
