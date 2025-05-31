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
