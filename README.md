# RentCircle 🏠🇳🇬

Nigeria's premier roommate matching and shared housing platform — built for Lagos, Abuja, and Port Harcourt.

---

## What's built

### Pages & Features
| Route | Description |
|-------|-------------|
| `/` | Marketing landing page with stats, features, testimonials |
| `/auth/login` | Email/phone login + Google OAuth |
| `/auth/register` | Registration with password strength meter |
| `/auth/verify` | OTP email verification (6-digit, auto-submit) |
| `/onboarding` | 4-step profile setup (basics → location → lifestyle → budget) |
| `/listings` | Property feed with search, area filters, budget slider |
| `/listings/[id]` | Full property detail page |
| `/matches` | Swipe-style roommate discovery + compatibility scoring |
| `/chat` | Real-time messaging with safety features |
| `/group` | Group renting — pool budgets, browse/create groups |
| `/profile` | User profile + verification status |

### Compatibility Engine (`/lib/compatibility.ts`)
Scores two profiles across 4 dimensions:
- **Budget overlap** (25 pts) — how much rent ranges intersect
- **Location preference** (20 pts) — shared target areas
- **Lifestyle match** (35 pts) — cleanliness, smoking, drinking, guests, pets
- **Sleep schedule** (20 pts) — early bird vs night owl alignment

### Database (Supabase PostgreSQL)
Full schema in `schema.sql`:
- `profiles` — user profiles with lifestyle JSONB
- `listings` — property listings with location JSONB
- `matches` — bidirectional like/pass/super-like
- `conversations` + `messages` — real-time chat (Supabase Realtime)
- `rent_groups` + `group_members` — group renting
- `saved_listings`, `reviews`, `reports`, `notifications`
- Row Level Security on all tables
- Full-text search with `pg_trgm`
- Realtime enabled for messages, notifications, matches

---

## Quick Start

### 1. Set up Supabase (free)
1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor → paste and run `schema.sql`
3. Go to Authentication → enable Email and Google providers
4. Go to Storage → create buckets: `avatars`, `listing-photos`, `verification-docs`
5. Copy Project URL + anon key from Settings → API

### 2. Configure environment
```bash
cp .env.local.example .env.local
# Fill in your Supabase URL and anon key
```

### 3. Install and run
```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email, phone, Google OAuth) |
| Real-time | Supabase Realtime |
| Storage | Supabase Storage |
| Forms | React Hook Form + Zod |
| Payments | Paystack (Nigeria) |
| Maps | Google Maps API |

---

## Project Structure

```
rentcircle/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── auth/
│   │   ├── login/page.tsx        # Login (email + Google)
│   │   ├── register/page.tsx     # Registration
│   │   └── verify/page.tsx       # OTP verification
│   ├── onboarding/page.tsx       # 4-step profile setup
│   ├── listings/page.tsx         # Listings feed
│   ├── matches/page.tsx          # Roommate matching
│   ├── chat/page.tsx             # Messaging
│   └── group/page.tsx            # Group renting
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── VerificationBadge.tsx
│   └── layout/
│       └── BottomNav.tsx
├── lib/
│   ├── supabase.ts               # Browser client
│   ├── supabase-server.ts        # Server client
│   ├── compatibility.ts          # Matching algorithm
│   └── utils.ts                  # Helpers + Nigerian data
├── types/index.ts                # TypeScript types
├── schema.sql                    # Full DB schema
└── .env.local.example
```

---

## Deployment

### Vercel (recommended)
```bash
npx vercel
# Set environment variables in Vercel dashboard
```

### Self-hosted
```bash
npm run build
npm start
```

---

## Extending

### Add Paystack payments
```ts
// In /app/api/payments/route.ts
const response = await fetch('https://api.paystack.co/transaction/initialize', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  body: JSON.stringify({ email, amount: amountInKobo, callback_url })
})
```

### Add Google Maps to listings
```tsx
import { GoogleMap, Marker } from '@react-google-maps/api'
// Use listing.location.lat + listing.location.lng
```

### Enable real-time chat
```ts
const channel = supabase
  .channel('messages')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, handleNewMessage)
  .subscribe()
```

---

## Nigerian Cities Coverage
- **Lagos**: Yaba, Lekki, Surulere, Ikeja, Ajah, Festac, VI, Ikoyi, Gbagada, Magodo, Maryland, Ogudu, Ketu
- **Abuja**: Maitama, Wuse, Gwarinpa, Jabi, Kubwa, Garki, Asokoro, Utako, Life Camp, Lugbe  
- **Port Harcourt**: GRA, Rumuola, D-line, Eliozu, Rumuokoro, Trans-Amadi
