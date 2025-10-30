function createHeader() {
    // Create head elements
    const headElements = `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Eventos Senac CEP Catalão</title>
        <link rel="stylesheet" href="css/style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    `;
    document.head.insertAdjacentHTML('beforeend', headElements);

    // Create header HTML
    const headerHTML = `
        <header class="site-header">
            <h1>Eventos Senac CEP Catalão</h1>
            <nav class="navbar">
                <button class="menu-toggle" aria-label="Abrir menu">
                    <i class="fas fa-bars"></i>
                </button>
                <ul class="nav-links">
                    <li><a href="index.html"><img src="images/logosenac.png" alt="logosenac"></a></li>
                    <li><a href="index.html"><i class="fas fa-home"></i> Home</a></li>
                    <li><a href="programacao.html"><i class="fas fa-calendar-alt"></i> Programação</a></li>
                    <li><a href="inscricao.html"><i class="fas fa-address-book"></i> Inscrição</a></li>
                    <li><a href="sobre.html"><i class="fas fa-info-circle"></i> Sobre</a></li>
                    <li><a href="gestao.html" id="gestao" style="display: none;"><i class="fas fa-cog"></i> Gestão</a></li>
                    <li><a href="cadastro.html" id="cadastro" style="display: none;"><i class="fa-sharp fa-regular fa-user"></i></i> Cadastro</a></li>
                </ul>
                <div class="auth-area">
                    <button id="auth-btn" class="btn-auth">Admin</button>
                </div>
            </nav>
        </header>
    `;

    // Insert header at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Set active class for current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Call the function when DOM is loaded
document.addEventListener('DOMContentLoaded', createHeader);
