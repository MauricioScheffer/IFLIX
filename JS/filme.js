const apiKey = "1e80412998daf360b634f59f4944b940";
const genreList = document.getElementById("genreList");

// gêneros
fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=pt-BR`)
    .then(res => res.json())
    .then(data => {
        data.genres.forEach(genre => {
            const li = document.createElement("li");
            li.textContent = genre.name;
            li.dataset.id = genre.id;

            // indo para o index
            li.addEventListener("click", () => {
                const url = `index.html?genero=${genre.id}&nome=${encodeURIComponent(genre.name)}`;
                window.location.href = url;
            })
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



// Pega as info dos filmes
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");
if (!movieId) {
    alert("Nenhum filme selecionado.");
    window.location.href = "index.html";
}

fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=1e80412998daf360b634f59f4944b940&language=pt-BR`)
    .then(res => res.json())
    .then(movie => {
        // fundo
        if (movie.backdrop_path) {
            document.body.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backdropFilter = 'blur(4px)';

        }
        document.getElementById("movieTitle").textContent = movie.title;
        document.getElementById("moviePoster").src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        document.getElementById("movieOverview").textContent = movie.overview;
        document.getElementById("movieReleaseDate").textContent = movie.release_date;
        document.getElementById("movieRating").textContent = movie.vote_average;
        document.getElementById("movieDuration").textContent = movie.runtime;



        const genres = movie.genres.map(g => g.name).join(", ");
        document.getElementById("movieGenres").textContent = genres;
    });

// video trailer
fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=1e80412998daf360b634f59f4944b940&language=pt-BR`)
    .then(res => res.json())
    .then(data => {
        const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");
        if (trailer) {
            const trailerIframe = document.querySelector(".trailer iframe");
            trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}`;
        } else {
            document.querySelector(".trailer").innerHTML += "<p>Trailer não disponível.</p>";
        }
    })