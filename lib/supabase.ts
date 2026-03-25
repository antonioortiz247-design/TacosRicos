import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Usamos variables de entorno con prefijo NEXT_PUBLIC para el cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente Singleton para evitar múltiples instancias en el lado del cliente
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    // En lugar de lanzar error, devolvemos null para no romper el build de Next.js
    console.warn('Advertencia: Faltan variables de entorno de Supabase.');
    return null;
  }

  if (typeof window === 'undefined') {
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseInstance;
}

// Helper para obtener el cliente de forma rápida (puede ser null)
export const supabase = getSupabaseClient()!;
