import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xyzcompany.supabase.co'; // Deine URL
const supabaseAnonKey = 'public-anon-key'; // Dein anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
