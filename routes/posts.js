const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/filePaths');
const isValidUrl = require('../utils/isValidUrl');
const expressError = require('../utils/expressError');
const router = express.Router({ mergeParams: true });

// Route: Render New Post Page
router.get('/new', (req, res) => res.render('profile/new.ejs'));

// Route: Handle New Post Creation
router.post('/new', (req, res, next) => {
  const { image } = req.body;
  let users = readData();
  const tigerUser = users['tiger247'];

  // Check if the image URL is valid
  if (!image || !isValidUrl(image)) {
    return next(new expressError(400, 'Invalid or missing image URL'));
  }

  if (tigerUser) {
    const newPost = {
      id: uuidv4(),
      image: image,
      likes: Math.floor(Math.random() * 500) + 50,
      comments: Math.floor(Math.random() * 150) + 10,
    };

    tigerUser.posts.push(newPost);
    writeData(users, (err) => {
      if (err) {
        return next(new expressError(500, 'Error saving post data'));
      }

      req.session.destroy(() => {
        res.redirect('/');
      });
    });
  } else {
    return next(new expressError(404, 'User not found'));
  }
});

// Route: Show Post by ID
router.get('/:id', (req, res, next) => {
  let data = readData();
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
    res.render('posts/post.ejs', { post, parent });
  } else {
    next(new expressError(404, 'Post not found'));
  }
});

// Route: Render Edit Post Page
router.get('/:id/edit', (req, res, next) => {
  let data = readData();
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
    res.render('profile/edit.ejs', { post }); //edit.ejs is used for both edit post and create new post
  } else {
    next(new expressError(404, 'Post not found'));
  }
});

// Route: Handle Edit Post Submission
router.post('/:id/edit', (req, res, next) => {
  let data = readData();
  let { id } = req.params;
  let { image } = req.body;
  let post = null;

  // Validate the new image URL
  if (image && !isValidUrl(image)) {
    return next(new expressError(400, 'Invalid image URL'));
  }

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
    writeData(data, (err) => {
      if (err) {
        return next(new expressError(500, 'Error saving post data'));
      }
      req.session.destroy(() => {
        res.redirect('/');
      });
    });
  } else {
    next(new expressError(404, 'Post not found'));
  }
});

module.exports = router;
