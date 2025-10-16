// Inicialização do cliente Supabase
const SUPABASE_URL = "https://nahxbuzzmatdzrqaacrf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haHhidXp6bWF0ZHpycWFhY3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NDE4NTQsImV4cCI6MjA3NTAxNzg1NH0.wMiiiZZ3ZWxRy_RD_bRjHU4ck9tFpi1Ey8CPwFG18tQ";

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Seleciona elementos do DOM
const selectAtividade = document.getElementById("atividade");
console.log(selectAtividade);
const form = document.getElementById("formInscricao"); 

async function carregarAtividades() {
  const { data, error } = await client
    .from("tbatividades")
    .select("id, titulo, data")
    .order("data", { ascending: true });

  if (error) {
    console.error("Erro ao carregar atividades:", error.message);
    selectAtividade.innerHTML =
      '<option value="">Erro ao carregar atividades</option>';
    return;
  }

  const hoje = new Date();
  const atividadesFuturas = data.filter((ev) => new Date(ev.data) >= hoje);

  if (atividadesFuturas.length === 0) {
    selectAtividade.innerHTML =
      '<option value="">Nenhuma atividade disponível</option>';
    return;
  }

  selectAtividade.innerHTML = '<option value="">Selecione uma atividade</option>';
  atividadesFuturas.forEach((ev) => {
    const opcao = document.createElement("option");
    const dataFormatada = new Date(ev.data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
    opcao.value = ev.id;
    opcao.textContent = `${ev.titulo} — ${dataFormatada}`;
    selectAtividade.appendChild(opcao);
  });

  // Pré-seleciona evento via parâmetro ?id=ID
  const params = new URLSearchParams(window.location.search);
  const eventoId = params.get("id");
  if (eventoId) selectAtividade.value = eventoId;
}

async function salvarInscricao(nome, email, atividade_id) {
  const { data: jaExiste, error: erroBusca } = await client
    .from("tbinscricoes")
    .select("*")
    .eq("email", email)
    .eq("idatividade", atividade_id);

  if (erroBusca) {
    console.error("Erro ao verificar inscrição existente:", erroBusca.message);
    alert("Erro ao verificar inscrição. Tente novamente.");
    return false;
  }

  if (jaExiste.length > 0) {
    alert("Você já está inscrito(a) neste evento.");
    return false;
  }

  const { error } = await client.from("tbinscricoes").insert([
    {
      nome,
      email,
      idatividade: atividade_id,
    },
  ]);

  if (error) {
    console.error("Erro ao salvar inscrição:", error.message);
    alert("Erro ao enviar inscrição. Tente novamente.");
    return false;
  }

  return true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const atividade_id = selectAtividade.value;

  if (!atividade_id) {
    alert("Selecione uma atividade antes de enviar.");
    return;
  }

  const sucesso = await salvarInscricao(nome, email, atividade_id);

  if (sucesso) {
    alert(`Inscrição realizada com sucesso!\n\nNome: ${nome}\nE-mail: ${email}`);
    form.reset();
  }
});

// Carrega atividades ao abrir a página
carregarAtividades();
