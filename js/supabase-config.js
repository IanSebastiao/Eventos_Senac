if (typeof window.supabaseConfigLoaded === 'undefined') {
    window.supabaseConfigLoaded = true;
    
    const SUPABASE_URL = "https://nahxbuzzmatdzrqaacrf.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haHhidXp6bWF0ZHpycWFhY3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NDE4NTQsImV4cCI6MjA3NTAxNzg1NH0.wMiiiZZ3ZWxRy_RD_bRjHU4ck9tFpi1Ey8CPwFG18tQ";
    
    if (!window.supabaseClient) {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client criado globalmente');
    } else {
        console.log('Supabase client já existe, reutilizando...');
    }
}