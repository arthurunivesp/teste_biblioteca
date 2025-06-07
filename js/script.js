// --- Dados Mock (simulados em memória) ---
// Em um sistema real, estes dados viriam de um Backend (API) e seriam persistentes.
// ESTES DADOS INICIAIS SÃO USADOS APENAS SE O LOCALSTORAGE ESTIVER VAZIO
let livros = [];
let banners = [];
let generos = [];

// Função para salvar dados no localStorage
function salvarDadosNoLocalStorage() {
    localStorage.setItem('livrosBiblioteca', JSON.stringify(livros));
    localStorage.setItem('bannersBiblioteca', JSON.stringify(banners));
    localStorage.setItem('generosBiblioteca', JSON.stringify(generos));
}

// Função para carregar dados do localStorage ou usar mocks se não existirem
function carregarDadosDoLocalStorageOuMock() {
    const livrosSalvos = localStorage.getItem('livrosBiblioteca');
    const bannersSalvos = localStorage.getItem('bannersBiblioteca');
    const generosSalvos = localStorage.getItem('generosBiblioteca');

    if (livrosSalvos) {
        livros = JSON.parse(livrosSalvos);
    } else {
        livros = [
            { id: 1, isbn: "978-8535902778", titulo: "O Senhor dos Anéis", autor: "J.R.R. Tolkien", resumo: "Uma jornada épica para destruir um anel maligno e salvar a Terra Média.", capa: "https://m.media-amazon.com/images/I/71jQ1z563pL._AC_UF1000,1000_QL80_.jpg", genero: "Fantasia", status: "disponivel" },
            { id: 2, isbn: "978-8535900277", titulo: "1984", autor: "George Orwell", resumo: "Em um futuro distópico, a vigilância onipresente e a manipulação da verdade controlam a sociedade.", capa: "https://m.media-amazon.com/images/I/71+h2bB+B2L._AC_UF1000,1000_QL80_.jpg", genero: "Distopia", status: "emprestado" },
            { id: 3, isbn: "978-8535900284", titulo: "Orgulho e Preconceito", autor: "Jane Austen", resumo: "A história de amor e mal-entendidos entre Elizabeth Bennet e o Sr. Darcy na Inglaterra do século XIX.", capa: "https://m.media-amazon.com/images/I/81B436v4NGL._AC_UF1000,1000_QL80_.jpg", genero: "Romance", status: "disponivel" },
            { id: 4, isbn: "978-8535900291", titulo: "Duna", autor: "Frank Herbert", resumo: "Em um futuro distante, a luta pelo controle de um planeta desértico, única fonte de uma especiaria vital.", capa: "https://m.media-amazon.com/images/I/71u9t2K6QeL._AC_UF1000,1000_QL80_.jpg", genero: "Ficção Científica", status: "disponivel" },
            { id: 5, isbn: "978-8535900307", titulo: "Dom Quixote", autor: "Miguel de Cervantes", resumo: "Um fidalgo que enlouquece lendo romances de cavalaria e decide se tornar um cavaleiro andante.", capa: "https://m.media-amazon.com/images/I/61K5661Xv-L._AC_UF1000,1000_QL80_.jpg", genero: "Clássico", status: "disponivel" },
        ];
    }

    if (bannersSalvos) {
        banners = JSON.parse(bannersSalvos);
    } else {
        // Mock de banners com novas propriedades
        banners = [
            { id: 1, imagem: "https://via.placeholder.com/1200x250?text=Novos+Lançamentos", descricao: "Confira os últimos lançamentos!", position: "center", textColor: "#FFFFFF", fontFamily: "Arial, sans-serif", textSize: "medium", textPosition: "center" },
            { id: 2, imagem: "https://via.placeholder.com/1200x250?text=Promoção+da+Semana", descricao: "Descontos imperdíveis!", position: "center", textColor: "#FFFF00", fontFamily: "Verdana, sans-serif", textSize: "large", textPosition: "end" },
            { id: 3, imagem: "https://via.placeholder.com/1200x250?text=Participe+dos+Eventos", descricao: "Participe dos nossos eventos!", position: "center", textColor: "#0000FF", fontFamily: "Tahoma, sans-serif", textSize: "small", textPosition: "start" },
        ];
    }

    if (generosSalvos) {
        generos = JSON.parse(generosSalvos);
    } else {
        generos = [...new Set(livros.map(l => l.genero))];
    }
    // Garante que 'Outros' existe na lista de gêneros se já houver livros com esse gênero
    if (livros.some(l => l.genero === 'Outros') && !generos.includes('Outros')) {
        generos.push('Outros');
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
        // Criar estilos inline para a cor e fonte, e classes para o tamanho e posição
        const textStyle = `color: ${banner.textColor || '#FFFFFF'}; font-family: ${banner.fontFamily || 'Arial, sans-serif'};`;
        const textSizeClass = `banner-text-${banner.textSize || 'medium'}`;
        const textPositionClass = `banner-caption-${banner.textPosition || 'center'}`;

        return `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${banner.imagem}" class="d-block w-100" alt="${banner.descricao}" style="object-position: ${banner.position || 'center'};">
                <div class="carousel-caption d-none d-md-block ${textPositionClass}">
                    <h5 class="${textSizeClass}" style="${textStyle}">${banner.descricao}</h5>
                </div>
            </div>
        `;
    }).join('');

    const carouselElement = document.getElementById('carouselDestaques');
    if (carouselElement && !bootstrap.Carousel.getInstance(carouselElement)) {
        new bootstrap.Carousel(carouselElement, { interval: 5000, wrap: true, keyboard: true });
    } else if (carouselElement) {
        bootstrap.Carousel.getInstance(carouselElement).cycle();
    }
}

