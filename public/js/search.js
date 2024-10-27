let searchForm = document.getElementById("searchForm");

searchForm.addEventListener("submit", function (event) {
  event.preventDefault(); //to stop default clicking by then user and prevent to refresh the page 

  const searchQuery = document.getElementById("searchInput").value;

  // Send a request to the backend with the search query
  fetch(`/ig/search/users?query=${searchQuery}`)
    .then((response) => response.json())
    .then((data) => {
      // Clear any previous results
      const resultsDiv = document.getElementById("searchResults");
      resultsDiv.innerHTML = "";

      // if users are found
      if (data.users.length === 0) {
        resultsDiv.innerHTML = "<p>No users found</p>";
        return;
      }

      // Display the found users
      data.users.forEach((user) => {
        const userDiv = document.createElement("div");
        userDiv.classList.add("user-result");

        // Add profile picture and username
        userDiv.innerHTML = `
          <a href="/ig/${user.username}" class="user-link">
            <img src="${user.profile}" alt="${user.name}'s profile picture" class="profile-picture" />
            <div class="user-name-container"><span class="user-name">${user.name}</span></div>
          </a>
        `;

        resultsDiv.appendChild(userDiv);  //insert into ejs
      });
    })
    .catch((err) => console.error("Error:", err));
});
