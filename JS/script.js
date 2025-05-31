const apiKey = "1e80412998daf360b634f59f4944b940";
const posterContainer = document.getElementById("posterContainer");
const genreList = document.getElementById("genreList");
const sectionTitle = document.getElementById("sectionTitle");
const input = document.getElementById("movieInput");

const paginationTop = document.getElementById("paginationTop");
const paginationBottom = document.getElementById("paginationBottom");

let activeGenre = null;
let currentPage = 1;
let totalPages = 1;
let currentQuery = "";
let currentFilter = "popular";
let currentMode = "default"; // "default", "search", "genre"

// recebe as categorias do filme.html e cadastro.html
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const generoId = urlParams.get("genero");
  const generoNome = urlParams.get("nome");

  if (generoId && generoNome) {
    // Modo gênero
    activeGenre = generoId;
    currentMode = "genre";
    currentPage = 1;
    sectionTitle.textContent = `Categoria: ${generoNome}`;
    carregarFilmesPorGenero(generoId, currentPage);
  } else {
    // Modo padrão
    carregarFilmes("popular", "Filmes em destaque");
  }
});




function fetchMovies() {
  posterContainer.innerHTML = ""; // Limpa o container

  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`)
    .then(res => res.json())
    .then(data => {
      const movies = data.results;

      movies.forEach(movie => {
        const movieElement = document.createElement("a");
        movieElement.href = `filme.html?id=${movie.id}`;
        movieElement.classList.add("card-filme"); // Você pode estilizar isso no CSS

        movieElement.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
          <p>${movie.title}</p>
        `;

        posterContainer.appendChild(movieElement);
      });
    })
    .catch(err => {
      console.error("Erro ao buscar filmes:", err);
    });
}

// Chamada ao carregar a página
fetchMovies();


// Buscar gêneros e preencher o menu
fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=pt-BR`)
  .then(res => res.json())
  .then(data => {
    data.genres.forEach(genre => {
      const li = document.createElement("li");
      li.textContent = genre.name;
      li.dataset.id = genre.id;
      genreList.appendChild(li);
    });
  });

// Quando clica em uma categoria
genreList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const genreId = e.target.dataset.id;
    const genreName = e.target.textContent;

    document.querySelectorAll("#genreList li").forEach(li => li.classList.remove("active"));
    e.target.classList.add("active");
    activeGenre = genreId;
    sectionTitle.textContent = `Categoria: ${genreName}`;
    input.value = "";
    currentPage = 1;
    currentMode = "genre";

    carregarFilmesPorGenero(genreId, currentPage);
  }
});

// Pesquisa por nome de filme
input.addEventListener("input", () => {
  const query = input.value.trim();

  if (query.length < 2) {
    posterContainer.innerHTML = "";
    sectionTitle.textContent = "Filmes em destaque";
    document.querySelectorAll("#genreList li").forEach(li => li.classList.remove("active"));
    activeGenre = null;
    currentMode = "default";
    limparPaginacao();
    return;
  }

  currentQuery = query;
  currentPage = 1;
  currentMode = "search";
  sectionTitle.textContent = `Resultados para: "${query}"`;
  carregarFilmesPesquisa(query, currentPage);
});

// Carrega filmes iniciais
window.addEventListener("DOMContentLoaded", () => {
  carregarFilmes("popular", "Filmes em destaque");
});

// Filtros: Mais assistidos e Novos
document.querySelectorAll(".filtro-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const filtro = btn.dataset.filter;
    const titulo = filtro === "popular" ? "Mais assistidos" : "Lançamentos recentes";

    input.value = "";
    sectionTitle.textContent = titulo;
    document.querySelectorAll("#genreList li").forEach(li => li.classList.remove("active"));
    activeGenre = null;
    currentPage = 1;
    currentFilter = filtro;
    currentMode = "default";

    carregarFilmes(filtro, titulo);
  });
});

// Função para carregar filmes por tipo
function carregarFilmes(tipo, titulo) {
  fetch(`https://api.themoviedb.org/3/movie/${tipo}?api_key=${apiKey}&language=pt-BR&page=${currentPage}`)
    .then(res => res.json())
    .then(data => {
      sectionTitle.textContent = titulo;
      renderizarFilmes(data.results);
      totalPages = data.total_pages;
      renderizarPaginacao();
    });
}

