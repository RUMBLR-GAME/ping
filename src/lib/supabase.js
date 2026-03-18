import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

// Auth helpers
export const signInWithGoogle = async () => {
  if (!supabase) return { error: 'Supabase not configured' }
  return supabase.auth.signInWithOAuth({ 
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/app` }
  })
}

export const signInWithApple = async () => {
  if (!supabase) return { error: 'Supabase not configured' }
  return supabase.auth.signInWithOAuth({ 
    provider: 'apple',
    options: { redirectTo: `${window.location.origin}/app` }
  })
}

export const signInWithEmail = async (email) => {
  if (!supabase) return { error: 'Supabase not configured' }
  return supabase.auth.signInWithOtp({ 
    email,
    options: { emailRedirectTo: `${window.location.origin}/app` }
  })
}

export const signOut = async () => {
  if (!supabase) return
  return supabase.auth.signOut()
}

export const getUser = async () => {
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}

export const onAuthChange = (callback) => {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } }
  return supabase.auth.onAuthStateChange(callback)
}
