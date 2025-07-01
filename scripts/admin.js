document.addEventListener("DOMContentLoaded", function () {
  // Tab switching functionality
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      button.classList.add("active");
      document.getElementById(targetTab).classList.add("active");
    });
  });

  // Load movies for showtime form
  loadMovies();

  // Movie form submission
  document
    .getElementById("add-movie-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const formdata = new FormData(event.target);
      const data = Object.fromEntries(formdata);
      axios
        .post(
          "http://localhost/cinema-booking-backend/api/movies.php?action=create",
          JSON.stringify(data),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response);
          alert(`Movie, ${data.title} added successfully`);
          event.target.reset();
          // Reload movies after adding a new one
          loadMovies();
        })
        .catch((error) => {
          alert("Movie not added");
          console.log(error);
        });
    });

  // Showtime form submission
  document
    .getElementById("add-showtime-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const formdata = new FormData(event.target);
      const data = Object.fromEntries(formdata);

      // Combine date and time
      const showDateTime = `${data.show_date} ${data.show_time}:00`;
      data.show_datetime = showDateTime;

      // Remove individual date and time fields
      delete data.show_date;
      delete data.show_time;

      axios
        .post(
          "http://localhost/cinema-booking-backend/api/showtimes.php?action=create",
          JSON.stringify(data),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response);
          alert(`Showtime added successfully`);
          event.target.reset();
        })
        .catch((error) => {
          alert("Showtime not added");
          console.log(error);
        });
    });
});

// Function to load movies for the showtime form
function loadMovies() {
  axios
    .get("http://localhost/cinema-booking-backend/api/movies.php?action=list")
    .then((response) => {
      const movieSelect = document.getElementById("movie_id");
      const currentValue = movieSelect.value; // Store current selection

      // Clear existing options except the first one
      movieSelect.innerHTML = '<option value="">Select a movie</option>';

      if (
        response.data &&
        response.data.movies &&
        response.data.movies.length > 0
      ) {
        response.data.movies.forEach((movie) => {
          const option = document.createElement("option");
          option.value = movie.id;
          option.textContent = movie.title;
          movieSelect.appendChild(option);
        });

        // Restore previous selection if it still exists
        if (currentValue) {
          movieSelect.value = currentValue;
        }
      }
    })
    .catch((error) => {
      console.log("Error loading movies:", error);
    });
}
