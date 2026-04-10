-- ══════════════════════════════════════════════
-- Open Circle Markets — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════

-- VENDORS TABLE
create table public.vendors (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  name            text not null,
  slug            text not null unique,
  category        text not null check (category in ('food','drinks','experience','entertainment')),
  description     text,
  space_required  text,
  price_range     text,
  location        text,
  is_available    boolean default true,
  is_active       boolean default true,
  is_beta         boolean default false,
  photos          text[] default '{}',
  logo_url        text,
  suitable_for    text[] default '{}',
  user_id         uuid references auth.users(id)
);

-- ENQUIRIES TABLE
create table public.enquiries (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  occasion        text,
  event_date      text,
  guest_count     int,
  event_location  text,
  venue_type      text,
  event_notes     text,
  vendor_types    text[],
  event_type      text,
  budget          int,
  requirements    text[],
  vendor_notes    text,
  first_name      text,
  last_name       text,
  email           text,
  phone           text,
  organisation    text,
  referral_source text,
  status          text default 'new' check (status in ('new','sent_to_vendors','responses_received','closed'))
);

-- VENDOR RESPONSES TABLE
create table public.vendor_responses (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  enquiry_id      uuid references public.enquiries(id),
  vendor_id       uuid references public.vendors(id),
  available       boolean default true,
  message         text,
  quote_amount    int
);

-- RLS POLICIES (Row Level Security)
alter table public.vendors enable row level security;
alter table public.enquiries enable row level security;
alter table public.vendor_responses enable row level security;

-- Anyone can read active vendors
create policy "Public can view active vendors" on public.vendors
  for select using (is_active = true);

-- Only service role can insert/update vendors
create policy "Service role manages vendors" on public.vendors
  for all using (auth.role() = 'service_role');

-- Anyone can insert an enquiry (the booking form)
create policy "Anyone can submit enquiry" on public.enquiries
  for insert with check (true);

-- Only service role reads enquiries (admin)
create policy "Service role reads enquiries" on public.enquiries
  for select using (auth.role() = 'service_role');

-- Service role updates enquiry status
create policy "Service role updates enquiries" on public.enquiries
  for update using (auth.role() = 'service_role');

-- SEED: Burnout Pizza (beta vendor)
insert into public.vendors (name, slug, category, description, space_required, price_range, location, is_available, is_active, is_beta, suitable_for)
values (
  'Burnout Pizza',
  'burnout-pizza',
  'food',
  'The Perfect Slice. Real Detroit-style pizza on focaccia bread with some of the most wicked flavours on top. Whether it''s Sweet Heat or Bufflow, Burnout is set to make your tastebuds tingle.',
  '2.5m × 2.5m',
  '$13 – $16',
  'Auckland',
  true,
  true,
  true,
  ARRAY['🏢 Corporate Events','🎉 Private Parties','🎊 Markets & Festivals','🍽️ Catering']
);
