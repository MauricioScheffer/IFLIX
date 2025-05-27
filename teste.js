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

// Carrega filmes aleatórios ao entrar
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

// Função para carregar filmes por tipo (popular, now_playing)
function carregarFilmes(tipo, titulo) {
  fetch(`https://api.themoviedb.org/3/movie/${tipo}?api_key=${apiKey}&language=pt-BR&page=${currentPage}`)
    .then(res => res.json())
    .then(data => {
      sectionTitle.textContent = titulo;
      renderizarFilmes(data);
      totalPages = data.total_pages;
      renderizarPaginacao();
    });
}

// Função para carregar filmes por pesquisa
function carregarFilmesPesquisa(query, page) {
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR&page=${page}`)
    .then(res => res.json())
    .then(data => {
      renderizarFilmes(data);
      totalPages = data.total_pages;
      renderizarPaginacao();
    });
}

// Função para carregar filmes por gênero
function carregarFilmesPorGenero(genreId, page) {
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=pt-BR&page=${page}`)
    .then(res => res.json())
    .then(data => {
      renderizarFilmes(data);
      totalPages = data.total_pages;
      renderizarPaginacao();
    });
}

// Função para criar os cards
function createMovieCard(movie) {
  const div = document.createElement("div");
  div.className = "movie-card";

  const img = document.createElement("img");
  img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
  img.alt = movie.title;

  const title = document.createElement("p");
  title.className = "title";
  title.textContent = movie.title;

  div.appendChild(img);
  div.appendChild(title);
  posterContainer.appendChild(div);
}

// Renderiza os filmes na tela
function renderizarFilmes(data) {
  posterContainer.innerHTML = "";
  data.results.forEach(movie => {
    if (movie.poster_path) {
      createMovieCard(movie);
    }
  });
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

const movies = [
  { id: 12345, title: "Filme A", poster_path: "/abc.jpg" },
  { id: 67890, title: "Filme B", poster_path: "/def.jpg" }
];

// Container onde os cards vão
const container = document.querySelector(".movie-posters");

movies.forEach(movie => {
  const a = document.createElement("a");
  a.href = `filme.html?id=${movie.id}`;
  a.classList.add("movie-card");
  
  a.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
    <div class="title">${movie.title}</div>
  `;
  
  container.appendChild(a);
});

// // Exibir
function exibirFilmes(listaDeFilmes) {
  const posterContainer = document.getElementById("posterContainer");
  posterContainer.innerHTML = ""; // limpa resultados anteriores

  listaDeFilmes.forEach(filme => {
    const card = document.createElement("a");
    card.href = `filme.html?id=${filme.id}`;
    card.classList.add("filme-card");

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${filme.poster_path}" alt="${filme.title}" />
      <h3>${filme.title}</h3>
    `;

    posterContainer.appendChild(card);
  });
}

// Função que renderiza os cards com link para filme.html?id=...
function exibirFilmes(filmes) {
  posterContainer.innerHTML = "";

  filmes.forEach(filme => {
    const link = document.createElement("a");
    link.href = `filme.html?id=${filme.id}`;
    link.classList.add("filme-card");

    link.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${filme.poster_path}" alt="${filme.title}" />
      <h3>${filme.title}</h3>
    `;

    posterContainer.appendChild(link);
  });
}

    // Carrega filmes populares ao abrir a página
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`)
      .then(res => res.json())
      .then(data => {
        exibirFilmes(data.results);
      });