function renderizarListaBannersGerenciamento() {
    const lista = document.getElementById('listaBannersGerenciamento');
    if (!lista) return;

    lista.innerHTML = '';
    banners.forEach(banner => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <img src="${banner.imagem}" alt="${banner.descricao}" class="banner-thumb">
            <span>${banner.descricao} (ID: ${banner.id})</span>
            <div>
                <button class="btn btn-sm btn-warning me-2" onclick="abrirModalEditarBanner(${banner.id})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-danger" onclick="excluirBanner(${banner.id})"><i class="bi bi-trash"></i></button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function preencherSelectGeneros() {
    const selectGenero = document.getElementById('generoLivroSelect');
    if (!selectGenero) return;

    selectGenero.innerHTML = '<option value="">Selecione um Gênero</option>';
    selectGenero.innerHTML += '<option value="__novo__">-- Adicionar Novo Gênero --</option>';

    const generosUnicos = [...new Set(generos.filter(g => g && g.trim() !== ''))].sort();

    generosUnicos.forEach(genero => {
        if (genero === '__novo__') return;
        const option = document.createElement('option');
        option.value = genero;
        option.textContent = genero;
        selectGenero.appendChild(option);
    });

    const novoGeneroInputGroup = document.getElementById('novoGeneroInputGroup');
    if (novoGeneroInputGroup) {
        novoGeneroInputGroup.style.display = 'none';
        document.getElementById('novoGeneroInput').value = '';
    }
}

function toggleNovoGeneroInput() {
    const generoSelect = document.getElementById('generoLivroSelect');
    const novoGeneroInputGroup = document.getElementById('novoGeneroInputGroup');
    if (generoSelect.value === '__novo__') {
        novoGeneroInputGroup.style.display = 'block';
    } else {
        novoGeneroInputGroup.style.display = 'none';
    }
}

function renderizarListaGenerosGerenciamento() {
    const listaGeneros = document.getElementById('listaGenerosGerenciamento');
    if (!listaGeneros) return;

    listaGeneros.innerHTML = '';
    if (generos.length === 0) {
        listaGeneros.innerHTML = '<li class="list-group-item text-muted">Nenhum gênero cadastrado.</li>';
        return;
    }

    const generosOrdenados = [...generos].sort();

    generosOrdenados.forEach(genero => {
        const countLivros = livros.filter(l => l.genero === genero).length;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <span>${genero} (${countLivros} livros)</span>
            <div>
                <button class="btn btn-sm btn-danger" onclick="excluirGenero('${genero}')">
                    <i class="bi bi-trash"></i> Excluir
                </button>
            </div>
        `;
        listaGeneros.appendChild(li);
    });
}

// --- Funções de Gerenciamento de Banners ---

function adicionarBanner() {
    const bannerFile = document.getElementById('bannerImageFile').files[0];
    const descricao = document.getElementById('bannerDescricao').value.trim();
    const textColor = document.getElementById('bannerTextColor').value;
    const fontFamily = document.getElementById('bannerFontFamily').value;
    const textSize = document.getElementById('bannerTextSize').value;
    const textPosition = document.getElementById('bannerTextPosition').value;
    const imagePosition = document.getElementById('bannerImagePosition').value;

    if (!bannerFile || !descricao) {
        alert('Por favor, selecione uma imagem e preencha a Descrição do banner.');
        return;
    }
    if (descricao.length > 80) { // Dupla verificação (já tem maxlength no HTML)
        alert('A descrição do banner não pode exceder 80 caracteres.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;

        const novoId = banners.length > 0 ? Math.max(...banners.map(b => b.id)) + 1 : 1;
        const novoBanner = {
            id: novoId,
            imagem: imageUrl,
            descricao: descricao,
            position: imagePosition, // 'object-position' da imagem
            textColor: textColor,
            fontFamily: fontFamily,
            textSize: textSize,
            textPosition: textPosition // 'justify-content' ou 'text-align' do caption
        };

        banners.push(novoBanner);
        salvarDadosNoLocalStorage();
        alert(`Banner "${descricao}" adicionado com sucesso!`);

        // Limpar formulário
        document.getElementById('formAdicionarBanner').reset();
        document.getElementById('bannerImagePreview').style.display = 'none';
        document.getElementById('bannerImagePreview').src = '#';
        // Resetar valores padrão para os selects de cor/fonte/tamanho/posição
        document.getElementById('bannerTextColor').value = '#FFFFFF';
        document.getElementById('bannerFontFamily').value = 'Arial, sans-serif';
        document.getElementById('bannerTextSize').value = 'medium';
        document.getElementById('bannerTextPosition').value = 'center';
        document.getElementById('bannerImagePosition').value = 'center';


        renderizarBanners();
        renderizarListaBannersGerenciamento();
    };
    reader.readAsDataURL(bannerFile);
}

function excluirBanner(id) {
    if (confirm(`Tem certeza que deseja excluir o banner ID ${id}?`)) {
        banners = banners.filter(b => b.id !== id);
        salvarDadosNoLocalStorage();
        alert(`Banner ID ${id} excluído.`);
        renderizarBanners();
        renderizarListaBannersGerenciamento();
    }
}

function abrirModalEditarBanner(id) {
    const banner = banners.find(b => b.id === id);
    if (!banner) return;

    // Usando prompts para simplificar a edição. Em um projeto maior, seria um modal Bootstrap
    let novaDescricao = prompt(`Editar descrição do banner ID ${id}: (Máx. 80 caracteres)`, banner.descricao);
    if (novaDescricao !== null) {
        novaDescricao = novaDescricao.trim();
        if (novaDescricao.length > 80) {
            alert('A descrição do banner não pode exceder 80 caracteres. Não salvo.');
            return;
        }
        banner.descricao = novaDescricao;

        const novaImagem = prompt(`Editar URL da imagem do banner ID ${id}: (Se vazio, manterá a atual. Não aceita upload de arquivo aqui, apenas URL)`, banner.imagem);
        if (novaImagem !== null && novaImagem.trim() !== '') {
            banner.imagem = novaImagem.trim();
        }

        const novaPosicaoImagem = prompt(`Ajustar posição da imagem (center, top, bottom, left, right) para o banner ID ${id}:`, banner.position || 'center');
        if (novaPosicaoImagem !== null && ['center', 'top', 'bottom', 'left', 'right'].includes(novaPosicaoImagem.toLowerCase())) {
            banner.position = novaPosicaoImagem.toLowerCase();
        } else if (novaPosicaoImagem !== null && novaPosicaoImagem.trim() !== '') {
            alert('Posição da imagem inválida. Mantendo a atual.');
        }

        const novaCorTexto = prompt(`Editar cor do texto (formato #RRGGBB, ex: #FF0000 para vermelho) para o banner ID ${id}:`, banner.textColor || '#FFFFFF');
        if (novaCorTexto !== null && novaCorTexto.trim().match(/^#[0-9A-Fa-f]{6}$/)) { // Valida formato hex
            banner.textColor = novaCorTexto.trim();
        } else if (novaCorTexto !== null && novaCorTexto.trim() !== '') {
            alert('Formato de cor inválido (ex: #FF0000). Mantendo a cor atual.');
        }

        const novaFonte = prompt(`Editar família da fonte (ex: Arial, sans-serif) para o banner ID ${id}:`, banner.fontFamily || 'Arial, sans-serif');
        if (novaFonte !== null && novaFonte.trim() !== '') {
            banner.fontFamily = novaFonte.trim();
        }

        const novoTamanhoTexto = prompt(`Editar tamanho do texto (small, medium, large, x-large) para o banner ID ${id}:`, banner.textSize || 'medium');
        if (novoTamanhoTexto !== null && ['small', 'medium', 'large', 'x-large'].includes(novoTamanhoTexto.toLowerCase())) {
            banner.textSize = novoTamanhoTexto.toLowerCase();
        } else if (novoTamanhoTexto !== null && novoTamanhoTexto.trim() !== '') {
            alert('Tamanho de texto inválido. Mantendo o tamanho atual.');
        }

        const novaPosicaoTexto = prompt(`Editar posição do texto (start, center, end) para o banner ID ${id}:`, banner.textPosition || 'center');
        if (novaPosicaoTexto !== null && ['start', 'center', 'end'].includes(novaPosicaoTexto.toLowerCase())) {
            banner.textPosition = novaPosicaoTexto.toLowerCase();
        } else if (novaPosicaoTexto !== null && novaPosicaoTexto.trim() !== '') {
            alert('Posição do texto inválida. Mantendo a posição atual.');
        }

        salvarDadosNoLocalStorage();
        alert(`Banner ID ${id} atualizado.`);
        renderizarBanners();
        renderizarListaBannersGerenciamento();
    }
}

// --- Funções de Gerenciamento de Livros (Adicionar, Emprestar, Devolver, Pesquisar, Editar, Excluir) ---

function adicionarLivro() {
    const isbn = document.getElementById('livroISBN').value.trim();
    const titulo = document.getElementById('tituloLivro').value.trim();
    const autor = document.getElementById('autorLivro').value.trim();
    const resumo = document.getElementById('resumoLivro').value.trim();
    const capaFile = document.getElementById('capaLivroFile').files[0];
    const generoSelectValue = document.getElementById('generoLivroSelect').value;
    const novoGeneroInput = document.getElementById('novoGeneroInput').value.trim();

    let generoFinal;

    if (generoSelectValue === '__novo__') {
        generoFinal = novoGeneroInput;
        if (!generoFinal) {
            alert('Por favor, digite o nome para o novo gênero.');
            return;
        }
        if (!generos.includes(generoFinal)) {
            generos.push(generoFinal);
        }
    } else if (generoSelectValue) {
        generoFinal = generoSelectValue;
    } else {
        alert('Por favor, selecione ou adicione um Gênero para o livro.');
        return;
    }

    if (!titulo || !autor || !generoFinal || !resumo) {
        alert('Por favor, preencha Título, Autor, Resumo e Gênero do livro.');
        return;
    }

    // Verificar se o ISBN já existe (se fornecido)
    if (isbn && livros.some(l => l.isbn === isbn)) {
        alert('Já existe um livro com este ISBN. Por favor, verifique ou edite o livro existente.');
        return;
    }

    let capaUrl = 'https://via.placeholder.com/120x180?text=Sem+Capa';

    const criarEAdicionarLivro = (url) => {
        const novoId = livros.length > 0 ? Math.max(...livros.map(l => l.id)) + 1 : 1;
        const novoLivro = {
            id: novoId,
            isbn,
            titulo,
            autor,
            resumo,
            capa: url,
            genero: generoFinal,
            status: 'disponivel'
        };
        livros.push(novoLivro);
        salvarDadosNoLocalStorage();
        alert(`Livro "${titulo}" adicionado com sucesso! (ID: ${novoId})`);
        limparFormularioLivro();
        preencherSelectGeneros();
        renderizarListaGenerosGerenciamento();
    };

    if (capaFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            capaUrl = e.target.result;
            criarEAdicionarLivro(capaUrl);
        };
        reader.readAsDataURL(capaFile);
    } else {
        criarEAdicionarLivro(capaUrl);
    }
}

function limparFormularioLivro() {
    document.getElementById('livroISBN').value = '';
    document.getElementById('tituloLivro').value = '';
    document.getElementById('autorLivro').value = '';
    document.getElementById('resumoLivro').value = '';
    document.getElementById('capaLivroFile').value = '';
    document.getElementById('generoLivroSelect').value = '';
    document.getElementById('novoGeneroInput').value = '';
    const novoGeneroInputGroup = document.getElementById('novoGeneroInputGroup');
    if (novoGeneroInputGroup) {
        novoGeneroInputGroup.style.display = 'none';
    }
}

/**
 * Encontra um livro na lista por ID, ISBN, Título ou Autor.
 * @param {string} termoBusca - O termo de pesquisa.
 * @returns {object|null} O objeto livro encontrado ou null.
 */
function encontrarLivro(termoBusca) {
    const termoLower = termoBusca.toLowerCase();

    // Tenta encontrar por ID (numérico)
    if (!isNaN(parseInt(termoBusca))) {
        const livroPorId = livros.find(l => l.id === parseInt(termoBusca));
        if (livroPorId) return livroPorId;
    }

    // Tenta encontrar por ISBN (exato)
    const livroPorIsbn = livros.find(l => l.isbn && l.isbn.toLowerCase() === termoLower);
    if (livroPorIsbn) return livroPorIsbn;

    // Tenta encontrar por Título ou Autor (contém)
    const livroPorTituloAutor = livros.find(l =>
        l.titulo.toLowerCase().includes(termoLower) ||
        l.autor.toLowerCase().includes(termoLower)
    );
    if (livroPorTituloAutor) return livroPorTituloAutor;

    return null;
}

/**
 * Gerencia o empréstimo ou devolução de um livro.
 * @param {'emprestar'|'devolver'} acao - A ação a ser realizada.
 */
function gerenciarEmprestimoDevolucao(acao) {
    const inputId = (acao === 'emprestar') ? 'inputEmprestar' : 'inputDevolver';
    const termoBusca = document.getElementById(inputId).value.trim();

    if (!termoBusca) {
        alert(`Por favor, digite o ISBN, ID ou Título do livro para ${acao}.`);
        return;
    }

    const livro = encontrarLivro(termoBusca);

    if (!livro) {
        alert(`Livro com "${termoBusca}" não encontrado.`);
        return;
    }

    const novoStatus = (acao === 'emprestar') ? 'emprestado' : 'disponivel';
    const statusAtual = livro.status;

    if (acao === 'emprestar' && statusAtual === 'emprestado') {
        alert(`O livro "${livro.titulo}" já está emprestado.`);
        return;
    }
    if (acao === 'devolver' && statusAtual === 'disponivel') {
        alert(`O livro "${livro.titulo}" já está disponível.`);
        return;
    }

    livro.status = novoStatus;
    salvarDadosNoLocalStorage();
    alert(`Livro "${livro.titulo}" (ID: ${livro.id}) agora está ${novoStatus === 'disponivel' ? 'Disponível' : 'Emprestado'}.`);

    // Limpar o input e, se houver pesquisa, re-exibir o resultado
    document.getElementById(inputId).value = '';
    // Se a pesquisa estiver ativa, re-pesquisa para atualizar o status
    const inputPesquisaAdmin = document.getElementById('inputPesquisaLivro');
    if (inputPesquisaAdmin && inputPesquisaAdmin.value.trim()) {
        pesquisarLivroAdmin();
    }
}


/**
 * Pesquisa livros no painel administrativo e exibe os resultados.
 */
function pesquisarLivroAdmin() {
    const termoBusca = document.getElementById('inputPesquisaLivro').value.trim();
    const resultadoDiv = document.getElementById('resultadoPesquisaAdmin');
    resultadoDiv.innerHTML = '';

    if (!termoBusca) {
        resultadoDiv.innerHTML = '<p class="text-muted">Digite algo para pesquisar livros no sistema.</p>';
        return;
    }

    const resultados = livros.filter(l =>
        l.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        l.autor.toLowerCase().includes(termoBusca.toLowerCase()) ||
        (l.isbn && l.isbn.toLowerCase().includes(termoBusca.toLowerCase())) ||
        (l.id && l.id.toString() === termoBusca) // Permite pesquisa por ID exato
    );

    if (resultados.length > 0) {
        resultados.forEach(livroEncontrado => {
            resultadoDiv.innerHTML += `
                <div class="livro-card-admin d-flex flex-column align-items-center p-3 border rounded shadow-sm mb-3">
                    <img src="${livroEncontrado.capa || 'https://via.placeholder.com/120x180?text=Sem+Capa'}" alt="Capa do livro ${livroEncontrado.titulo}" style="max-width: 100px; height: auto;">
                    <h5>${livroEncontrado.titulo} (ID: ${livroEncontrado.id})</h5>
                    <p><strong>Autor:</strong> ${livroEncontrado.autor}</p>
                    <p><strong>Resumo:</strong> ${livroEncontrado.resumo || 'N/A'}</p>
                    <p>ISBN: ${livroEncontrado.isbn || 'N/A'}</p>
                    <p class="status-${livroEncontrado.status}">Status: ${livroEncontrado.status === 'disponivel' ? 'Disponível' : 'Emprestado'}</p>
                    <div class="mt-2">
                        <button class="btn btn-sm btn-warning me-2" onclick="abrirModalEditarLivro(${livroEncontrado.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="excluirLivro(${livroEncontrado.id})">Excluir</button>
                    </div>
                </div>
            `;
        });
    } else {
        resultadoDiv.innerHTML = '<p class="text-muted">Nenhum livro encontrado com o termo de pesquisa.</p>';
    }
}


function abrirModalEditarLivro(id) {
    const livro = livros.find(l => l.id === id);
    if (!livro) return;

    const novoTitulo = prompt(`Editar título do livro ID ${id}:`, livro.titulo);
    if (novoTitulo !== null) {
        livro.titulo = novoTitulo.trim();
        const novoAutor = prompt(`Editar autor do livro ID ${id}:`, livro.autor);
        if (novoAutor !== null) {
            livro.autor = novoAutor.trim();
            const novoResumo = prompt(`Editar breve resumo do livro ID ${id}:`, livro.resumo || '');
            if (novoResumo !== null) {
                livro.resumo = novoResumo.trim();
                const novaCapa = prompt(`Editar URL da capa do livro ID ${id}: (Atualmente não aceita upload de arquivo aqui, apenas URL)`, livro.capa);
                if (novaCapa !== null) {
                    livro.capa = novaCapa.trim();
                    const novoGenero = prompt(`Editar gênero do livro ID ${id}:`, livro.genero);
                    if (novoGenero !== null) {
                        livro.genero = novoGenero.trim();
                        if (!generos.includes(livro.genero)) {
                            generos.push(livro.genero);
                        }
                    }
                }
            }
        }
        salvarDadosNoLocalStorage();
        alert(`Livro ID ${id} atualizado.`);
        preencherSelectGeneros();
        renderizarListaGenerosGerenciamento();
        pesquisarLivroAdmin(); // Re-renderiza a pesquisa para mostrar os dados atualizados
    }
}

function excluirLivro(id) {
    if (confirm(`Tem certeza que deseja excluir o livro ID ${id}? Esta ação é irreversível!`)) {
        livros = livros.filter(l => l.id !== id);
        salvarDadosNoLocalStorage();
        alert(`Livro ID ${id} excluído.`);

        atualizarGenerosBaseadoEmLivros();
        preencherSelectGeneros();
        renderizarListaGenerosGerenciamento();
        document.getElementById('resultadoPesquisaAdmin').innerHTML = ''; // Limpa o resultado da pesquisa
    }
}

function excluirGenero(generoParaExcluir) {
    if (generoParaExcluir === 'Outros' && livros.some(l => l.genero === 'Outros')) {
        alert('Não é possível excluir o gênero "Outros" enquanto houver livros associados a ele. Ele é usado para realocar livros de gêneros excluídos.');
        return;
    }

    const livrosAssociados = livros.filter(l => l.genero === generoParaExcluir);
    let confirmacaoMensagem = `Tem certeza que deseja excluir o gênero "${generoParaExcluir}"? Esta ação é irreversível!`;

    if (livrosAssociados.length > 0) {
        confirmacaoMensagem += `\n\nATENÇÃO: Este gênero possui ${livrosAssociados.length} livro(s) associado(s).`;
        confirmacaoMensagem += `\n\nOpções para os livros associados:`;
        confirmacaoMensagem += `\n1. Mover para o gênero "Outros". (Recomendado, padrão)`;
        confirmacaoMensagem += `\n2. Excluir os livros junto com o gênero.`;
        confirmacaoMensagem += `\n\nDigite "1" para mover para "Outros" ou "2" para excluir os livros.`;
        confirmacaoMensagem += `\n(Ou clique em Cancelar para abortar).`;
    } else {
        confirmacaoMensagem += `\n\nEste gênero não possui livros associados.`;
    }

    const escolha = prompt(confirmacaoMensagem);

    if (escolha === null) {
        return;
    }

    if (livrosAssociados.length > 0) {
        if (escolha === '1') {
            livros.forEach(livro => {
                if (livro.genero === generoParaExcluir) {
                    livro.genero = 'Outros';
                }
            });
            if (!generos.includes('Outros')) {
                generos.push('Outros');
            }
            alert(`Gênero "${generoParaExcluir}" excluído. ${livrosAssociados.length} livro(s) movidos para "Outros".`);
        } else if (escolha === '2') {
            livros = livros.filter(l => l.genero !== generoParaExcluir);
            alert(`Gênero "${generoParaExcluir}" excluído. ${livrosAssociados.length} livro(s) também foram excluídos.`);
        } else {
            alert('Escolha inválida. Operação cancelada.');
            return;
        }
    } else {
        alert(`Gênero "${generoParaExcluir}" excluído.`);
    }

    generos = generos.filter(g => g !== generoParaExcluir);
    salvarDadosNoLocalStorage();

    preencherSelectGeneros();
    renderizarListaGenerosGerenciamento();
}

function atualizarGenerosBaseadoEmLivros() {
    const generosAtuaisDosLivros = [...new Set(livros.map(l => l.genero))];
    generos = [...new Set([...generosAtuaisDosLivros, ...generos])].filter(g => g && g.trim() !== '').sort();
    salvarDadosNoLocalStorage();
}


// --- Inicialização ---

document.addEventListener("DOMContentLoaded", () => {
    carregarDadosDoLocalStorageOuMock();
    atualizarGenerosBaseadoEmLivros(); // Garante que a lista de gêneros esteja atualizada com os livros existentes

    renderizarBanners(); // Renderiza na página admin para ter uma prévia básica
    renderizarListaBannersGerenciamento();
    preencherSelectGeneros();
    renderizarListaGenerosGerenciamento();

    const bannerImageFileInput = document.getElementById('bannerImageFile');
    const bannerImagePreview = document.getElementById('bannerImagePreview');

    if (bannerImageFileInput && bannerImagePreview) {
        bannerImageFileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    bannerImagePreview.src = e.target.result;
                    bannerImagePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                bannerImagePreview.src = '#';
                bannerImagePreview.style.display = 'none';
            }
        });
    }
});

