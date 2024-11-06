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
const postsFilePath = path.join(__dirname, "data", "posts.json");

// Utility functions to read and write JSON data
const readData = () => JSON.parse(fs.readFileSync(indexFilePath, "utf8"));
const writeData = (data) =>
  fs.writeFileSync(indexFilePath, JSON.stringify(data, null, 2));
const readPosts = () => JSON.parse(fs.readFileSync(postsFilePath, "utf8"));

// Load data from index.json
let data = readData();

// Check and update post IDs if needed
let needsUpdate = false;
for (const key in data) {
  const user = data[key];
  user.posts = user.posts.map((post) => {
    if (post.id === "no") {
      needsUpdate = true;
      return {
        ...post,
        id: uuidv4(),
      };
    }
    return post;
  });
}

// Only write data if updates were made
if (needsUpdate) {
  writeData(data);
  console.log("IDs updated in index.json");
} else {
  console.log("No IDs needed updating in index.json");
}

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/");
  }
  next();
};

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

// Apply the authMiddleware to both /ig and /search routes
app.use("/ig", authMiddleware);

// Route: Home Page
app.get("/ig", (req, res) => {
  let posts = readPosts();
  const shuffledPosts = posts.sort(() => Math.random() - 0.5);
  res.render("home.ejs", { data, posts: shuffledPosts });
});

// Route : Settings and Subpages
app.get("/ig/settings", (req, res) => res.render("setting.ejs"));
app.get("/ig/settings/learn-more", (req, res) => res.render("setting_learn_more.ejs"));
app.get("/ig/settings/creators", (req, res) => res.render("setting_creators.ejs"));
app.get("/ig/settings/help", (req, res) => res.render("setting_help.ejs"));

// Route : Log-out
app.get("/log-out", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Route: Search Page
app.get("/ig/search", (req, res) => {
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

// Route: Animal Pages
app.get("/ig/:username", (req, res) => {
  let instaData = readData();
  let { username } = req.params;
  let data = instaData[username.toLowerCase()];

  if (username === "tiger247") {
    res.render("myProfile.ejs", { data });
  } else if (data) {
    res.render("insta.ejs", { data });
  } else {
    res.status(404).render("error.ejs", { message: "User not found" });
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
    res.status(404).render("error.ejs", { message: "User not found" });
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

// Route : New Page and Post Addition
app.get("/ig/post/new", (req, res) => res.render("new.ejs"));

app.post("/ig/post/new", (req, res) => {
  const { image } = req.body;
  let users = readData();
  const tigerUser = users["tiger247"];

  if (tigerUser) {
    const newPost = {
      id: uuidv4(),
      image: image,
      likes: Math.floor(Math.random() * 500) + 50,
      comments: Math.floor(Math.random() * 150) + 10,
    };

    tigerUser.posts.push(newPost);

    writeData(users);

    req.session.destroy(() => {
      res.redirect("/");
    });
  } else {
    res.status(404).render("error.ejs", { message: "User not found" });
  }
});

// Route: Show and Edit Post Pages
app.get("/ig/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = null;
  let parent = null;

  for (const key in data) {
    const user = data[key];
    const foundPost = user.posts.find((p) => p.id === id);
    if (foundPost) {
      post = foundPost;
      parent = user;
      break;
    }
  }

  if (post && parent) {
    res.render("post.ejs", { post, parent });
  } else {
    res.status(404).render("error.ejs", { message: "Post not found" });
  }
});

app.get("/ig/post/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = null;

  for (const key in data) {
    const user = data[key];
    const foundPost = user.posts.find((p) => p.id === id);
    if (foundPost) {
      post = foundPost;
      break;
    }
  }

  if (post) {
    res.render("edit.ejs", { post });
  } else {
    res.status(404).render("error.ejs", { message: "Post not found" });
  }
});

app.post("/ig/post/:id/edit", (req, res) => {
  let { id } = req.params;
  let { image } = req.body;
  let post = null;

  for (const key in data) {
    const user = data[key];
    const foundPost = user.posts.find((p) => p.id === id);
    if (foundPost) {
      post = foundPost;
      break;
    }
  }

  if (post) {
    post.image = image;

    writeData(data); 

    req.session.destroy(() => {
    res.redirect("/");
  });
  } else {
    res.status(404).render("error.ejs");
  }
});

// Error-handling middleware for the /ig route
app.use("/ig", (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error.ejs", { message: "Something went wrong!" });
});

// Start the Server
app.listen(port, () => {
  console.log(`App is running at Port : ${port}`);
});
