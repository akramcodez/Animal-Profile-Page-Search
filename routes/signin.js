const express = require('express');
const router = express.Router();

// Route: Sign-up / Sign-in Page
router.get('/', (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect('/ig');
  }
  res.render('auth/signup.ejs', { error: '' });
});

// Route: Handle Sign-up or Sign-in Logic
router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  if (email === 'anigram@gmail.com' && password === 'by-akram') {
    req.session.isAuthenticated = true;
    res.redirect('/ig');
  } else {
    res.render('auth/signup.ejs', {
      error:
        'Warning: Invalid Credentials! Please check the input fields, then try again',
    });
  }
});

module.exports = router;
