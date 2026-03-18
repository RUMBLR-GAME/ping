// supabase/functions/stripe-webhook/index.ts
// Deploy: supabase functions deploy stripe-webhook
// Then set webhook URL in Stripe dashboard: https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

Deno.serve(async (req) => {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (e) {
    return new Response(`Webhook Error: ${e}`, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id
      if (userId) {
        await supabase.from('profiles').update({
          plan: 'pro',
          stripe_subscription_id: session.subscription as string,
        }).eq('id', userId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_subscription_id', sub.id)
        .single()
      
      if (data) {
        await supabase.from('profiles').update({ plan: 'free', stripe_subscription_id: null }).eq('id', data.id)
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_subscription_id', sub.id)
        .single()
      
      if (data) {
        const plan = sub.status === 'active' ? 'pro' : 'free'
        await supabase.from('profiles').update({ plan }).eq('id', data.id)
      }
      break
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
