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

  // Function to get image URL
  function getImageUrl(posterUrl) {
    if (!posterUrl) return null;
    const imageUrl = `http://localhost/cinema-booking-backend/api/images.php?path=${encodeURIComponent(
      posterUrl
    )}`;
    console.log("Generated image URL:", imageUrl); // Debug log
    return imageUrl;
  }

  // Function to open modal with movie data
  function openModal(movie) {
    modalPoster.src = getImageUrl(movie.poster_url);
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

    // Add event listener to Book Now button
    const bookNowBtn = modal.querySelector(".book-now-btn");
    bookNowBtn.onclick = () => handleBookNow(movie);
  }

  // Function to handle Book Now button click
  function handleBookNow(movie) {
    const userInfo = JSON.parse(localStorage.getItem("user"));

    if (!userInfo) {
      // User is not logged in, redirect to auth page
      alert("Please log in to book tickets.");
      window.location.href = "auth.html";
      return;
    }

    // User is logged in, fetch and show available showtimes
    fetchShowtimes(movie);
  }

  // Function to fetch showtimes for a movie
  function fetchShowtimes(movie) {
    axios
      .get(
        `http://localhost/cinema-booking-backend/api/showtimes.php?action=by_movie&movie_id=${movie.id}`
      )
      .then((response) => {
        const showtimes = response.data.showtimes;
        if (showtimes && showtimes.length > 0) {
          showShowtimesModal(movie, showtimes);
        } else {
          alert("No showtimes available for this movie.");
        }
      })
      .catch((error) => {
        console.error("Error fetching showtimes:", error);
        alert("Failed to load showtimes. Please try again.");
      });
  }

  // Function to show showtimes modal
  function showShowtimesModal(movie, showtimes) {
    // Close the movie modal first
    closeModal();

    // Create showtimes modal
    const showtimesModal = document.createElement("div");
    showtimesModal.className = "modal showtimes-modal";
    showtimesModal.id = "showtimesModal";

    showtimesModal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <div class="modal-body">
          <h2>Select Showtime for ${movie.title}</h2>
          <div class="showtimes-list">
            ${showtimes
              .map(
                (showtime) => `
              <div class="showtime-item" data-showtime-id="${showtime.id}">
                <div class="showtime-info">
                  <span class="showtime-time">${formatShowtime(
                    showtime.showtime
                  )}</span>
                  <span class="showtime-auditorium">Auditorium ${
                    showtime.auditorium_id
                  }</span>
                </div>
                <button class="select-showtime-btn">Select</button>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(showtimesModal);

    // Show the modal
    showtimesModal.style.display = "block";
    setTimeout(() => {
      showtimesModal.classList.add("show");
    }, 10);

    // Add event listeners
    const closeBtn = showtimesModal.querySelector(".close");
    closeBtn.onclick = () => closeShowtimesModal();

    // Close modal when clicking outside
    showtimesModal.onclick = (event) => {
      if (event.target === showtimesModal) {
        closeShowtimesModal();
      }
    };

    // Add event listeners to select buttons
    const selectButtons = showtimesModal.querySelectorAll(
      ".select-showtime-btn"
    );
    selectButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const showtimeItem = e.target.closest(".showtime-item");
        const showtimeId = showtimeItem.dataset.showtimeId;
        const selectedShowtime = showtimes.find((s) => s.id === showtimeId);
        handleShowtimeSelection(movie, selectedShowtime);
      });
    });
  }

  // Function to close showtimes modal
  function closeShowtimesModal() {
    const showtimesModal = document.getElementById("showtimesModal");
    if (showtimesModal) {
      showtimesModal.classList.remove("show");
      setTimeout(() => {
        showtimesModal.remove();
      }, 300);
    }
  }

  // Function to format showtime
  function formatShowtime(showtimeString) {
    const date = new Date(showtimeString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Function to handle showtime selection
  function handleShowtimeSelection(movie, showtime) {
    console.log("Selected showtime:", showtime);
    console.log("For movie:", movie.title);
    // TODO: Proceed to seat selection
    alert(`Selected: ${movie.title} at ${formatShowtime(showtime.showtime)}`);
    closeShowtimesModal();
  }

  // Fetch and display movies
  axios
    .get("http://localhost/cinema-booking-backend/api/movies.php?action=list")
    .then((response) => {
      const movies = response.data.movies;
      console.log("Movies data:", movies); // Debug log
      const container = document.querySelector(".movies-container");
      movies.forEach((movie) => {
        console.log("Movie:", movie.title, "Poster URL:", movie.poster_url); // Debug log for each movie
        const movieCard = document.createElement("div");
        movieCard.className = "movie-card";
        movieCard.style.cursor = "pointer";

        movieCard.innerHTML = `
            <img 
              src="${getImageUrl(movie.poster_url)}" 
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
