// Importing Modules and Setting Up Constants
const express = require("express");
const session = require("express-session");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const port = 8080;

// Middleware and App Configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));

// Set up session middleware
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Setting Up Paths and Utility Functions to Read and Write JSON Data
const indexFilePath = path.join(__dirname, "data", "index.json");
const readData = () => JSON.parse(fs.readFileSync(indexFilePath, "utf8"));
const writeData = (data) =>
  fs.writeFileSync(indexFilePath, JSON.stringify(data, null, 2));

const postsFilePath = path.join(__dirname, "data", "posts.json");
const readPosts = () => JSON.parse(fs.readFileSync(postsFilePath, "utf8"));

// Route: Sign-up / Sign-in Page
app.get("/", (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect("/ig");
  }
  res.render("signup.ejs", { error: "" });
});

// Route: Handle Sign-up or Sign-in Logic
app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  if (username === "anigram@gmail.com" && password === "by-akram") {
    req.session.isAuthenticated = true;
    res.redirect("/ig");
  } else {
    res.render("signup.ejs", {
      error:
        "Warning: Invalid Credentials! Please check the input fields, then try again",
    });
  }
});

// Route: Home Page
app.get("/ig", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/");
  }

  let data = readData();
  let posts = readPosts();
  const shuffledPosts = posts.sort(() => Math.random() - 0.5);
  res.render("home.ejs", { data, posts: shuffledPosts });
});

// Route : Setting
app.get("/ig/settings", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/");
  }

  res.render("setting.ejs");
});

// Route : Setting . learn more
app.get("/ig/settings/learn-more", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/");
  }

  res.render("setting_learn_more.ejs");
});

// Route : Setting . creators
app.get("/ig/settings/creators", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/");
  }

  res.render("setting_creators.ejs");
});

// Route : Setting . creators
app.get("/ig/settings/help", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/");
  }

  res.render("setting_help.ejs");
});

// Route : log-out
app.get("/log-out", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Route: Profile Page
app.get("/ig/:username", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/");
  }

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
app.post("/ig/:username", (req, res) => {
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

    req.session.destroy(() => {
      res.redirect("/");
    });
  } else {
    res.render("error.ejs");
  }
});

// Route: Delete Post
app.post("/ig/:username/delete", (req, res) => {
  const { username } = req.params;
  let users = readData();
  let user = users[username];

  if (user && user.posts) {
    user.posts = user.posts.filter((p) => p.id !== req.body.id);
    writeData(users);
  }

  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Route: Search Page
app.get("/search", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/");
  }

  res.render("search.ejs");
});

// Route: User Search Results
app.get("/ig/search/users", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/");
  }

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
