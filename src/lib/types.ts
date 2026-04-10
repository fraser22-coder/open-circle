export type VendorCategory = 'food' | 'drinks' | 'experience' | 'entertainment'
export type EventType = 'selling' | 'catering' | 'both'

export interface Vendor {
  id: string
  created_at: string
  name: string
  slug: string
  category: VendorCategory
  description: string
  space_required: string
  price_range: string
  location: string
  is_available: boolean
  is_active: boolean
  is_beta: boolean
  photos: string[]     // Supabase Storage URLs
  logo_url: string | null
  suitable_for: string[]
  user_id: string | null  // linked vendor login
}

export interface Enquiry {
  id: string
  created_at: string
  // Step 1
  occasion: string
  event_date: string
  guest_count: number
  event_location: string
  venue_type: string
  event_notes: string
  // Step 2
  vendor_types: VendorCategory[]
  event_type: EventType
  budget: number | null
  requirements: string[]
  vendor_notes: string
  // Step 3
  first_name: string
  last_name: string
  email: string
  phone: string
  organisation: string
  referral_source: string
  // Status
  status: 'new' | 'sent_to_vendors' | 'responses_received' | 'closed'
}

export interface VendorResponse {
  id: string
  created_at: string
  enquiry_id: string
  vendor_id: string
  vendor: Vendor
  available: boolean
  message: string
  quote_amount: number | null
}
