// Bookings page logic

document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  main.innerHTML = `<h2>Your Bookings</h2><div id="bookingsList" class="bookings-list"></div>`;

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    main.innerHTML = `<h2>Your Bookings</h2><p>Please <a href="auth.html">log in</a> to view your bookings.</p>`;
    return;
  }

  axios
    .get(
      `http://localhost/cinema-booking-backend/api/bookings.php?action=user_bookings&user_id=${user.id}`
    )
    .then((response) => {
      const bookings = response.data.bookings;
      renderBookings(bookings);
    })
    .catch((error) => {
      document.getElementById(
        "bookingsList"
      ).innerHTML = `<p>Failed to load bookings.</p>`;
    });

  function renderBookings(bookings) {
    const container = document.getElementById("bookingsList");
    if (!bookings || bookings.length === 0) {
      container.innerHTML = `<p>No bookings found.</p>`;
      return;
    }
    container.innerHTML = bookings
      .map(
        (b) => `
        <div class="booking-card">
          <div class="booking-movie-title"><strong>Movie:</strong> ${
            b.movie_title
          }</div>
          <div><strong>Showtime:</strong> ${formatShowtime(b.showtime)}</div>
          <div><strong>Auditorium:</strong> ${b.auditorium_name}</div>
          <div><strong>Seats:</strong> ${b.seats}</div>
          <div><strong>Booked At:</strong> ${formatShowtime(
            b.booking_time
          )}</div>
        </div>
      `
      )
      .join("");
  }

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
});
