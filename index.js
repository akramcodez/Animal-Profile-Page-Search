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

const messageFilePath = path.join(__dirname, "data", "message.json");
const readMessages = () => JSON.parse(fs.readFileSync(messageFilePath, "utf8"));

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

//message button clicked
app.get("/message/:user", (req, res) => {
  res.render("message.ejs");
});

app.get('/messages/:user1/:user2', (req, res) => {
  const { user1, user2 } = req.params;
  let messages = readMessages();
  let chat = messages[user1] && messages[user1][user2] || [];

  //detail
  let data = readData();
  const matchedUsers = Object.keys(data)
      .filter((username) => username.toLowerCase().includes(user2))
      .map((username) => {
        return {
          username: username,
          profile: data[username].profile,
          name: data[username].name,
        };
      });

  res.json({ messages: chat, detail: matchedUsers });
});

// Endpoint to handle new messages

//auto-reply
const autoReplies = {
  hello: "Hi there!",
  hi: "Hi there!",
  bye: "Bye!",
  see_you: "See you later!",
  greetings: "Greetings!",
  howdy: "Howdy, partner!",
  goodbye: "Take care!",
  thanks: "You're welcome!",
  farewell: "Farewell!",
  "good night": "Goodnight!",
  "how are you": "I'm doing well, thank you!",
  "what's the weather like": "It's sunny with a chance of rainbows!",
  "what's your name": "My name is Delta!",
  "how old are you": "I'm 27 years old!",
  "what do you do for a living": "I'm a software engineer!",
  help: "How can I assist you?",
  weather: "It's sunny with a chance of rainbows!",
  news: "Stay informed, but stay positive!",
  joke: "Why did the web developer go broke? Because they used up all their cache!",
  music: "Here's a tune suggestion: 'Code and Chill.'",
  "what's up": "Just coding away!",
  "what's new": "I'm always here to help!",
  "what's your favorite color": "I'm a bit of a color person, but my favorite color is blue!",
  "what's your favorite animal": "I'm a bit of a animal person, but my favorite animal is a tiger!",
  "what's your favorite book": "I'm a bit of a book person, but my favorite book is 'The Great Gatsby.'",
  "what's your favorite movie": "I'm a bit of a movie person, but my favorite movie is 'The Shawshank Redemption.'",
  "what's your favorite song": "I'm a bit of a song person, but my favorite song is 'Shape of You.'",
  "what's your favorite TV show": "I'm a bit of a TV show person, but my favorite TV show is 'Friends.'",
  "what's your favorite sport": "I'm a bit of a sport person, but my favorite sport is basketball!",
  "what's your favorite game": "I'm a bit of a game person, but my favorite game is 'Minecraft.'",
  "what's your favorite food": "I'm a bit of a food person, but my favorite food is 'Pizza.'",
  "what's your favorite place": "I'm a bit of a place person, but my favorite place is 'New York City.'",
  "what's your favorite activity": "I'm a bit of an activity person, but my favorite activity is playing basketball with friends!",
  "what's your favorite thing to do": "I'm a bit of a thing to do person, but my favorite thing to do is going to the beach with friends!",
};

app.post('/messages/:sender/:receiver', (req, res) => {
  const { sender, receiver } = req.params;
  const { message } = req.body;
  const lowerCaseMessage = message.toLowerCase();
  const timestamp = new Date().toISOString();

  // Load current data from message.json
  fs.readFile(messageFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading message data");
    }

    const messages = JSON.parse(data);

    // Ensure the sender exists in the data
    if (!messages[sender]) {
      messages[sender] = {};
    }

    // Ensure the conversation with the receiver exists
    if (!messages[sender][receiver]) {
      messages[sender][receiver] = [];
    }

    // Append the new message
    messages[sender][receiver].push({ sender, message, timestamp });
  });
  let autoReplyMessage = null;
  for (let keyword in autoReplies) {
    if (lowerCaseMessage.includes(keyword)) {
      autoReplyMessage = autoReplies[keyword];
      break;
    } else {
      autoReplyMessage = ("I don't wanna reply with that. Sorry! :(");
    }
  }
  if (autoReplyMessage) {
    res.json({ autoReply: autoReplyMessage});
  } else {
    res.json({ success: true });
  }
});



// Starting the Server
app.listen(port, () => {
  console.log("App is listening on port:", port);
});