// Função para carregar filmes por pesquisa
function carregarFilmesPesquisa(query, page) {
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR&page=${page}`)
    .then(res => res.json())
    .then(data => {
      renderizarFilmes(data.results);
      totalPages = data.total_pages;
      renderizarPaginacao();
    });
}

// Função para carregar filmes por gênero
function carregarFilmesPorGenero(genreId, page) {
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=pt-BR&page=${page}`)
    .then(res => res.json())
    .then(data => {
      renderizarFilmes(data.results);
      totalPages = data.total_pages;
      renderizarPaginacao();
    });
}

// Renderiza os filmes na tela com links
function renderizarFilmes(listaDeFilmes) {
  posterContainer.innerHTML = ""; //limpa
  posterContainer.style.opacity = "0";//ocultando né

  const spinner = document.getElementById("loadingSpinner");
  spinner.style.display = "block";


  const moviesToShow = listaDeFilmes.filter(movie => movie.poster_path);
  let imagesLoaded = 0;

  // estiloso
  moviesToShow.forEach(movie => {
    const img = new Image();
    img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
    img.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === moviesToShow.length) {
        // spinner some
        spinner.style.display = "none";
        // exibe os cardass
        moviesToShow.forEach(createMovieCard);
        posterContainer.style.opacity = "1";
      }
    };
  });

  function createMovieCard(movie) {
    const card = document.createElement("a");
    card.href = `filme.html?id=${movie.id}`;
    card.classList.add("movie-card");
  
    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
      <div class="title">${movie.title}</div>
    `;
  
    posterContainer.appendChild(card);
  }
  

  // Esse mostrava mas atrapalhava tudin
  // listaDeFilmes.forEach(filme => {
  //   if (!filme.poster_path) return;

  //   const card = document.createElement("a");
  //   card.href = `filme.html?id=${filme.id}`;
  //   card.classList.add("movie-card");

  //   card.innerHTML = `
  //     <img src="https://image.tmdb.org/t/p/w300${filme.poster_path}" alt="${filme.title}">
  //     <div class="title">${filme.title}</div>
  //   `;

  //   posterContainer.appendChild(card);
  // });
}

// Renderiza a paginação
function renderizarPaginacao() {
  paginationTop.innerHTML = "";
  paginationBottom.innerHTML = "";

  const paginacaoTop = criarPaginacao();
  const paginacaoBottom = criarPaginacao();

  paginationTop.appendChild(paginacaoTop);
  paginationBottom.appendChild(paginacaoBottom);
}

// Cria os botões de paginação
function criarPaginacao() {
  const paginacao = document.createElement("div");
  paginacao.className = "pagination-buttons";

  const anterior = document.createElement("button");
  anterior.textContent = "Anterior";
  anterior.disabled = currentPage === 1;
  anterior.addEventListener("click", () => mudarPagina(currentPage - 1));

  const proximo = document.createElement("button");
  proximo.textContent = "Próxima";
  proximo.disabled = currentPage >= totalPages;
  proximo.addEventListener("click", () => mudarPagina(currentPage + 1));

  const paginaAtual = document.createElement("span");
  paginaAtual.textContent = `Página ${currentPage} de ${totalPages}`;

  paginacao.appendChild(anterior);
  paginacao.appendChild(paginaAtual);
  paginacao.appendChild(proximo);

  return paginacao;
}

// Limpa as áreas de paginação
function limparPaginacao() {
  paginationTop.innerHTML = "";
  paginationBottom.innerHTML = "";
}

// Muda de página conforme o modo atual
function mudarPagina(novaPagina) {
  if (novaPagina < 1 || novaPagina > totalPages) return;

  currentPage = novaPagina;

  if (currentMode === "default") {
    carregarFilmes(currentFilter, sectionTitle.textContent);
  } else if (currentMode === "search") {
    carregarFilmesPesquisa(currentQuery, currentPage);
  } else if (currentMode === "genre") {
    carregarFilmesPorGenero(activeGenre, currentPage);
  }
}
