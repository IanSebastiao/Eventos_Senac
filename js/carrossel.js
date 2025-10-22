// ===============================
// Inicialização do cliente Supabase
// ===============================
const SUPABASE_URL = "https://nahxbuzzmatdzrqaacrf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haHhidXp6bWF0ZHpycWFhY3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NDE4NTQsImV4cCI6MjA3NTAxNzg1NH0.wMiiiZZ3ZWxRy_RD_bRjHU4ck9tFpi1Ey8CPwFG18tQ";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===============================
// Lógica do Carrossel
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  const carousel = document.querySelector(".carousel"); // <div class="carousel">
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const container = document.querySelector(".carousel-container");

  let eventos = [];
  let currentIndex = 0;
  let autoSlideInterval;

  try {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    // Busca os eventos
    const { data, error } = await supabase
      .from("tbatividades")
      .select("*")
      .order("data", { ascending: true });

    if (error) throw error;

    // Filtra eventos futuros do mês atual
    eventos = data.filter((ev) => {
      const dataEvento = new Date(ev.data);
      return (
        dataEvento >= hoje &&
        dataEvento.getMonth() + 1 === mesAtual &&
        dataEvento.getFullYear() === anoAtual
      );
    });

    if (eventos.length === 0) {
      carousel.innerHTML = `<p>Nenhum evento disponível este mês.</p>`;
      return;
    }

    renderEvento(currentIndex);
    renderIndicators();

    // Botões manuais
    prevBtn.addEventListener("click", () => {
      mudarSlide(-1);
      reiniciarAutoSlide();
    });

    nextBtn.addEventListener("click", () => {
      mudarSlide(1);
      reiniciarAutoSlide();
    });

    // Inicia o auto-slide (a cada 6 segundos)
    iniciarAutoSlide();
  } catch (err) {
    console.error("Erro ao carregar eventos:", err);
    carousel.innerHTML = `<p>Erro ao carregar os eventos.</p>`;
  }

  // ===============================
  // Funções auxiliares
  // ===============================

  function renderEvento(index) {
    const evento = eventos[index];
    // Converte manualmente sem aplicar fuso horário
    const [ano, mes, dia] = evento.data.split("-").map(Number);
    const dataFormatada = `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}/${ano}`;
    // const dataFormatada = new Date(evento.data).toLocaleDateString("pt-BR", {
    //   day: "2-digit",
    //   month: "2-digit",
    //   year: "numeric",
    // });

    carousel.innerHTML = `
      <div class="carousel-item fade-in">
        <h3>${capitalize(evento.tipo)}: ${evento.titulo}</h3>
        <p>${dataFormatada} • ${evento.hora} • ${evento.palestrante || "A definir"}</p>
      </div>
    `;

    atualizarIndicadores(index);
  }

  function renderIndicators() {
    let indicatorsContainer = document.createElement("div");
    indicatorsContainer.className = "carousel-indicators";

    eventos.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "indicator";
      dot.addEventListener("click", () => {
        currentIndex = i;
        renderEvento(currentIndex);
        reiniciarAutoSlide();
      });
      indicatorsContainer.appendChild(dot);
    });

    container.appendChild(indicatorsContainer);
    atualizarIndicadores(currentIndex);
  }

  function atualizarIndicadores(index) {
    const dots = document.querySelectorAll(".indicator");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function mudarSlide(direcao) {
    currentIndex = (currentIndex + direcao + eventos.length) % eventos.length;
    renderEvento(currentIndex);
  }

  function iniciarAutoSlide() {
    autoSlideInterval = setInterval(() => {
      mudarSlide(1);
    }, 6000);
  }

  function reiniciarAutoSlide() {
    clearInterval(autoSlideInterval);
    iniciarAutoSlide();
  }

  function capitalize(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
});