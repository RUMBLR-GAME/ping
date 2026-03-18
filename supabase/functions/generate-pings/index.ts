// supabase/functions/generate-pings/index.ts
// Deploy: supabase functions deploy generate-pings
// Schedule: supabase functions schedule generate-pings --cron "0 20 * * *" (6AM AEST = 8PM UTC)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY')!
const PROXYCURL_KEY = Deno.env.get('PROXYCURL_API_KEY')
const UNSPLASH_KEY = Deno.env.get('UNSPLASH_ACCESS_KEY')

// ═══ DATA SOURCE FETCHERS ═══

// 1. ABN Registrations (Australian Business Register)
async function fetchNewRegistrations(): Promise<any[]> {
  try {
    // ABR doesn't have a real-time API — in production you'd use:
    // - ABR bulk data extract (free, daily CSV download)
    // - OpenCorporates API (has AU data, freemium)
    const res = await fetch('https://api.opencorporates.com/v0.4/companies/search?jurisdiction_code=au&created_since=' + 
      new Date(Date.now() - 86400000).toISOString().split('T')[0] + '&per_page=50')
    
    if (!res.ok) return []
    const data = await res.json()
    
    return (data.results?.companies || []).map((c: any) => ({
      company_name: c.company?.name || '',
      company_location: c.company?.registered_address_in_full || 'Australia',
      ping_type: 'new_registration',
      signal_source: 'opencorporates',
      signal_data: { company_number: c.company?.company_number, incorporation_date: c.company?.incorporation_date },
    }))
  } catch (e) {
    console.error('ABN fetch error:', e)
    return []
  }
}

// 2. Job Board Signals (Seek/Indeed via RSS-like approach)
async function fetchHiringSignals(): Promise<any[]> {
  // In production, you'd scrape Seek/Indeed RSS or use their APIs
  // For now, return structured signals that would come from these sources
  try {
    // Seek doesn't have a public API, but you can use:
    // - Adzuna API (free, aggregates AU job boards)
    // - Jooble API (free)
    const res = await fetch('https://jooble.org/api/' + (Deno.env.get('JOOBLE_API_KEY') || ''), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keywords: 'graphic designer OR brand designer OR web designer OR UX designer',
        location: 'Australia',
        page: 1,
      })
    })
    
    if (!res.ok) return []
    const data = await res.json()
    
    return (data.jobs || []).slice(0, 20).map((j: any) => ({
      company_name: j.company || 'Unknown',
      company_location: j.location || 'Australia',
      ping_type: 'hiring_creative',
      signal_source: 'jooble',
      signal_data: { title: j.title, link: j.link, snippet: j.snippet },
    }))
  } catch (e) {
    console.error('Job fetch error:', e)
    return []
  }
}

// 3. Unsplash image for a ping
async function getImage(query: string): Promise<string> {
  if (!UNSPLASH_KEY) {
    // Fallback lifestyle images if no API key
    const fallbacks = [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=400&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=600&fit=crop&q=80',
    ]
    return fallbacks[Math.floor(Math.random() * fallbacks.length)]
  }
  
  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query + ' people working')}&orientation=portrait&client_id=${UNSPLASH_KEY}`
    )
    if (!res.ok) return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop&q=80'
    const data = await res.json()
    return data.urls?.regular || data.urls?.small || ''
  } catch {
    return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop&q=80'
  }
}

// 4. Contact enrichment via Proxycurl
async function enrichContact(companyName: string): Promise<any[]> {
  if (!PROXYCURL_KEY) {
    // Return basic contacts without enrichment
    return [{ name: 'Decision Maker', role: 'Founder/CEO', ini: 'DM', best: true, channel: 'LinkedIn', tone: 'Professional', posts: 'Company updates', insight: 'Contact via LinkedIn.', activity: 'Unknown' }]
  }
  
  try {
    // Search for company on LinkedIn
    const res = await fetch(`https://nubela.co/proxycurl/api/linkedin/company/resolve?company_name=${encodeURIComponent(companyName)}&company_location=Australia`, {
      headers: { 'Authorization': `Bearer ${PROXYCURL_KEY}` }
    })
    
    if (!res.ok) return []
    const data = await res.json()
    
    if (data.url) {
      // Get company employees
      const empRes = await fetch(`https://nubela.co/proxycurl/api/linkedin/company/employees?url=${encodeURIComponent(data.url)}&role_search=founder%20OR%20ceo%20OR%20cmo%20OR%20marketing&page_size=3`, {
        headers: { 'Authorization': `Bearer ${PROXYCURL_KEY}` }
      })
      
      if (empRes.ok) {
        const empData = await empRes.json()
        return (empData.employees || []).map((emp: any, i: number) => ({
          name: emp.profile?.full_name || 'Unknown',
          role: emp.profile?.headline || emp.profile?.occupation || 'Unknown',
          ini: (emp.profile?.full_name || 'UN').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
          best: i === 0,
          channel: 'LinkedIn',
          tone: 'Professional',
          posts: 'LinkedIn content',
          insight: `Found via LinkedIn. ${emp.profile?.headline || ''}`,
          activity: 'Check LinkedIn profile',
          linkedin_url: emp.profile?.linkedin_url,
        }))
      }
    }
    return []
  } catch (e) {
    console.error('Proxycurl error:', e)
    return []
  }
}

