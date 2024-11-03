let searchForm = document.getElementById("searchForm");

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const searchQuery = document.getElementById("searchInput").value;

  fetch(`/ig/search/users?query=${searchQuery}`)
    .then((response) => response.json())
    .then((data) => {
      const resultsDiv = document.getElementById("searchResults");
      resultsDiv.innerHTML = "";

      if (data.users.length === 0) {
        resultsDiv.innerHTML = "<p>No users found</p>";
        return;
      }

      data.users.forEach((user) => {
        const userDiv = document.createElement("div");
        userDiv.classList.add("user-result");

        userDiv.innerHTML = `
          <a href="/ig/${user.username}" class="user-link">
            <img src="${user.profile}" onerror="this.hidden = true"="${user.name}'s profile picture" class="profile-picture" />
            <div class="user-name-container"><span class="user-name">${user.name}</span></div>
          </a>
        `;

        resultsDiv.appendChild(userDiv);
      });
    })
    .catch((err) => console.error("Error:", err));
});
