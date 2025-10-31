// Inicialização do cliente Supabase
const SUPABASE_URL = "https://nahxbuzzmatdzrqaacrf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haHhidXp6bWF0ZHpycWFhY3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NDE4NTQsImV4cCI6MjA3NTAxNzg1NH0.wMiiiZZ3ZWxRy_RD_bRjHU4ck9tFpi1Ey8CPwFG18tQ";

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Seleciona elementos do DOM
const selectAtividade = document.getElementById("atividade");
const form = document.getElementById("formInscricao");

// Criar área para exibir vagas disponíveis
let infoVagas = document.getElementById("infoVagas");
if (!infoVagas) {
  infoVagas = document.createElement("div");
  infoVagas.id = "infoVagas";
  infoVagas.style.marginTop = "8px";
  infoVagas.style.fontSize = "14px";
  infoVagas.style.color = "#333";
  selectAtividade.insertAdjacentElement("afterend", infoVagas);
}

let listaAtividades = []; // armazenar dados carregados

async function carregarAtividades() {
  const { data, error } = await client
    .from("tbatividades")
    .select("id, titulo, data, vagas")
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

  listaAtividades = atividadesFuturas;

  selectAtividade.innerHTML = '<option value="">Selecione uma atividade</option>';
  for (const ev of atividadesFuturas) {
    const dataFormatada = new Date(ev.data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
    const opcao = document.createElement("option");
    opcao.value = ev.id;
    opcao.textContent = `${ev.titulo} — ${dataFormatada}`;
    selectAtividade.appendChild(opcao);
  }

  // Pré-seleciona evento via parâmetro ?id=ID
  const params = new URLSearchParams(window.location.search);
  const eventoId = params.get("id");
  if (eventoId) {
    selectAtividade.value = eventoId;
    await mostrarInfoVagas(eventoId);
  }
}

// Função que exibe as vagas disponíveis e restantes
async function mostrarInfoVagas(atividade_id) {
  if (!atividade_id) {
    infoVagas.textContent = "";
    return;
  }

  const atividade = listaAtividades.find((a) => a.id == atividade_id);
  if (!atividade) return;

  const { count, error } = await client
    .from("tbinscricoes")
    .select("*", { count: "exact", head: true })
    .eq("idatividade", atividade_id);

  if (error) {
    infoVagas.textContent = "Erro ao carregar informações de vagas.";
    return;
  }

  const vagasTotais = atividade.vagas;
  const vagasRestantes = Math.max(vagasTotais - count, 0);

  infoVagas.innerHTML = `
    <strong>Vagas totais:</strong> ${vagasTotais}<br>
    <strong>Vagas restantes:</strong> ${vagasRestantes}
  `;
}

async function salvarInscricao(nome, email, atividade_id) {
  // Busca atividade
  const { data: atividade, error: erroAtividade } = await client
    .from("tbatividades")
    .select("vagas")
    .eq("id", atividade_id)
    .single();

  if (erroAtividade) {
    console.error("Erro ao buscar atividade:", erroAtividade.message);
    alert("Erro ao verificar disponibilidade. Tente novamente.");
    return false;
  }

  // Conta quantos já estão inscritos
  const { count, error: erroContagem } = await client
    .from("tbinscricoes")
    .select("*", { count: "exact", head: true })
    .eq("idatividade", atividade_id);

  if (erroContagem) {
    console.error("Erro ao contar inscrições:", erroContagem.message);
    alert("Erro ao verificar vagas. Tente novamente.");
    return false;
  }

  if (count >= atividade.vagas) {
    alert("As vagas para este evento estão esgotadas!");
    return false;
  }

  // Verifica se o e-mail já está inscrito
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

  // Insere a inscrição
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

// Atualiza as vagas mostradas sempre que o usuário muda a seleção
selectAtividade.addEventListener("change", (e) => {
  mostrarInfoVagas(e.target.value);
});

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
    await mostrarInfoVagas(atividade_id); // atualiza vagas após inscrição
  }
});

// Carrega atividades ao abrir a página
carregarAtividades();
