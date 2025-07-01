document.addEventListener("DOMContentLoaded", () => {
  // Modal elements
  const modal = document.getElementById("movieModal");
  const closeBtn = document.querySelector(".close");
  const modalPoster = document.getElementById("modalPoster");
  const modalTitle = document.getElementById("modalTitle");
  const modalYear = document.getElementById("modalYear");
  const modalGenre = document.getElementById("modalGenre");
  const modalDirector = document.getElementById("modalDirector");
  const modalSynopsis = document.getElementById("modalSynopsis");

  // Close modal when clicking the X button
  closeBtn.onclick = function () {
    closeModal();
  };

  // Close modal when clicking outside of it
  window.onclick = function (event) {
    if (event.target == modal) {
      closeModal();
    }
  };

  // Close modal with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  // Function to close modal with animation
  function closeModal() {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300); // Wait for animation to complete
  }

  // Function to open modal with movie data
  function openModal(movie) {
    modalPoster.src = movie.poster_url;
    modalPoster.alt = `${movie.title} poster`;
    modalTitle.textContent = movie.title;
    modalYear.textContent = movie.release_year;
    modalGenre.textContent = movie.genre || "Unknown Genre";
    modalDirector.textContent = `Dir: ${movie.director}`;
    modalSynopsis.textContent = movie.synopsis || "No synopsis available";
    modal.style.display = "block";
    // Trigger animation by adding show class
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);
  }

  // Fetch and display movies
  axios
    .get("http://localhost/cinema-booking-backend/api/movies.php?action=list")
    .then((response) => {
      const movies = response.data.movies;
      console.log("Movies data:", movies); // Debug log
      const container = document.querySelector(".movies-container");
      movies.forEach((movie) => {
        console.log("Movie genre:", movie.genre); // Debug log for each movie
        const movieCard = document.createElement("div");
        movieCard.className = "movie-card";
        movieCard.style.cursor = "pointer";

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
                <span class="movie-genre">${
                  movie.genre || "Unknown Genre"
                }</span>
                <span class="movie-director">Dir: ${movie.director}</span>
              </div>
              <p class="movie-synopsis">${
                movie.synopsis || "No synopsis available"
              }</p>
            </div>
          `;

        // Add click event to open modal
        movieCard.addEventListener("click", () => {
          openModal(movie);
        });

        container.appendChild(movieCard);
      });
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
    });
});
