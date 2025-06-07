// js/biblioteca.js

// --- Dados (carregados do localStorage) ---
let livros = [];
let banners = [];
let generos = [];

// Função para carregar dados do localStorage
function carregarDadosDoLocalStorage() {
    const livrosSalvos = localStorage.getItem('livrosBiblioteca');
    const bannersSalvos = localStorage.getItem('bannersBiblioteca');
    const generosSalvos = localStorage.getItem('generosBiblioteca');

    if (livrosSalvos) {
        livros = JSON.parse(livrosSalvos);
    } else {
        livros = [];
    }

    if (bannersSalvos) {
        banners = JSON.parse(bannersSalvos);
    } else {
        banners = [];
    }

    if (generosSalvos) {
        generos = JSON.parse(generosSalvos);
    } else {
        generos = [];
    }
}

// --- Funções de Renderização ---

function renderizarBanners() {
    const bannerContainer = document.getElementById('bannerDestaques');
    if (!bannerContainer) return;

    if (banners.length === 0) {
        bannerContainer.innerHTML = `
            <div class="carousel-item active">
                <img src="https://via.placeholder.com/1200x250?text=Nenhum+Destaque+Disponível" class="d-block w-100" alt="Nenhum banner">
                <div class="carousel-caption d-none d-md-block">
                    <h5>Aguarde por novos destaques da biblioteca!</h5>
                </div>
            </div>
        `;
        return;
    }

    bannerContainer.innerHTML = banners.map((banner, index) => {
        // Estilos inline para cor e família da fonte
        const textStyle = `color: ${banner.textColor || '#FFFFFF'}; font-family: ${banner.fontFamily || 'Arial, sans-serif'};`;

        // Classes para tamanho da fonte e alinhamento do texto
        // As classes 'banner-text-small', 'banner-text-medium', etc., e 'text-start', 'text-center', 'text-end'
        // serão definidas no CSS.
        const textSizeClass = `banner-text-${banner.textSize || 'medium'}`;
        const textPositionClass = `text-${banner.textPosition || 'center'}`; // Bootstrap classes for text alignment

        return `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${banner.imagem}" class="d-block w-100" alt="${banner.descricao}" style="object-position: ${banner.position || 'center'};">
                <div class="carousel-caption d-none d-md-block ${textPositionClass}">
                    <h5 class="${textSizeClass}" style="${textStyle}">${banner.descricao}</h5>
                </div>
            </div>
        `;
    }).join('');

    // Re-inicializa o carrossel do Bootstrap
    const carouselElement = document.getElementById('carouselDestaques');
    if (carouselElement && !bootstrap.Carousel.getInstance(carouselElement)) {
        new bootstrap.Carousel(carouselElement, { interval: 5000, wrap: true, keyboard: true });
    } else if (carouselElement) {
        bootstrap.Carousel.getInstance(carouselElement).cycle();
    }
}

function renderizarLivrosPorGenero() {
    const generosContainer = document.getElementById('generosContainer');
    if (!generosContainer) return;

    generosContainer.innerHTML = ''; // Limpa o conteúdo existente

    if (livros.length === 0) {
        generosContainer.innerHTML = '<p class="text-muted text-center">Nenhum livro disponível no momento. Volte em breve!</p>';
        return;
    }

    const generosUnicos = [...new Set(livros.map(l => l.genero))].filter(g => g && g.trim() !== '').sort();

    if (generosUnicos.length === 0) {
        generosContainer.innerHTML = '<p class="text-muted text-center">Nenhum gênero disponível ou livros sem gênero definido.</p>';
        return;
    }

    generosUnicos.forEach(genero => {
        const livrosDoGenero = livros.filter(l => l.genero === genero);

        if (livrosDoGenero.length > 0) {
            const generoSection = document.createElement('div');
            generoSection.className = 'genero-section mb-4';
            generoSection.innerHTML = `
                <h3 class="mb-3">${genero}</h3>
                <div class="row livros-grid">
                    ${livrosDoGenero.map(livro => `
                        <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
                            <div class="livro-card" onclick="exibirDetalhesLivro(${livro.id})">
                                <img src="${livro.capa || 'https://via.placeholder.com/120x180?text=Sem+Capa'}" alt="Capa de ${livro.titulo}">
                                <h5>${livro.titulo}</h5>
                                <p class="text-muted">${livro.autor}</p>
                                <p class="status-${livro.status}">${livro.status === 'disponivel' ? 'Disponível' : 'Emprestado'}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            generosContainer.appendChild(generoSection);
        }
    });

    // Se após renderizar, o container de gêneros ainda estiver vazio (ex: só tem livros sem gênero, etc.)
    if (generosContainer.innerHTML === '') {
        generosContainer.innerHTML = '<p class="text-muted text-center">Nenhum livro disponível no momento. Volte em breve!</p>';
    }
}

/**
 * Abre o modal de detalhes do livro e preenche com as informações do livro.
 * @param {number} id - O ID do livro a ser exibido.
 */
function exibirDetalhesLivro(id) {
    const livro = livros.find(l => l.id === id);
    if (!livro) {
        console.error('Livro não encontrado para o ID:', id);
        return;
    }

    document.getElementById('modalCapaLivro').src = livro.capa || 'https://via.placeholder.com/150x225?text=Sem+Capa';
    document.getElementById('modalCapaLivro').alt = `Capa de ${livro.titulo}`;
    document.getElementById('modalTituloLivro').textContent = livro.titulo;
    document.getElementById('modalAutorLivro').textContent = livro.autor;
    document.getElementById('modalGeneroLivro').textContent = livro.genero || 'N/A';
    document.getElementById('modalIsbnLivro').textContent = livro.isbn || 'N/A';
    document.getElementById('modalResumoLivro').textContent = livro.resumo || 'Nenhum resumo disponível.';

    const statusElement = document.getElementById('modalStatusLivro');
    statusElement.textContent = `Status: ${livro.status === 'disponivel' ? 'Disponível' : 'Emprestado'}`;
    statusElement.className = `status mt-3 status-${livro.status}`; // Aplica a classe de estilo

    const livroDetalhesModal = new bootstrap.Modal(document.getElementById('livroDetalhesModal'));
    livroDetalhesModal.show();
}


// --- Inicialização ---
document.addEventListener("DOMContentLoaded", () => {
    carregarDadosDoLocalStorage();
    renderizarBanners();
    renderizarLivrosPorGenero(); // Chama a função para renderizar os livros
});

