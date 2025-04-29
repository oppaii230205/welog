const express = require('express');
const path = require('path');
const morgan = require('morgan');

const postRouter = require('./routes/postRoutes');

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public'))); // Auto correct the path name (missing or redundant '/')
// Middleware to parse JSON bodies
app.use(express.json({ limit: '10kb' }));
// Reading data from the urlencoded form into req.body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging middleware for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
// must have '/' first
app.use('/api/v1/posts', postRouter);

module.exports = app;
