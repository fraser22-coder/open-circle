'use client'
import { useState, useEffect } from 'react'

interface DraftVendor {
  id: string
  name: string
  category: string
  description: string
  tagline: string
  location: string
  price_range: string
  space: string
  logo_url: string
  food_photo_urls: string[]
  review_status: string
  created_at: string
}

const CATEGORY_LABELS: Record<string, string> = {
  food: '🍕 Food',
  drinks: '🍹 Drinks',
  experience: '🎯 Experience',
  entertainment: '🎭 Entertainment',
}

const SPACE_LABELS: Record<string, string> = {
  '2x2': 'Small (2m × 2m)',
  '3x3': 'Medium (3m × 3m)',
  '4x4plus': 'Large (4m × 4m+)',
  flexible: 'Flexible',
}

export default function ReviewPage() {
  const [vendors, setVendors] = useState<DraftVendor[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchPending = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/vendors')
      if (res.ok) {
        setVendors(await res.json())
      } else {
        showToast('Failed to load vendors.', 'error')
      }
    } catch {
      showToast('Network error.', 'error')
    }
    setLoading(false)
  }

  useEffect(() => { fetchPending() }, [])

  const handleAction = async (vendor_id: string, action: 'approve' | 'deny') => {
    setActionLoading(vendor_id + action)
    try {
      const res = await fetch('/api/admin/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendor_id, action }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast(data.message, 'success')
        setVendors(prev => prev.filter(v => v.id !== vendor_id))
      } else {
        showToast(data.error || 'Something went wrong.', 'error')
      }
    } catch {
      showToast('Network error.', 'error')
    }
    setActionLoading(null)
  }

  return (
    <div style={{ background: '#1b1f3b', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg,#303e66,#1b1f3b)',
          borderBottom: '1px solid #3c4f80',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1 style={{ color: '#f9d378', fontWeight: 900, fontSize: '22px', margin: 0 }}>
            ⭕ Pending Applications
          </h1>
          <p style={{ color: '#6b7db3', fontSize: '13px', margin: '4px 0 0' }}>
            {loading ? 'Loading…' : `${vendors.length} profile${vendors.length !== 1 ? 's' : ''} awaiting your review`}
          </p>
        </div>
        <button
          onClick={fetchPending}
          style={{
            background: '#252d4a',
            border: '1px solid #3c4f80',
            borderRadius: '8px',
            color: '#c5b098',
            padding: '8px 14px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <p style={{ color: '#6b7db3', fontSize: '14px' }}>Loading applications…</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && vendors.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <p style={{ color: '#f9d378', fontWeight: 700, fontSize: '18px' }}>All clear!</p>
          <p style={{ color: '#6b7db3', fontSize: '14px', marginTop: '8px' }}>
            No pending applications right now.
          </p>
        </div>
      )}

      {/* Profile cards */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
        {vendors.map(vendor => (
          <div
            key={vendor.id}
            style={{
              background: '#1e2541',
              border: '1px solid #3c4f80',
              borderRadius: '16px',
              marginBottom: '32px',
              overflow: 'hidden',
            }}
          >
            {/* Card label */}
            <div
              style={{
                background: '#252d4a',
                borderBottom: '1px solid #3c4f80',
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#baa182', textTransform: 'uppercase' }}>
                Draft Profile Preview
              </span>
              <span style={{ fontSize: '11px', color: '#6b7db3' }}>
                · submitted {new Date(vendor.created_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Identity row */}
              <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', marginBottom: '20px' }}>
                {vendor.logo_url && (
                  <img
                    src={vendor.logo_url}
                    alt={vendor.name}
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '12px', flexShrink: 0, border: '2px solid #3c4f80' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h2 style={{ color: '#f0e6d3', fontWeight: 900, fontSize: '22px', margin: '0 0 4px' }}>
                    {vendor.name}
                  </h2>
                  {vendor.tagline && (
                    <p style={{ color: '#f9d378', fontSize: '13px', fontStyle: 'italic', margin: '0 0 10px' }}>
                      "{vendor.tagline}"
                    </p>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ background: '#303e66', border: '1px solid #3c4f80', borderRadius: '99px', padding: '3px 10px', fontSize: '11px', color: '#c5b098' }}>
                      {CATEGORY_LABELS[vendor.category] ?? vendor.category}
                    </span>
                    {vendor.location && (
                      <span style={{ background: '#303e66', border: '1px solid #3c4f80', borderRadius: '99px', padding: '3px 10px', fontSize: '11px', color: '#c5b098' }}>
                        📍 {vendor.location}
                      </span>
                    )}
                    {vendor.price_range && (
                      <span style={{ background: '#303e66', border: '1px solid #3c4f80', borderRadius: '99px', padding: '3px 10px', fontSize: '11px', color: '#c5b098' }}>
                        💰 {vendor.price_range}
                      </span>
                    )}
                    {vendor.space && (
                      <span style={{ background: '#303e66', border: '1px solid #3c4f80', borderRadius: '99px', padding: '3px 10px', fontSize: '11px', color: '#c5b098' }}>
                        📐 {SPACE_LABELS[vendor.space] ?? vendor.space}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Generated description */}
              <p style={{ color: '#c5b098', fontSize: '14px', lineHeight: 1.65, margin: '0 0 20px', background: '#252d4a', padding: '14px 16px', borderRadius: '10px', borderLeft: '3px solid #f9d378' }}>
                {vendor.description}
              </p>

              {/* Food photos */}
              {vendor.food_photo_urls?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', color: '#baa182', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Food / Product Photos
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {vendor.food_photo_urls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Photo ${i + 1}`}
                        onClick={() => setSelectedPhoto(url)}
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '8px', border: '2px solid #3c4f80', cursor: 'zoom-in' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #3c4f80' }}>
                <button
                  onClick={() => handleAction(vendor.id, 'approve')}
                  disabled={!!actionLoading}
                  style={{
                    flex: 1,
                    padding: '13px',
                    borderRadius: '99px',
                    border: 'none',
                    background: '#22c55e',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    opacity: actionLoading && actionLoading !== vendor.id + 'approve' ? 0.5 : 1,
                  }}
                >
                  {actionLoading === vendor.id + 'approve' ? 'Approving…' : '✓ Approve — Go Live'}
                </button>
                <button
                  onClick={() => handleAction(vendor.id, 'deny')}
                  disabled={!!actionLoading}
                  style={{
                    flex: 1,
                    padding: '13px',
                    borderRadius: '99px',
                    border: '1px solid #8b2222',
                    background: 'transparent',
                    color: '#f87171',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    opacity: actionLoading && actionLoading !== vendor.id + 'deny' ? 0.5 : 1,
                  }}
                >
                  {actionLoading === vendor.id + 'deny' ? 'Denying…' : '✕ Deny — Archive'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: toast.type === 'success' ? '#166534' : '#7f1d1d',
            border: `1px solid ${toast.type === 'success' ? '#22c55e' : '#f87171'}`,
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '99px',
            fontWeight: 600,
            fontSize: '14px',
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Photo lightbox */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, cursor: 'zoom-out',
          }}
        >
          <img
            src={selectedPhoto}
            alt="Full size"
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '12px', objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  )
}
