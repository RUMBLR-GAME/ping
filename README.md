# Ping — Tinder for Freelance Leads

> Land clients before they even know they need you.

AI-powered lead intelligence that surfaces buying signals — new registrations, funding rounds, leadership changes, hiring posts — and matches them to your skills. Swipe right on your next client.

## Quick Start

```bash
npm install
npm run dev
```

## Deploy to Vercel

```bash
npx vercel --prod
```

## Tech Stack

- **Frontend:** React 19 + Vite (PWA)
- **Backend:** Supabase (Auth, Postgres, Edge Functions, Realtime)
- **AI:** Claude API (ping scoring, message generation, skill matching)
- **Payments:** Stripe (Free / Pro $9/mo / Team $29/mo)
- **Hosting:** Vercel
- **Images:** Unsplash (royalty-free, unique per ping)

## Data Pipeline Architecture

Pings are generated daily from 6 signal sources:

### Free / Low-Cost Sources (MVP)
| Source | Signal | Method | Cost |
|--------|--------|--------|------|
| **ABR/ASIC** | New ABN registrations | Daily bulk data download | Free |
| **AusRegistry WHOIS** | New .com.au domains with no live site | Zone file download | ~$50/yr |
| **Seek/Indeed RSS** | Companies hiring creative/tech roles | RSS feed parsing | Free |
| **Google Alerts** | CMO/CTO departures, rebrands | Email webhook → parser | Free |
| **ProductHunt/HackerNews** | New product launches needing design | RSS/API scraping | Free |
| **Government grants** | Companies receiving innovation grants | Data.gov.au API | Free |

### Premium Sources (Pro Tier)
| Source | Signal | Method | Cost |
|--------|--------|--------|------|
| **Crunchbase** | Funding rounds (seed, Series A-C) | API | $299/mo |
| **Proxycurl/LinkedIn** | Leadership changes, hiring signals | Proxy API | ~$100/mo |
| **Airtasker** | Active freelance job postings | Web scraping (headless) | Infra only |
| **Upwork RSS** | New job posts matching skills | RSS feed | Free |
| **Twitter/X API** | Companies posting about launches | API v2 | $100/mo |

### Pipeline Flow
```
6:00 AM AEST — Cron triggers Supabase Edge Functions
  → Fetch raw signals from all sources
  → Deduplicate against existing pings
  → Claude API: Score each signal (0-10 rubric)
  → Claude API: Match to user skill profiles
  → Claude API: Generate 5 personalised messages per ping
  → Claude API: Research contacts + generate insights
  → Store in Supabase Postgres
  → Push notifications to matched users
7:30 AM AEST — Users wake up to fresh pings
```

### Scoring Rubric (0-10)
Each ping is scored across 5 dimensions (0-2 each):

1. **Signal Freshness** — How recent? (<6h = 2, <24h = 1.5, <48h = 1)
2. **Budget Likelihood** — Funding/hiring = 2, new reg = 1.5, departure = 1
3. **Skill Match** — Direct match = 2, adjacent = 1.5, tangential = 1
4. **Urgency** — Active hiring/no website = 2, departure = 1.5
5. **Reachability** — Email+LinkedIn = 2, LinkedIn only = 1.5, IG only = 1

### Airtasker Integration
Airtasker doesn't offer a public API. Integration approach:
1. Headless browser (Puppeteer) scrapes category pages every 6 hours
2. Filter for tasks matching user skills + location
3. Extract: task title, description, budget, poster info
4. Score through Claude API pipeline
5. Deduplicate against existing pings
6. Note: Airtasker tasks are lower-value ($50-500) vs direct leads ($5K-50K), so they'll score lower on the budget dimension but higher on urgency/reachability

## File Structure

```
ping-app/
├── index.html          # PWA entry with meta tags
├── package.json
├── vite.config.js
├── vercel.json         # SPA routing + headers
├── public/
│   ├── manifest.json   # PWA manifest
│   └── sw.js           # Service worker (offline + push)
├── src/
│   ├── main.jsx        # React entry
│   └── App.jsx         # Full app (73KB — will split into components post-MVP)
└── supabase/
    └── functions/      # Edge functions for data pipeline (TODO)
```

## Roadmap

- [x] PWA prototype with swipe mechanics
- [x] Onboarding flow with dynamic skill matching
- [x] Ping detail with contacts, messages, scoring
- [x] Referral system
- [x] Push notification permission flow
- [ ] Supabase auth (Google, Apple, email magic link)
- [ ] Real data pipeline (ABN, WHOIS, job boards)
- [ ] Claude API integration for scoring + messages
- [ ] Stripe payments (Pro $9/mo)
- [ ] Airtasker scraper
- [ ] Real-time push notifications
- [ ] Landing page deployment (ping.app)

## Brand

- **Primary:** #FF4D6D (Coral)
- **Font:** Helvetica Neue (700 headers, 300 body)
- **Radius:** 24px cards, 16px inputs, 999px pills
- **Pricing:** Free (5/day) | Pro $9/mo (unlimited) | Team $29/mo

---

Built in Melbourne 🇦🇺
