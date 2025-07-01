// Movies page functionality
// This is where all the 'movie' magic happens

document.addEventListener("DOMContentLoaded", () => {
  // Grab all the modal elements we need
  const modal = document.getElementById("movieModal");
  const closeBtn = document.querySelector(".close");
  const modalPoster = document.getElementById("modalPoster");
  const modalTitle = document.getElementById("modalTitle");
  const modalYear = document.getElementById("modalYear");
  const modalGenre = document.getElementById("modalGenre");
  const modalDirector = document.getElementById("modalDirector");
  const modalSynopsis = document.getElementById("modalSynopsis");

  // Close modal when X is clicked
  closeBtn.onclick = function () {
    closeModal();
  };

  // Close when clicking outside the modal
  window.onclick = function (event) {
    if (event.target == modal) {
      closeModal();
    }
  };

  // Escape key closes modal too
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  // Close modal with a nice fade out
  function closeModal() {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300); // Wait for the animation
  }

  // Build the image URL from the backend
  function getImageUrl(posterUrl) {
    if (!posterUrl) return null;
    const imageUrl = `http://localhost/cinema-booking-backend/api/images.php?path=${encodeURIComponent(
      posterUrl
    )}`;
    console.log("Image URL:", imageUrl); // Debug
    return imageUrl;
  }

  // Open the modal and fill it with movie data
  function openModal(movie) {
    modalPoster.src = getImageUrl(movie.poster_url);
    modalPoster.alt = `${movie.title} poster`;
    modalTitle.textContent = movie.title;
    modalYear.textContent = movie.release_year;
    modalGenre.textContent = movie.genre || "Unknown Genre";
    modalDirector.textContent = `Dir: ${movie.director}`;
    modalSynopsis.textContent = movie.synopsis || "No synopsis available";
    modal.style.display = "block";
    // Add a tiny delay for the animation
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);

    // Hook up the Book Now button
    const bookNowBtn = modal.querySelector(".book-now-btn");
    bookNowBtn.onclick = () => handleBookNow(movie);
  }

  // Handle the Book Now button click
  function handleBookNow(movie) {
    const userInfo = JSON.parse(localStorage.getItem("user"));

    if (!userInfo) {
      // User needs to log in first
      alert("Please log in to book tickets.");
      window.location.href = "auth.html";
      return;
    }

    // User is logged in, get the showtimes
    fetchShowtimes(movie);
  }

  // Get showtimes for a specific movie
  function fetchShowtimes(movie) {
    // Need both showtimes and auditorium info
    Promise.all([
      axios.get(
        `http://localhost/cinema-booking-backend/api/showtimes.php?action=by_movie&movie_id=${movie.id}`
      ),
      axios.get(
        `http://localhost/cinema-booking-backend/api/auditorium.php?action=list`
      ),
    ])
      .then(([showtimesResponse, auditoriumsResponse]) => {
        const showtimes = showtimesResponse.data.showtimes;
        const auditoriums = auditoriumsResponse.data.auditoriums;

        if (showtimes && showtimes.length > 0) {
          // Match up auditorium names with showtimes
          const showtimesWithAuditoriumNames = showtimes.map((showtime) => {
            const auditorium = auditoriums.find(
              (aud) => aud.id == showtime.auditorium_id
            );
            return {
              ...showtime,
              auditorium_name: auditorium
                ? auditorium.name
                : `Auditorium ${showtime.auditorium_id}`,
            };
          });

          showShowtimesModal(movie, showtimesWithAuditoriumNames);
        } else {
          alert("No showtimes available for this movie.");
        }
      })
      .catch((error) => {
        console.error("Error getting showtimes:", error);
        alert("Failed to load showtimes. Please try again.");
      });
  }

  // Show the showtimes selection modal
  function showShowtimesModal(movie, showtimes) {
    // Close the movie modal first
    closeModal();

    // Create the showtimes modal
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
                  <span class="showtime-auditorium">${
                    showtime.auditorium_name
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

    // Close when clicking outside
    showtimesModal.onclick = (event) => {
      if (event.target === showtimesModal) {
        closeShowtimesModal();
      }
    };

    // Hook up the select buttons
    const selectButtons = showtimesModal.querySelectorAll(
      ".select-showtime-btn"
    );
    selectButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const showtimeItem = e.target.closest(".showtime-item");
        const showtimeId = showtimeItem.dataset.showtimeId;
        const selectedShowtime = showtimes.find(
          (s) => String(s.id) === showtimeId
        );
        handleShowtimeSelection(movie, selectedShowtime);
      });
    });
  }

  // Close the showtimes modal
  function closeShowtimesModal() {
    const showtimesModal = document.getElementById("showtimesModal");
    if (showtimesModal) {
      showtimesModal.classList.remove("show");
      setTimeout(() => {
        showtimesModal.remove();
      }, 300);
    }
  }

  // Format the showtime to look nice
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

  // Handle when user picks a showtime
  function handleShowtimeSelection(movie, showtime) {
    console.log("Selected showtime:", showtime);
    console.log("For movie:", movie.title);
    // Now get the available seats
    fetchAvailableSeats(movie, showtime);
  }

  // Get which seats are available for this showtime
  function fetchAvailableSeats(movie, showtime) {
    axios
      .get(
        `http://localhost/cinema-booking-backend/api/bookings.php?action=available_seats&showtime_id=${showtime.id}`
      )
      .then((response) => {
        const seatData = response.data;
        showSeatSelectionModal(movie, showtime, seatData);
      })
      .catch((error) => {
        console.error("Error getting seats:", error);
        alert("Failed to load seat information. Please try again.");
      });
  }

  // Show the seat selection modal
  function showSeatSelectionModal(movie, showtime, seatData) {
    // Close the showtimes modal first
    closeShowtimesModal();

    // Create the seat selection modal
    const seatModal = document.createElement("div");
    seatModal.className = "modal seat-selection-modal";
    seatModal.id = "seatSelectionModal";

    const { auditorium, booked_seats } = seatData;
    const selectedSeats = []; // Track which seats user picked

    seatModal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <div class="modal-body seat-modal-body-flex">
          <div class="seat-modal-info-col">
            <h2 class="seat-modal-title">Select Seats<br>for<br>${
              movie.title
            }</h2>
            <div class="showtime-info-summary">
              <p><strong>Showtime:</strong> ${formatShowtime(
                showtime.showtime
              )}</p>
              <p><strong>Auditorium:</strong> ${showtime.auditorium_name}</p>
            </div>
          </div>
          <div class="seat-modal-grid-col">
            <div class="screen-indicator">SCREEN</div>
            <div class="seat-selection-container">
              <div class="seats-grid" style="grid-template-columns: repeat(${
                auditorium.seats_per_row
              }, 1fr);">
                ${generateSeatsGrid(
                  auditorium.rows,
                  auditorium.seats_per_row,
                  booked_seats
                )}
              </div>
            </div>
            <div class="seat-legend">
              <div class="legend-item">
                <div class="seat available"></div>
                <span>Available</span>
              </div>
              <div class="legend-item">
                <div class="seat selected"></div>
                <span>Selected</span>
              </div>
              <div class="legend-item">
                <div class="seat booked"></div>
                <span>Booked</span>
              </div>
            </div>
            <div class="booking-summary">
              <p><strong>Selected Seats:</strong> <span id="selectedSeatsDisplay">None</span></p>
              <p><strong>Total Price:</strong> $<span id="totalPrice">0</span></p>
            </div>
            <div class="booking-actions">
              <button id="confirmBookingBtn" class="confirm-booking-btn" disabled>Confirm Booking</button>
              <button class="cancel-booking-btn">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(seatModal);

    // Show the modal
    seatModal.style.display = "block";
    setTimeout(() => {
      seatModal.classList.add("show");
    }, 10);

    // Add event listeners
    const closeBtn = seatModal.querySelector(".close");
    closeBtn.onclick = () => closeSeatSelectionModal();

    // Close when clicking outside
    seatModal.onclick = (event) => {
      if (event.target === seatModal) {
        closeSeatSelectionModal();
      }
    };

    // Handle seat clicks
    const seatElements = seatModal.querySelectorAll(".seat.available");
    seatElements.forEach((seat) => {
      seat.addEventListener("click", () => {
        const row = seat.dataset.row;
        const number = seat.dataset.number;
        const seatKey = `${row}-${number}`;

        if (selectedSeats.find((s) => s.row === row && s.number === number)) {
          // Deselect the seat
          selectedSeats.splice(
            selectedSeats.findIndex(
              (s) => s.row === row && s.number === number
            ),
            1
          );
          seat.classList.remove("selected");
        } else {
          // Select the seat
          selectedSeats.push({ row, number });
          seat.classList.add("selected");
        }

        updateBookingSummary(selectedSeats);
      });
    });

    // Handle booking confirmation
    const confirmBtn = seatModal.querySelector("#confirmBookingBtn");
    confirmBtn.addEventListener("click", () => {
      if (selectedSeats.length > 0) {
        createBooking(movie, showtime, selectedSeats);
      }
    });

    // Handle cancel
    const cancelBtn = seatModal.querySelector(".cancel-booking-btn");
    cancelBtn.addEventListener("click", () => {
      closeSeatSelectionModal();
    });
  }

  // Generate the HTML for the seats grid
  function generateSeatsGrid(rows, seatsPerRow, bookedSeats) {
    let html = "";
    const bookedSeatsSet = new Set(
      bookedSeats.map((seat) => `${seat.seat_row}-${seat.seat_number}`)
    );

    for (let row = 1; row <= rows; row++) {
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatKey = `${row}-${seat}`;
        const isBooked = bookedSeatsSet.has(seatKey);
        const seatClass = isBooked ? "seat booked" : "seat available";

        html += `
          <div class="${seatClass}" data-row="${row}" data-number="${seat}">
            ${seat}
          </div>
        `;
      }
    }

    return html;
  }

  // Update the booking summary when seats are selected/deselected
  function updateBookingSummary(selectedSeats) {
    const selectedSeatsDisplay = document.getElementById(
      "selectedSeatsDisplay"
    );
    const totalPriceElement = document.getElementById("totalPrice");
    const confirmBtn = document.getElementById("confirmBookingBtn");

    if (selectedSeats.length === 0) {
      selectedSeatsDisplay.textContent = "None";
      totalPriceElement.textContent = "0";
      confirmBtn.disabled = true;
    } else {
      const seatsText = selectedSeats
        .map((seat) => `Row ${seat.row}, Seat ${seat.number}`)
        .join(", ");
      selectedSeatsDisplay.textContent = seatsText;

      const pricePerSeat = 12; // $12 per seat
      const totalPrice = selectedSeats.length * pricePerSeat;
      totalPriceElement.textContent = totalPrice;

      confirmBtn.disabled = false;
    }
  }

  // Actually create the booking in the backend
  function createBooking(movie, showtime, selectedSeats) {
    const userInfo = JSON.parse(localStorage.getItem("user"));

    const bookingData = {
      user_id: userInfo.id,
      showtime_id: showtime.id,
      seats: selectedSeats,
    };

    axios
      .post(
        "http://localhost/cinema-booking-backend/api/bookings.php?action=create",
        bookingData
      )
      .then((response) => {
        alert(`Booking successful! Booking ID: ${response.data.booking_id}`);
        closeSeatSelectionModal();
        // Could redirect to bookings page here if we want
        // window.location.href = "bookings.html";
      })
      .catch((error) => {
        console.error("Error creating booking:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          alert(`Booking failed: ${error.response.data.error}`);
        } else {
          alert("Failed to create booking. Please try again.");
        }
      });
  }

  // Close the seat selection modal
  function closeSeatSelectionModal() {
    const seatModal = document.getElementById("seatSelectionModal");
    if (seatModal) {
      seatModal.classList.remove("show");
      setTimeout(() => {
        seatModal.remove();
      }, 300);
    }
  }

  // Load and display all the movies
  axios
    .get("http://localhost/cinema-booking-backend/api/movies.php?action=list")
    .then((response) => {
      const movies = response.data.movies;
      console.log("Movies loaded:", movies); // Debug
      const container = document.querySelector(".movies-container");
      movies.forEach((movie) => {
        console.log(
          "Processing movie:",
          movie.title,
          "Poster:",
          movie.poster_url
        ); // Debug
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

        // Make the card clickable to open modal
        movieCard.addEventListener("click", () => {
          openModal(movie);
        });

        container.appendChild(movieCard);
      });
    })
    .catch((error) => {
      console.error("Error loading movies:", error);
    });
});
