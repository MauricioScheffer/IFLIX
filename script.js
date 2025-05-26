const apiKey = "1e80412998daf360b634f59f4944b940";
const posterContainer = document.getElementById("posterContainer");
const genreList = document.getElementById("genreList");
const sectionTitle = document.getElementById("sectionTitle");
const input = document.getElementById("movieInput");

let activeGenre = null;

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

    // Marca categoria ativa
    document.querySelectorAll("#genreList li").forEach(li => li.classList.remove("active"));
    e.target.classList.add("active");
    activeGenre = genreId;

    sectionTitle.textContent = `Categoria: ${genreName}`;
    input.value = ""; // limpa pesquisa

    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=pt-BR`)
      .then(res => res.json())
      .then(data => {
        posterContainer.innerHTML = "";
        data.results.slice(0, 12).forEach(movie => {
          if (movie.poster_path) {
            createMovieCard(movie);
          }
        });
      });
  }
});

// Pesquisa por nome de filme
input.addEventListener("input", () => {
  const query = input.value.trim();

  if (query.length < 2) {
    posterContainer.innerHTML = "";
    sectionTitle.textContent = "Filmes em destaque";
    // limpa categoria ativa visualmente
    document.querySelectorAll("#genreList li").forEach(li => li.classList.remove("active"));
    activeGenre = null;
    return;
  }

  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR`)
    .then(res => res.json())
    .then(data => {
      sectionTitle.textContent = `Resultados para: "${query}"`;
      posterContainer.innerHTML = "";
      data.results.slice(0, 12).forEach(movie => {
        if (movie.poster_path) {
          createMovieCard(movie);
        }
      });
    });
});

// Função utilitária para criar card de filme
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
