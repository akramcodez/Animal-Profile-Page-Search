const express = require("express");
const app = express();
const fs = require("fs"); // To read/write files
const { v4: uuidv4 } = require('uuid'); // Import UUID
const path = require("path");
const methodOverride = require("method-override");
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json()); // To parse JSON data
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));


const readData = () => {
  return JSON.parse(fs.readFileSync("data.json", "utf8"));
};
const writeData = (data) => {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
};

app.get("/ig/:username", (req, res) => {
  let instaData = require("./data.json");
  let { username } = req.params;

  let data = instaData[username.toLowerCase()]; // if a user looking in capital letters too then it will same result

  if (username === "tiger247") {
    res.render("myProfile.ejs", { data });
  } else if (data) {
    res.render("insta.ejs", { data });
  } else {
    res.render("error.ejs");
  }
});

// Get page to edit profile information
app.get("/ig/:username/edit-profile", (req, res) => {
  let instaData = require("./data.json");
  let { username } = req.params;
  let data = instaData[username];
  res.render("edit-profile.ejs", { data });
});
// Submit the newly changed profile data
app.patch("/ig/:username", (req, res) => {
  let { username } = req.params; // Get the username from the URL
  let instaData = require("./data.json"); // Load the JSON data

  let data = instaData[username]; // Find the user in the data

  // Check if the username exists in data.json
  if (data) {
    // Update the fields based on the form data from edit-profile.ejs
    data.profile = req.body.profile || data.profile; // If no new profile image, keep old one
    data.bio.line1 = req.body.bio_line1 || data.bio.line1;
    data.bio.line2 = req.body.bio_line2 || data.bio.line2;
    data.bio.line3 = req.body.bio_line3 || data.bio.line3;
    data.bio.line4 = req.body.bio_line4 || data.bio.line4;

    // Here, we'll just redirect back to the profile page to view the updated profile
    res.redirect(`/ig/${username}`);
  } else {
    res.render("error.ejs"); // Handle the case where the user is not found
  }
});

// Assuming you have loaded data.json into a variable like `users`
let users = require("./data.json");
const { name } = require("ejs");
const { log } = require("console");

app.delete("/ig/:username/:id", (req, res) => {
  let { id, username } = req.params;

  // Find the user by their username in your users object
  let user = users[username];

  if (user && user.posts) {
    // Filter out the post with the matching id
    user.posts = user.posts.filter((p) => p.id !== id);
  }

  // Redirect back to the user's profile page
  res.redirect(`/ig/${username}`);
});


//to search user
app.get("ig/search", (req, res) => {
  res.render("search.ejs");
});

//to send search results
app.get("/ig/search/users", (req, res) => {
  const searchQuery = req.query.query;  

  let data = require("./data.json");
  const matchedUsers = Object.keys(data)
    .filter(username => username.toLowerCase().includes(searchQuery))
    .map(username => {
      return {
        username: username,
        profile: data[username].profile,
        name: data[username].name
      };
    });
    
  res.json({ users: matchedUsers });
}); 

//search complete

app.get("/ig", (req, res) => {
  let data = require("./data.json");
  res.render("home.ejs", { data });
});

app.listen(port, () => {
  console.log("App is listening :", port);
});