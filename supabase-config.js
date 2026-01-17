// Supabase Configuration
const SUPABASE_URL = 'https://zrxfaaeqdsiwzowluaub.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kO0A10q0mWWeniKw2xoUMw_KGOjljR0';

// Initialize Supabase client (use window.supabase from CDN)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other modules
window.supabaseClient = supabaseClient;
