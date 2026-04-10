# The Circle — Deployment Guide

## Step 1: Create your accounts (10 minutes)

### GitHub
1. Go to github.com → Sign Up → use your Gmail
2. Verify your email

### Supabase
1. Go to supabase.com → Start for Free → Sign in with GitHub
2. Click "New Project"
3. Name: `open-circle` | Region: Southeast Asia (Singapore)
4. Set a strong database password → save it somewhere safe
5. Wait ~2 minutes for it to spin up

### Vercel
1. Go to vercel.com → Sign Up → Continue with GitHub

---

## Step 2: Set up the database (5 minutes)

1. In Supabase, click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` and paste it in
4. Click "Run" — you should see "Success"

---

## Step 3: Get your API keys (5 minutes)

### Supabase keys
- Go to: Project Settings → API
- Copy: "Project URL" → this is your SUPABASE_URL
- Copy: "anon public" key → SUPABASE_ANON_KEY
- Copy: "service_role secret" key → SUPABASE_SERVICE_ROLE_KEY

### Resend (email)
1. Go to resend.com → Sign Up (free)
2. API Keys → Create API Key → copy it

---

## Step 4: Deploy to Vercel (5 minutes)

1. Send me (Claude) the zip of this folder — I'll help you push it to GitHub
2. In Vercel: "Add New Project" → Import from GitHub → select the repo
3. Add Environment Variables (from your .env.local.example):
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - RESEND_API_KEY
   - NEXT_PUBLIC_SITE_URL → https://circle.opencirclemarkets.com
   - NEXT_PUBLIC_ADMIN_PASSWORD → (choose a strong password)
4. Click "Deploy" → wait ~2 minutes

---

## Step 5: Connect your subdomain (5 minutes)

1. In Vercel: Project → Settings → Domains → Add: circle.opencirclemarkets.com
2. Vercel will show you a CNAME record to add
3. In Squarespace: Settings → Domains → DNS Settings
4. Add a new CNAME record:
   - Host: circle
   - Points to: cname.vercel-dns.com
5. Wait up to 24 hours (usually under 1 hour)

---

## Done! 🎉

Your Circle portal will be live at: https://circle.opencirclemarkets.com

Pages:
- /circle → Our Circle vendor grid
- /circle/burnout-pizza → Burnout Pizza profile
- /book → Book a Vendor form
- /vendor/login → Vendor login
- /vendor/dashboard → Vendor dashboard
- /admin → Admin panel (password protected)

Questions? Ask Claude — the whole codebase is ready to go.