// 5. Claude API — score ping + generate messages
async function scorePingAndGenerateMessages(signal: any, contacts: any[]): Promise<{ score: number, scores: any, why: string, whyMatch: string, messages: any[] }> {
  const contactNames = contacts.map((c: any) => `${c.name} (${c.role})`).join(', ')
  
  const prompt = `You are Ping's AI engine. Analyse this business signal and generate lead intelligence for a freelance designer/developer.

SIGNAL:
- Company: ${signal.company_name}
- Location: ${signal.company_location}
- Type: ${signal.ping_type}
- Raw data: ${JSON.stringify(signal.signal_data)}

CONTACTS FOUND: ${contactNames || 'None found'}

TASK: Return ONLY valid JSON (no markdown, no backticks) with this structure:
{
  "score": 7.5,
  "scores": {"freshness": 1.5, "budget": 1.5, "match": 1.5, "urgency": 1.0, "reach": 1.0},
  "why": "Brief explanation of why this is an opportunity",
  "whyMatch": "Why this matches a designer/developer's skills specifically",
  "messages": [
    {"label": "Direct & confident", "tone": "bold", "text": "Full message text here..."},
    {"label": "Warm & personal", "tone": "warm", "text": "Full message text here..."},
    {"label": "Value-led opener", "tone": "value", "text": "Full message text here..."},
    {"label": "Portfolio-forward", "tone": "proof", "text": "Full message text here..."},
    {"label": "Short & sweet", "tone": "brief", "text": "Full message text here..."}
  ],
  "contact_insights": [
    {"name": "Contact Name", "tone": "Their communication tone", "insight": "Key insight for approaching them", "posts": "What they post about", "activity": "How active they are"}
  ]
}

Score each dimension 0-2: freshness (how recent), budget (likelihood of spend), match (fit for design/dev), urgency (time sensitivity), reach (how accessible contacts are). Total normalised to 10.

Messages should be personalised to ${signal.company_name} and ready to copy-paste. Each 2-3 sentences max.`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      console.error('Claude API error:', res.status)
      return { score: 5, scores: {}, why: signal.signal_data?.snippet || '', whyMatch: '', messages: [] }
    }

    const data = await res.json()
    const text = data.content?.[0]?.text || ''
    
    // Parse JSON response
    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    
    return {
      score: parsed.score || 5,
      scores: parsed.scores || {},
      why: parsed.why || '',
      whyMatch: parsed.whyMatch || '',
      messages: parsed.messages || [],
    }
  } catch (e) {
    console.error('Claude scoring error:', e)
    return { score: 5, scores: {}, why: '', whyMatch: '', messages: [] }
  }
}

// ═══ MAIN PIPELINE ═══
Deno.serve(async (req) => {
  try {
    console.log('Starting daily ping pipeline...')
    
    // 1. Fetch signals from all sources
    const [registrations, hiring] = await Promise.all([
      fetchNewRegistrations(),
      fetchHiringSignals(),
    ])
    
    const allSignals = [...registrations, ...hiring]
    console.log(`Fetched ${allSignals.length} raw signals`)
    
    // 2. Deduplicate against existing pings
    const { data: existingPings } = await supabase
      .from('pings')
      .select('company_name')
      .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString())
    
    const existingNames = new Set((existingPings || []).map((p: any) => p.company_name.toLowerCase()))
    const newSignals = allSignals.filter(s => !existingNames.has(s.company_name.toLowerCase()))
    console.log(`${newSignals.length} new signals after dedup`)
    
    // 3. Process each signal (limit to 20 per run to manage API costs)
    const toProcess = newSignals.slice(0, 20)
    let created = 0
    
    for (const signal of toProcess) {
      try {
        // Get contacts
        const contacts = await enrichContact(signal.company_name)
        
        // Score and generate messages with Claude
        const aiResult = await scorePingAndGenerateMessages(signal, contacts)
        
        // Skip low-quality pings
        if (aiResult.score < 4) continue
        
        // Get a unique image
        const imageUrl = await getImage(signal.company_name + ' ' + signal.ping_type)
        
        // Merge AI contact insights with Proxycurl data
        const enrichedContacts = contacts.map((c: any, i: number) => ({
          ...c,
          ...(aiResult as any).contact_insights?.[i] || {},
        }))
        
        // Insert into database
        const { error } = await supabase.from('pings').insert({
          company_name: signal.company_name,
          company_location: signal.company_location,
          ping_type: signal.ping_type,
          signal_source: signal.signal_source,
          signal_data: signal.signal_data,
          score: aiResult.score,
          scores: aiResult.scores,
          why: aiResult.why,
          image_url: imageUrl,
          contacts: enrichedContacts,
          messages: aiResult.messages,
          skills_matched: ['design', 'development', 'marketing'], // TODO: actual skill matching
        })
        
        if (!error) created++
      } catch (e) {
        console.error(`Error processing ${signal.company_name}:`, e)
      }
    }
    
    // 4. Reset daily ping counts
    await supabase.rpc('reset_daily_pings')
    
    console.log(`Pipeline complete: ${created} pings created`)
    
    return new Response(JSON.stringify({ 
      success: true, 
      signals_fetched: allSignals.length,
      new_signals: newSignals.length,
      pings_created: created 
    }), { headers: { 'Content-Type': 'application/json' } })
    
  } catch (e) {
    console.error('Pipeline error:', e)
    return new Response(JSON.stringify({ error: String(e) }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
})
