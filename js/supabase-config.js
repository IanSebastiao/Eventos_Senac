if (typeof window.supabaseConfigLoaded === 'undefined') {
    window.supabaseConfigLoaded = true;

    const SUPABASE_URL = ""
    const SUPABASE_ANON_KEY = ""

    if (!window.supabaseClient) {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client criado globalmente');
    } else {
        console.log('Supabase client ja existe, reutilizando...')
    }
}