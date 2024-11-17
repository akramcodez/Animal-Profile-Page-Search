// routes/settings.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('settings/setting.ejs');
});
router.get('/learn-more', (req, res) => {
  res.render('settings/setting_learn_more.ejs');
});
router.get('/creators', (req, res) => {
  res.render('settings/setting_creators.ejs');
});
router.get('/help', (req, res) => {
  res.render('settings/setting_help.ejs');
});

module.exports = router;
