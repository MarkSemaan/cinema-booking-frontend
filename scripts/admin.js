document.addEventListener("DOMContentLoaded", function () {
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
          alert("Movie added successfully");
          event.target.reset();
        })
        .catch((error) => {
          alert("Movie not added");
          console.log(error);
        });
    });
});
