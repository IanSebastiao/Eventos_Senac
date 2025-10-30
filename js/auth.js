// auth.js
// ===============================
// VERIFICAÇÃO PARA EVITAR DUPLICAÇÃO
// ===============================
if (typeof window.authLoaded === 'undefined') {
  window.authLoaded = true;

  // Aguarda o Supabase estar disponível
  function waitForSupabase(callback) {
    if (window.supabaseClient) {
      callback(window.supabaseClient);
    } else {
      console.log('Aguardando Supabase...');
      setTimeout(() => waitForSupabase(callback), 100);
    }
  }

  function initializeAuth() {
    waitForSupabase((supabase) => {
      console.log('Supabase disponível, inicializando auth...');

      // ===============================
      // LOGIN
      // ===============================
      const loginForm = document.getElementById("login-form");
      if (loginForm) {
        console.log("Formulário de login encontrado");
        loginForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          console.log("Formulário de login submetido");

          const email = document.getElementById("email").value.trim();
          const password = document.getElementById("password").value.trim();

          if (!email || !password) {
            alert("Por favor, preencha todos os campos.");
            return;
          }

          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) {
              alert("Erro ao fazer login: " + error.message);
            } else {
              alert("Login realizado com sucesso!");
              window.location.href = "gestao.html";
            }
          } catch (err) {
            console.error("Erro no login:", err);
            alert("Erro ao conectar com o servidor.");
          }
        });
      }

      // ===============================
      // CADASTRO
      // ===============================
      const signupForm = document.getElementById("signup-form");
      if (signupForm) {
        console.log("Formulário de cadastro encontrado");
        signupForm.addEventListener("submit", async (e) => {
          e.preventDefault();

          const email = document.getElementById("s-email").value.trim();
          const password = document.getElementById("s-password").value.trim();

          if (!email || !password) {
            alert("Por favor, preencha todos os campos.");
            return;
          }

          if (password.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres.");
            return;
          }

          try {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  nome: email.split('@')[0]
                }
              }
            });

            if (error) {
              alert("Erro ao criar conta: " + error.message);
            } else {
              alert("Conta criada com sucesso! Verifique seu email para confirmação.");
              window.location.href = "login.html";
            }
          } catch (err) {
            console.error("Erro no cadastro:", err);
            alert("Erro ao conectar com o servidor.");
          }
        });
      }

      // ===============================
      // BOTÃO "ENTRAR / SAIR" + GESTÃO
      // ===============================
      const authBtn = document.getElementById("auth-btn");
      const gestaoLink = document.getElementById("gestao");
      const cadastroLink = document.getElementById("cadastro");

      async function atualizarBotaoAuth() {
        if (!authBtn) return;

        try {
          const { data: { session }, error } = await supabase.auth.getSession();

          if (error) {
            console.error("Erro ao obter sessão:", error);
            return;
          }

          if (session && session.user) {
            // Usuário logado
            const user = session.user;
            const nome = user.user_metadata?.nome || user.email.split("@")[0];

            authBtn.textContent = `Olá, ${nome.split(" ")[0]} (Sair)`;
            authBtn.setAttribute("aria-label", "Fazer logout");

            // Mostra o link de gestão
            if (gestaoLink) gestaoLink.style.display = "inline-block";
            if (cadastroLink) cadastroLink.style.display = "inline-block";

            authBtn.onclick = async () => {
              const { error } = await supabase.auth.signOut();
              if (error) {
                alert("Erro ao sair: " + error.message);
              } else {
                alert("Você saiu com sucesso.");
                location.reload();
              }
            };
          } else {
            // Usuário deslogado
            authBtn.textContent = "Entrar";
            authBtn.setAttribute("aria-label", "Fazer login");
            authBtn.onclick = () => {
              window.location.href = "login.html";
            };

            // Oculta o link de gestão
            if (gestaoLink) gestaoLink.style.display = "none";
          }
        } catch (err) {
          console.error("Erro ao atualizar botão de auth:", err);
        }
      }


      // Inicializa apenas se estiver na página com o botão auth
      if (authBtn) {
        // Configura o listener UMA única vez
        if (!window.authStateListenerSet) {
          window.authStateListenerSet = true;
          supabase.auth.onAuthStateChange(() => {
            console.log("Estado de auth mudou");
            atualizarBotaoAuth();
          });
        }

        // Atualiza o botão quando a página carrega
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', atualizarBotaoAuth);
        } else {
          atualizarBotaoAuth();
        }
      }
    });
  }

  // Inicia a inicialização
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
  } else {
    initializeAuth();
  }
}