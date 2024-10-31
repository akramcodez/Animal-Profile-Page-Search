// Importing Modules and Setting Up Constants
const express = require("express");
const app = express();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const methodOverride = require("method-override");
const port = 8080;

// Middleware and App Configuration
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));

// Setting Up Paths and Utility Functions to Read and Write JSON Data
const indexFilePath = path.join(__dirname, "data", "index.json");
const readData = () => {
  return JSON.parse(fs.readFileSync(indexFilePath, "utf8"));
};
const writeData = (data) => {
  fs.writeFileSync(indexFilePath, JSON.stringify(data, null, 2));
};

const postsFilePath = path.join(__dirname, "data", "posts.json");
const readPosts = () => {
  return JSON.parse(fs.readFileSync(postsFilePath, "utf8"));
};

// Route: Home Page
app.get("/ig", (req, res) => {
  let data = readData();
  let posts = readPosts();

  const shuffledPosts = posts.sort(() => Math.random() - 0.5);
  res.render("home.ejs", { data, posts: shuffledPosts });
});


// Route: Home Page
app.get("/ig/:username", (req, res) => {
  let instaData = readData();
  let { username } = req.params;
  let data = instaData[username.toLowerCase()];

  if (username === "tiger247") {
    res.render("myProfile.ejs", { data });
  } else if (data) {
    res.render("insta.ejs", { data });
  } else {
    res.render("error.ejs");
  }
});

// Route: Profile Editing Page
app.get("/ig/:username/edit-profile", (req, res) => {
  let instaData = readData();
  let { username } = req.params;
  let data = instaData[username];
  res.render("edit-profile.ejs", { data });
});

// Route: Save Edited Profile
app.patch("/ig/:username", (req, res) => {
  let { username } = req.params;
  let instaData = readData();
  let data = instaData[username];

  if (data) {
    data.profile = req.body.profile || data.profile;
    data.bio.line1 = req.body.bio_line1 || data.bio.line1;
    data.bio.line2 = req.body.bio_line2 || data.bio.line2;
    data.bio.line3 = req.body.bio_line3 || data.bio.line3;
    data.bio.line4 = req.body.bio_line4 || data.bio.line4;
    writeData(instaData);
    res.redirect(`/ig/${username}`);
  } else {
    res.render("error.ejs");
  }
});

let users = readData();

// Route: Delete Post
app.delete("/ig/:username/:id", (req, res) => {
  let { id, username } = req.params;
  let user = users[username];

  if (user && user.posts) {
    user.posts = user.posts.filter((p) => p.id !== id);
    writeData(users);
  }

  res.redirect(`/ig/${username}`);
});

// Route: Search Page
app.get("/search", (req, res) => {
  res.render("search.ejs");
});

// Route: User Search Results
app.get("/ig/search/users", (req, res) => {
  const searchQuery = req.query.query;
  let data = readData();
  const matchedUsers = Object.keys(data)
    .filter((username) => username.toLowerCase().includes(searchQuery))
    .map((username) => {
      return {
        username: username,
        profile: data[username].profile,
        name: data[username].name,
      };
    });

  res.json({ users: matchedUsers });
});

// Starting the Server
app.listen(port, () => {
  console.log("App is listening on port:", port);
});
