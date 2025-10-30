const galeriaContainer = document.querySelector('#galeria .cards-container');

async function carregarGaleria() {
    try {
        const { data, error } = await supabase
            .from('tbatividades')
            .select('id, titulo, descricao, palestrante, data, foto')
            .not('foto', 'is', null)
            .order('data', { ascending: true });
        if (error) {
            throw error;
        }

        galeriaContainer.innerHTML = '';
        galeriaContainer.innerHTML = '';

        if (!data || data.length === 0) {
            galeriaContainer.innerHTML = '<p>Nenhuma imagem de evento cadastrada ainda.</p>';
            return;
        }

        data.forEach((atividade) => {
            const figure = document.createElement('figure');
            figure.classList.add('card');

            const img = document.createElement('img');
            img.classList.add('card-img');
            img.src = atividade.foto;
            img.alt = atividade.titulo;

            const figcaption = document.createElement('figcaption');
            const h3 = document.createElement('h3');
            h3.classList.add('h3-img')
            h3.textContent = atividade.titulo;

            const pDesc = document.createElement('p');
            pDesc.textContent = atividade.descricao || "Sem descrição disponível.";

            const pInfo = document.createElement('p');
            const dataFormatada = atividade.data
                ? new Date(atividade.data).toLocaleDateString('pt-BR')
                : "";
            if (dataFormatada || atividade.palestrante) {
                pInfo.innerHTML = `<strong>${dataFormatada}</strong> ${atividade.palestrante
                    ? `- ${atividade.palestrante}`
                    : ''}`;
            }

            figcaption.appendChild(h3);
            figcaption.appendChild(pDesc);
            if (dataFormatada || atividade.palestrante) {
                figcaption.appendChild(pInfo);
            }
            figure.appendChild(img);
            figure.appendChild(figcaption);
            galeriaContainer.appendChild(figure);
        });
    } catch (err) {
        console.error('Erro ao carregar a galeria:', err.message);
        galeriaContainer.innerHTML = '<p>Erro ao carregar a galeria de imagens.</p>';
    }

}

document.addEventListener('DOMContentLoaded', carregarGaleria);