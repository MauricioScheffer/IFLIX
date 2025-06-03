const apiKey = "1e80412998daf360b634f59f4944b940"; 
const genreList = document.getElementById("genreList");

// Carregar e exibir os gêneros
fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=pt-BR`)
  .then(res => res.json())
  .then(data => {
    data.genres.forEach(genre => {
      const li = document.createElement("li");
      li.textContent = genre.name;
      li.dataset.id = genre.id;

      // Redireciona para index.html com o gênero selecionado
      li.addEventListener("click", () => {
        const url = `index.html?genero=${genre.id}&nome=${encodeURIComponent(genre.name)}`;
        window.location.href = url;
      });

      genreList.appendChild(li);
    });
  })
  .catch(error => {
    console.error("Erro ao carregar gêneros:", error);
  });
