const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/filePaths');

const router = express.Router({ mergeParams: true });

// Route: Render New Post Page
router.get('/new', (req, res) => res.render('profile/new.ejs'));

// Route: Handle New Post Creation
router.post('/new', (req, res) => {
  const { image } = req.body;
  let users = readData();
  const tigerUser = users['tiger247'];

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
      res.redirect('/');
    });
  } else {
    res.status(404).render('error.ejs', { message: 'User not found' });
  }
});

// Route: Show Post by ID
router.get('/:id', (req, res) => {
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
    res.status(404).render('error.ejs', { message: 'Post not found' });
  }
});

// Route: Render Edit Post Page
router.get('/:id/edit', (req, res) => {
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
    res.render('profile/edit.ejs', { post });
  } else {
    res.status(404).render('error.ejs', { message: 'Post not found' });
  }
});

// Route: Handle Edit Post Submission
router.post('/:id/edit', (req, res) => {
  let data = readData();
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
      res.redirect('/');
    });
  } else {
    res.status(404).render('error.ejs');
  }
});

module.exports = router;
