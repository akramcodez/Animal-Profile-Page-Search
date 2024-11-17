const express = require('express');
const { readExplorePosts } = require('../utils/filePaths');
const router = express.Router();

// Route : Explore
router.get('/', (req, res) => {
  const allImages = [];
  let exploreData = readExplorePosts();
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
router.get('/:id', (req, res) => {
  let exploreData = readExplorePosts();
  let { id } = req.params;
  let img = null;
  let parent = null;

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
    res.status(404).render('error.ejs', { message: 'Post not found' });
  }
});

module.exports = router;
