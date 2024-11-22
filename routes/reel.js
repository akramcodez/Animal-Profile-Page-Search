const express = require('express');
const router = express.Router();
const { readReels } = require('../utils/filePaths');

router.get('/', (req, res, next) => {
  const reelData = readReels(); 

  if (!reelData) {
    return next(new Error('Error loading reels data'));
  }

  res.render('reels/reels.ejs', { videos: reelData }); 
});

module.exports = router;
