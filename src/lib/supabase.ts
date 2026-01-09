import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

export interface DeckSave {
  id?: number;
  slot_name: string;
  password_hash: string;
  data: {
    unitConfigs: Array<{
      unit: string;
      rank: number;
      enabled: boolean;
    }>;
    deck: Array<{
      cardID: number;
      count: number;
    }>;
  };
  created_at?: string;
  updated_at?: string;
}

// Simple hash function for password (not cryptographically secure, but sufficient for this use case)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'marinrpg-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
