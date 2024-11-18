const express = require('express');
const { readData, writeData } = require('../utils/filePaths');
const expressError = require('../utils/expressError.js');
const isValidUrl = require('../utils/isValidUrl');
const router = express.Router({ mergeParams: true });

// Route: Animal Pages
router.get('/', (req, res, next) => {
  let instaData = readData();
  let { username } = req.params;
  let data = instaData[username.toLowerCase()];

  if (!data && username !== 'tiger247') {
    return next(new expressError(404, 'User not found'));
  }

  if (username === 'tiger247') {
    return res.render('profile/myProfile.ejs', { data });
  } else {
    return res.render('posts/insta.ejs', { data });
  }
});

// Route: Profile Editing Page
router.get('/edit-profile', (req, res, next) => {
  let instaData = readData();
  let { username } = req.params;
  let data = instaData[username];

  if (!data) {
    return next(new expressError(404, 'User not found'));
  }

  res.render('profile/edit-profile.ejs', { data });
});


// Route: Save Edited Profile
router.post('/', (req, res, next) => {
  let { username } = req.params;
  let instaData = readData();
  let data = instaData[username];

  if (!data) {
    return next(new expressError(404, 'User not found'));
  }

  const { profile, bio_line1, bio_line2, bio_line3, bio_line4 } = req.body;

  if (profile && !isValidUrl(profile)) {
    return next(new expressError(400, 'Invalid profile image URL'));
  }

  if (!bio_line1 || !bio_line2 || !bio_line3 || !bio_line4) {
    return next(new expressError(400, 'All bio fields must be filled'));
  }

  data.profile = profile || data.profile;

  data.bio.line1 = bio_line1 || data.bio.line1;
  data.bio.line2 = bio_line2 || data.bio.line2;
  data.bio.line3 = bio_line3 || data.bio.line3;
  data.bio.line4 = bio_line4 || data.bio.line4;

  writeData(instaData, (err) => {
    if (err) {
      return next(new expressError(500, 'Error saving profile data'));
    }
  });

  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Route: Delete Post
router.post('/delete', (req, res, next) => {
  const { username } = req.params;
  let users = readData();
  let user = users[username];

  if (!user || !user.posts) {
    return next(new expressError(404, 'User or posts not found'));
  }

  user.posts = user.posts.filter((p) => p.id !== req.body.id);

  writeData(users, (err) => {
    if (err) {
      return next(new expressError(500, 'Error deleting post data'));
    }
  });

  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
