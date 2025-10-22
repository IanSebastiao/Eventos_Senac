if (typeof window.authLoaded === 'undefined') {
    window.authLoaded = true;

    function waitForSupabase(callback) {
        if (window.supabaseClient) {
            callback(window.supabaseClient);
        } else {
            console.log('Aguardando Supabase ser carregado...');
            setTimeout(() => waitForSupabase(callback), 100);
        }
    }

    function initializeAuth() {
        waitForSupabase((supabase) => {
            console.log('Supabase disponivel. Inicializando autenticação...');

            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                console.log('Formulário de login encontrado.');
                loginForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    console.log('Tentando fazer login...');

                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;

                    if (!email || !password) {
                        alert('Por favor, preencha todos os campos.');
                        return;
                    }

                    try {
                        const { data, error } = await supabase.auth.signInWithPassword({
                            email: email,
                            password: password,
                        });

                        if (error) {
                            alert('Erro ao fazer login: ' + error.message);
                            console.error('Erro de login:', error);
                        } else {
                            alert('Login bem-sucedido! Redirecionando...');
                            window.location.href = 'gestao.html';
                        }
                    } catch (err) {
                        console.error('Erro no login:', err);
                        alert('Erro ao conectar ao servidor. Tente novamente mais tarde.');
                    }
                });
            }
        }
    )}
    
    const authBtn = document.getElementById('auth-btn');

    async function atualizarBotaoAuth() {
        if (!authBtn) return;

        try {
            console.log('Atualizando botão de autenticação...');
            const { data: {session}, error } = await window.supabaseClient.auth.getSession();

            if (error) {
                console.error('Erro ao obter sessão:', error);
                return;
            } 

            console.log('Sessão:', session);

            if (session && session.user) {
                const user = session.user;
                const nome = user.user_metadata?.nome || user.email.split('@')[0];
                authBtn.textContent = `Olá, ${nome.split("")[0]} (Sair)`;
                authBtn.setAttribute("aria-label", "Fazer logout");

                authBtn.onclick = async () => {
                    const { error } = await window.supabaseClient.auth.signOut();
                    if (error) {
                        alert('Erro ao Sair:', + error.message);
                    } else {
                        alert('Logout bem-sucedido! Redirecionando para a página inicial...');
                        location.reload();
                    }
                };
            } else {
                authBtn.textContent = 'Admin';
                authBtn.setAttribute("aria-label", "Fazer Login");
                authBtn.onclick = () => {
                    window.location.href = 'login.html';
                };
            } 
        } catch (err) {
            console.error('Erro ao atualizar botão de autenticação:', err);
        }  
    } 

    if (authBtn) {
        if (!window.authStateListenerSet) {
            window.authStateListenerSet = true;
            supabase.auth.onAuthStateChange(() => {
                console.log('Estado de autenticação alterado. Atualizando botão...');
                atualizarBotaoAuth();
            });
        }  
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', atualizarBotaoAuth);
        } else {
            atualizarBotaoAuth();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAuth);
    }   else { 
        initializeAuth();
    }
}        
