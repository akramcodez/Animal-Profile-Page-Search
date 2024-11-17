const express = require('express');
const { readData,writeData } = require('../utils/filePaths');
const router = express.Router({ mergeParams: true });

// Route: Animal Pages
router.get('/', (req, res) => {
  let instaData = readData();
  let { username } = req.params;
  let data = instaData[username.toLowerCase()];

  if (username === 'tiger247') {
    res.render('profile/myProfile.ejs', { data });
  } else if (data) {
    res.render('posts/insta.ejs', { data });
  } else {
    res.status(404).render('error.ejs', { message: 'User not found' });
  }
});

// Route: Profile Editing Page
router.get('/edit-profile', (req, res) => {
  let instaData = readData();
  let { username } = req.params;
  let data = instaData[username];
  res.render('profile/edit-profile.ejs', { data });
});

// Route: Save Edited Profile
router.post('/', (req, res) => {
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
      res.redirect('/');
    });
  } else {
    res.status(404).render('error.ejs', { message: 'User not found' });
  }
});

// Route: Delete Post
router.post('/delete', (req, res) => {
  const { username } = req.params;
  let users = readData();
  let user = users[username];

  if (user && user.posts) {
    user.posts = user.posts.filter((p) => p.id !== req.body.id);
    writeData(users);
  }

  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
