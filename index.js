const express = require("express");
const app = express();
const fs = require("fs"); // To read/write files
const { v4: uuidv4 } = require("uuid"); // Import UUID
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

//Home Route
app.get("/ig", (req, res) => {
  let data = require("./data.json");
  res.render("home.ejs", { data });
});

//Profile Route
app.get("/ig/:username", (req, res) => {
  let instaData = require("./data.json");
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

// Get page to edit profile information
app.get("/ig/:username/edit-profile", (req, res) => {
  let instaData = require("./data.json");
  let { username } = req.params;
  let data = instaData[username];
  res.render("edit-profile.ejs", { data });
});

// Submit the newly changed profile data
app.patch("/ig/:username", (req, res) => {
  let { username } = req.params; 
  let instaData = require("./data.json"); 

  let data = instaData[username]; 


  if (data) {
    data.profile = req.body.profile || data.profile; 
    data.bio.line1 = req.body.bio_line1 || data.bio.line1;
    data.bio.line2 = req.body.bio_line2 || data.bio.line2;
    data.bio.line3 = req.body.bio_line3 || data.bio.line3;
    data.bio.line4 = req.body.bio_line4 || data.bio.line4;

  
    res.redirect(`/ig/${username}`);
  } else {
    res.render("error.ejs");
  }
});

let users = require("./data.json");
const { name } = require("ejs");
const { log } = require("console");

//Delete Route
app.delete("/ig/:username/:id", (req, res) => {
  let { id, username } = req.params;
  let user = users[username];

  if (user && user.posts) {
    user.posts = user.posts.filter((p) => p.id !== id);
  }

  res.redirect(`/ig/${username}`);
});

//to search user
app.get("/search", (req, res) => {
  res.render("search.ejs");
});

//to send search results
app.get("/ig/search/users", (req, res) => {
  const searchQuery = req.query.query;

  let data = require("./data.json");
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

app.listen(port, () => {
  console.log("App is listening :", port);
});
