import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Cliente Singleton para el lado del cliente
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (typeof window === 'undefined') {
    // En el servidor, creamos uno nuevo por cada request o usamos cache si es necesario
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseInstance;
}

// Exportamos un cliente base para compatibilidad, pero siempre es mejor usar getSupabaseClient()
// Usamos un placeholder para evitar errores de construcción en Vercel si faltan las env vars
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
