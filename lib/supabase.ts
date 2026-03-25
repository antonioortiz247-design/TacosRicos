import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Usamos variables de entorno con prefijo NEXT_PUBLIC para el cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente Singleton para evitar múltiples instancias en el lado del cliente
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Faltan variables de entorno de Supabase: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  if (typeof window === 'undefined') {
    // En el servidor, siempre creamos una nueva instancia o manejamos según sea necesario
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseInstance;
}

// Helper para obtener el cliente de forma rápida
export const supabase = getSupabaseClient();
