// ===============================
// Inicialização do cliente Supabase
// ===============================
const SUPABASE_URL = "https://nahxbuzzmatdzrqaacrf.supabase.co";
const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haHhidXp6bWF0ZHpycWFhY3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NDE4NTQsImV4cCI6MjA3NTAxNzg1NH0.wMiiiZZ3ZWxRy_RD_bRjHU4ck9tFpi1Ey8CPwFG18tQ";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===============================
// ELEMENTOS DOM
// ===============================
const form = document.getElementById("atividadeForm");
const tabela = document.querySelector("#tabelaAtividades tbody");
const fotoInput = document.getElementById("foto");
const preview = document.getElementById("preview-img");

let idEditando = null;

// ===============================
// VERIFICA SE ESTÁ LOGADO
// ===============================
async function verificarLogin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "login.html";
    }
    return user;
}

// ===============================
// PRÉ-VISUALIZAÇÃO DE IMAGEM
// ===============================
fotoInput.addEventListener("change", () => {
    const file = fotoInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = "none";
    }
});

// ===============================
// SALVAR ATIVIDADE (somente se logado)
// ===============================
form.addEventListener("submit", async e => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("Você precisa estar logado para cadastrar atividades!");
        return;
    }

    const atividade = {
        titulo: form.titulo.value,
        tipo: form.tipo.value,
        data: form.data.value,
        hora: form.hora.value,
        palestrante: form.palestrante.value,
        descricao: form.descricao.value,
        local: form.local.value,
        vagas: parseInt(form.vagas.value) || null,
    };

    // Upload da imagem (se existir)
    const file = fotoInput.files[0];
    if (file) {
        const nomeArquivo = `${Date.now()}_${file.name}`;
        const caminhoArquivo = `uploads/${nomeArquivo}`;

        const { error: uploadError } = await supabase.storage
            .from("fotos_atividades")
            .upload(caminhoArquivo, file);

        if (uploadError) {
            alert("Erro ao enviar imagem: " + uploadError.message);
            return;
        }

        const { data: publicUrlData } = supabase.storage
            .from("fotos_atividades")
            .getPublicUrl(caminhoArquivo);

        atividade.foto = publicUrlData.publicUrl;
    }

    // Inserir ou atualizar
    if (idEditando) {
        const { error } = await supabase
            .from("tbatividades")
            .update(atividade)
            .eq("id", idEditando);

        if (error) alert("Erro ao atualizar atividade!");
        else alert("Atividade atualizada!");
        idEditando = null;
    } else {
        const { error } = await supabase.from("tbatividades").insert([atividade]);
        if (error) alert("Erro ao cadastrar!");
        else alert("Atividade cadastrada!");
    }

    form.reset();
    preview.style.display = "none";
    carregarAtividades();
});

// ===============================
// CARREGAR ATIVIDADES
// ===============================
async function carregarAtividades() {
    const { data, error } = await supabase
        .from("tbatividades")
        .select("*")
        .order("data", { ascending: true });

    if (error) {
        console.error("Erro ao carregar atividades", error);
        return;
    }

    tabela.innerHTML = "";
    data.forEach(atividade => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td data-label="Título">${atividade.titulo}</td>
      <td data-label="Data">${atividade.data}</td>
      <td data-label="Hora">${atividade.hora}</td>
      <td data-label="Palestrante">${atividade.palestrante}</td>
      <td data-label="Ações">
        <button class="editar"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="excluir"><i class="fa-solid fa-trash"></i></button>
        <button class="ver-inscritos"><i class="fa-solid fa-users"></i></button>
      </td>
    `;

        tr.querySelector(".editar").addEventListener("click", () => editarAtividade(atividade));
        tr.querySelector(".excluir").addEventListener("click", () => excluirAtividade(atividade.id));
        tr.querySelector(".ver-inscritos").addEventListener("click", () => {
            window.location.href = `inscritos.html?id=${atividade.id}`;
        });

        tabela.appendChild(tr);
    });
}

// ===============================
// EDITAR ATIVIDADE
// ===============================
function editarAtividade(atividade) {
    idEditando = atividade.id;
    form.titulo.value = atividade.titulo;
    form.tipo.value = atividade.tipo;
    form.data.value = atividade.data;
    form.hora.value = atividade.hora;
    form.palestrante.value = atividade.palestrante;
    form.descricao.value = atividade.descricao;
    form.local.value = atividade.local;
    form.vagas.value = atividade.vagas;
    if (atividade.foto) {
        preview.src = atividade.foto;
        preview.style.display = "block";
    } else {
        preview.style.display = "none";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===============================
// EXCLUIR ATIVIDADE
// ===============================
async function excluirAtividade(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("Você precisa estar logado para excluir atividades!");
        return;
    }

    if (!confirm("Deseja realmente excluir esta atividade?")) return;

    const { error } = await supabase.from("tbatividades").delete().eq("id", id);
    if (error) {
        alert("Erro ao excluir!");
    } else {
        alert("Atividade excluída!");
        carregarAtividades();
    }
}

// ===============================
// INICIALIZA
// ===============================
(async () => {
    await verificarLogin();
    carregarAtividades();
})();
