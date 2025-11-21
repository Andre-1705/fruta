import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase no configurado: faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY');
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
})();
