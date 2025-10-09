// Inicializa o cliente Supabase corretamente
const SUPABASE_URL = "https://nahxbuzzmatdzrqaacrf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haHhidXp6bWF0ZHpycWFhY3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NDE4NTQsImV4cCI6MjA3NTAxNzg1NH0.wMiiiZZ3ZWxRy_RD_bRjHU4ck9tFpi1Ey8CPwFG18tQ";
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function carregarEventos() {
  const container = document.getElementById("cards-container");
  container.innerHTML = "<p>Carregando eventos...</p>";

  try {
    // Busca os registros da tabela "atividades"
    const { data, error } = await client
      .from("tbatividades")
      .select("*")
      .order("data", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = "<p>Nenhum evento encontrado.</p>";
      return;
    }

    const hoje = new Date();
    // Monta os cards
    container.innerHTML = data
      .map((evento) => {
        const tipoClasse = evento.tipo?.toLowerCase().replace(/\s+/g, "-") || "evento";
        const dataEvento = new Date(evento.data);
        const dataFormatada = new Date(evento.data).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        const eventoPassado = dataEvento < hoje;

        const botao = eventoPassado
          ? `<button class="card evento-passado" disabled> Encerrado</button>`
          : `<a href="inscricao.html?id=${evento.id}" class="btn-inscrever">Inscreva-se</a>`;

        return `
          <div class="card">
            <span class="badge ${tipoClasse}">${evento.tipo}</span>
            <h3>${evento.titulo}</h3>
            <p><strong>Data:</strong> ${dataFormatada} - <strong>Hora:</strong> ${evento.hora}</p>
            <p><strong>Palestrante:</strong> ${evento.palestrante}</p>
            ${botao}
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.error("Erro ao carregar eventos:", err.message);
    container.innerHTML = "<p>Erro ao carregar eventos.</p>";
  }
}

document.addEventListener("DOMContentLoaded", carregarEventos);