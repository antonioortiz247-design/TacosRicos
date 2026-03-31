import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Cliente Singleton para el lado del cliente
let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

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

export function getSupabaseAdmin(): SupabaseClient | null {
  // Solo disponible en el servidor
  if (typeof window !== 'undefined' || !supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  return supabaseAdminInstance;
}

// Exportamos un cliente base para compatibilidad, pero siempre es mejor usar getSupabaseClient()
// Usamos un placeholder para evitar errores de construcción en Vercel si faltan las env vars
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
