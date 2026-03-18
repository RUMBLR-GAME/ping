# Ping — Production Setup Guide

## Step 1: Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name: `ping` / Password: generate one / Region: `ap-southeast-2` (Sydney)
3. Once created, go to **Settings → API** and copy:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` public key → `VITE_SUPABASE_ANON_KEY`
4. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → Run
5. Go to **Authentication → Providers**:
   - Enable **Google**: paste your Google OAuth client ID + secret
   - Enable **Apple**: paste your Apple Services ID + secret
   - Enable **Email**: toggle on magic links
6. Go to **Authentication → URL Configuration**:
   - Site URL: `https://ping-fpri.vercel.app`
   - Redirect URLs: `https://ping-fpri.vercel.app/app`

### Google OAuth Setup
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → APIs & Services → Credentials → OAuth 2.0 Client ID
3. Authorized redirect: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
4. Copy Client ID + Secret into Supabase Auth → Google

## Step 2: Stripe (5 minutes)

1. Go to [stripe.com](https://stripe.com) → create account
2. Create two products:
   - **Ping Pro**: $9/month recurring → copy the Price ID (`price_xxx`)
   - **Ping Team**: $29/month recurring → copy the Price ID
3. Get your API keys from Dashboard → Developers → API keys
4. Set up webhook:
   - URL: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`
   - Copy the Webhook Secret

## Step 3: Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Set secrets
supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxx
supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
supabase secrets set STRIPE_PRICE_PRO=price_xxx
supabase secrets set STRIPE_PRICE_TEAM=price_xxx
supabase secrets set PROXYCURL_API_KEY=xxx  # optional
supabase secrets set UNSPLASH_ACCESS_KEY=xxx  # optional

# Deploy functions
supabase functions deploy generate-pings
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook

# Schedule daily pipeline (6AM AEST = 8PM UTC)
# Go to Supabase Dashboard → Edge Functions → generate-pings → Schedule → "0 20 * * *"
```

## Step 4: Vercel Environment Variables

Go to Vercel → your project → Settings → Environment Variables:

```
VITE_SUPABASE_URL = https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJxxx
VITE_STRIPE_PUBLISHABLE_KEY = pk_live_xxx
```

Redeploy after adding env vars.

## Step 5: Push Notifications

Push notifications work automatically via the service worker. The permission prompt appears when users first open the app. For real push delivery:

1. Generate VAPID keys: `npx web-push generate-vapid-keys`
2. Add to Supabase secrets: `supabase secrets set VAPID_PUBLIC_KEY=xxx VAPID_PRIVATE_KEY=xxx`
3. The generate-pings function will send push notifications to subscribed users after creating new pings

## Step 6: Proxycurl (Optional but recommended — $50/mo)

1. Sign up at [proxycurl.com](https://proxycurl.com)
2. Get API key → add to Supabase secrets
3. This enables real LinkedIn contact enrichment (name, role, tone, activity)
4. Without it, contacts will show basic "Decision Maker" placeholders

## Step 7: Unsplash (Optional — free)

1. Sign up at [unsplash.com/developers](https://unsplash.com/developers)
2. Create app → get Access Key
3. Add to Supabase secrets
4. Enables unique, relevant images for each ping
5. Without it, uses curated fallback lifestyle images (still looks great)

## Cost Summary

| Service | Monthly Cost | What it does |
|---------|-------------|-------------|
| Vercel | $0 | Hosting (hobby plan) |
| Supabase | $0 | Auth, database, Edge Functions (free tier) |
| Claude API | ~$15-30 | Scoring + message generation (~50 pings/day) |
| Stripe | 2.9% + 30¢ | Payment processing (only on revenue) |
| Proxycurl | $50 | LinkedIn contact enrichment (optional) |
| Unsplash | $0 | Dynamic images (free tier) |
| **Total** | **~$15-80/mo** | Scales with usage |

## Revenue to Break Even

At $9/mo Pro plan:
- 2 subscribers → covers Claude API
- 8 subscribers → covers Claude + Proxycurl
- Any more → profit

## Manual Pipeline Trigger

To manually trigger the ping pipeline (useful for testing):

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/generate-pings \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## Monitoring

- Supabase Dashboard → Logs → Edge Functions (see pipeline runs)
- Stripe Dashboard → Payments (see revenue)
- Vercel Dashboard → Analytics (see traffic)
