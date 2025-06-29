document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn").addEventListener("click", () => {
    axios
      .get("http://localhost/cinema-booking-backend/api/movies.php?action=list")
      .then((response) => {
        console.log(response.data);
      });
  });
});
