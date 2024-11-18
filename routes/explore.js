const express = require('express');
const { readExplorePosts } = require('../utils/filePaths');
const expressError = require('../utils/expressError.js');
const router = express.Router();

// Route: Explore
router.get('/', (req, res, next) => {
  const allImages = [];
  let exploreData = readExplorePosts();

  if (!exploreData) {
    return next(new expressError(500, 'Error loading explore data'));
  }

  exploreData.forEach((animal) => {
    animal.pic.forEach((image) => {
      allImages.push(image);
    });
  });

  const shuffledImages = allImages.sort(() => 0.5 - Math.random());
  const randomImages = shuffledImages.slice(0, 21);

  res.render('explore/explore.ejs', { images: randomImages });
});

// Route: Show and Edit Post Pages
router.get('/:id', (req, res, next) => {
  let exploreData = readExplorePosts();
  let { id } = req.params;
  let img = null;
  let parent = null;

  if (!exploreData) {
    return next(new expressError(500, 'Error loading explore data'));
  }

  exploreData.forEach((animal) => {
    animal.pic.forEach((image) => {
      if (image.id === id) {
        img = image;
        parent = animal;
      }
    });
  });

  if (img && parent) {
    res.render('explore/explore-zoom.ejs', { img, parent });
  } else {
    next(new expressError(404, 'Post not found'));
  }
});

module.exports = router;
