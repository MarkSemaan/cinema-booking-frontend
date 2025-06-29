document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-view-movies").addEventListener("click", () => {
    axios
      .get("http://localhost/cinema-booking-backend/api/movies.php?action=list")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  });
});
