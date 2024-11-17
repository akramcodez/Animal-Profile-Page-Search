// Importing Modules and Setting Up Constants
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 8080;

// Import routes from external files
const signinRoutes = require('./routes/signin');
const mainPageRoutes = require('./routes/mainPage.js');
const settingsRoutes = require('./routes/settings');
const exploreRoutes = require('./routes/explore');
const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const msgRoutes = require('./routes/msg');

// Import auto-replies from external file
const autoReplies = require('./config/autoReplies');

// Middleware and App Configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));

// Set up session middleware
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.redirect('/');
  }
  next();
};

app.use('/', signinRoutes);

// Apply the authMiddleware to both /ig and /search routes
app.use('/ig', authMiddleware);

app.use('/ig', mainPageRoutes);
app.use('/ig/settings', settingsRoutes);
app.use('/ig/explore', exploreRoutes);
app.use('/ig/:username', usersRoutes);
app.use('/ig/posts', postsRoutes);
app.use('/', msgRoutes);

// Catch-all route for undefined paths under /ig
app.use('/ig/*', (req, res) => {
  res.status(404).render('error.ejs', { message: 'Page not found' });
});

// Error-handling middleware for the /ig route
app.use('/ig', (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error.ejs', { message: 'Something went wrong!' });
});

// Starting the Server
app.listen(port, () => {
  console.log(`App is running at Port : ${port}`);
});
