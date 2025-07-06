document.addEventListener("DOMContentLoaded", function () {
  // Load movies and auditoriums for showtime form
  loadMovies();
  loadAuditoriums();
  // Movie form submission
  document
    .getElementById("add-movie-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const formdata = new FormData(event.target);

      // Get user ID from localStorage for admin authentication
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        alert("Please log in first");
        return;
      }
      formdata.append("user_id", userData.id);

      axios
        .post(
          "http://localhost/cinema-booking-backend/movies/create",
          formdata,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          console.log(response);
          alert(`Movie added successfully`);
          event.target.reset();
          // Reload movies after adding a new one
          loadMovies();
        })
        .catch((error) => {
          console.log(error);
          if (error.response) {
            alert(
              `Movie not added: ${
                error.response.data.error || error.response.statusText
              }`
            );
          } else if (error.request) {
            alert("Movie not added: No response from server");
          } else {
            alert(`Movie not added: ${error.message}`);
          }
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
      data.showtime = showDateTime;

      // Remove individual date and time fields and price (not in database)
      delete data.show_date;
      delete data.show_time;
      delete data.price;

      // Get user ID from localStorage for admin authentication
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        alert("Please log in first");
        return;
      }
      data.user_id = userData.id;

      axios
        .post(
          "http://localhost/cinema-booking-backend/showtimes/create",
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
          console.log(error);
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            alert(
              `Showtime not added: ${
                error.response.data.error || error.response.statusText
              }`
            );
          } else if (error.request) {
            // The request was made but no response was received
            alert("Showtime not added: No response from server");
          } else {
            // Something happened in setting up the request that triggered an Error
            alert(`Showtime not added: ${error.message}`);
          }
        });
    });

  // Auditorium form submission
  document
    .getElementById("add-auditorium-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const formdata = new FormData(event.target);
      const data = Object.fromEntries(formdata);

      // Get user ID from localStorage for admin authentication
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        alert("Please log in first");
        return;
      }
      data.user_id = userData.id;

      axios
        .post(
          "http://localhost/cinema-booking-backend/auditoriums/create",
          JSON.stringify(data),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response);
          alert(`Auditorium, ${data.name} added successfully`);
          event.target.reset();
          // Reload auditoriums after adding a new one
          loadAuditoriums();
        })
        .catch((error) => {
          console.log(error);
          if (error.response) {
            alert(
              `Auditorium not added: ${
                error.response.data.error || error.response.statusText
              }`
            );
          } else if (error.request) {
            alert("Auditorium not added: No response from server");
          } else {
            alert(`Auditorium not added: ${error.message}`);
          }
        });
    });
});

// Function to load movies for the showtime form
function loadMovies() {
  axios
    .get("http://localhost/cinema-booking-backend/movies")
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
      if (error.response) {
        console.error("Server error:", error.response.data);
      }
    });
}

// Function to load auditoriums dropdown for the showtime form
function loadAuditoriums() {
  axios
    .get("http://localhost/cinema-booking-backend/auditoriums")
    .then((response) => {
      const auditoriumSelect = document.getElementById("auditorium_id");
      const currentValue = auditoriumSelect.value; // Store current selection

      // Clear existing options except the first one
      auditoriumSelect.innerHTML =
        '<option value="">Select an auditorium</option>';

      if (
        response.data &&
        response.data.auditoriums &&
        response.data.auditoriums.length > 0
      ) {
        response.data.auditoriums.forEach((auditorium) => {
          const option = document.createElement("option");
          option.value = auditorium.id;
          option.textContent = auditorium.name;
          auditoriumSelect.appendChild(option);
        });

        // Restore previous selection if it still exists
        if (currentValue) {
          auditoriumSelect.value = currentValue;
        }
      }
    })
    .catch((error) => {
      console.log("Error loading auditoriums:", error);
      if (error.response) {
        console.error("Server error:", error.response.data);
      }
    });
}
