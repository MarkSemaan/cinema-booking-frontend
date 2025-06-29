document.addEventListener("DOMContentLoaded", () => {
  axios
    .get("http://localhost/cinema-booking-backend/api/movies.php?action=list")
    .then((response) => {
      const movies = response.data.movies;
      const container = document.getElementById("movies-container");
      movies.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.className = "movie-card";

        movieCard.innerHTML = `
            <img 
              src="${movie.poster_url}" 
              alt="${movie.title} poster" 
              class="movie-poster"
              onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2NjYyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='"
            >
            <div class="movie-info">
              <h3 class="movie-title">${movie.title}</h3>
              <p class="movie-year">${movie.release_year}</p>
              <div class="movie-meta">
                <span class="movie-genre">${movie.genre}</span>
                <span class="movie-director">Dir: ${movie.director}</span>
              </div>
              <p class="movie-synopsis">${movie.synopsis}</p>
            </div>
          `;
        container.appendChild(movieCard);
      });
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
    });
});
