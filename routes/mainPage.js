const express = require('express');
const { readData, readPosts } = require('../utils/filePaths');
const expressError = require('../utils/expressError.js');
const router = express.Router();

// Route: Home Page
router.get('/', (req, res, next) => {
  let data = readData();
  let posts = readPosts();

  if (!data || !posts) {
    return next(new expressError(500, 'Error loading home data'));
  }

  const shuffledPosts = posts.sort(() => Math.random() - 0.5);
  res.render('main/home.ejs', { data, posts: shuffledPosts });
});

// Route: Search Page
router.get('/search', (req, res, next) => {
  res.render('main/search.ejs');
});

// Route: User Search Results
router.get('/search/users', (req, res, next) => {
  const searchQuery = req.query.query;
  let data = readData();

  if (!data) {
    return next(new expressError(500, 'Error loading user data'));
  }

  // Filter users based on the search query
  const matchedUsers = Object.keys(data)
    .filter((username) =>
      username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((username) => {
      return {
        username: username,
        profile: data[username].profile,
        name: data[username].name,
      };
    });

  res.json({ users: matchedUsers });
});

// Route : Log-out
router.get('/log-out', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
