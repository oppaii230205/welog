const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Logging middleware for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting middleware to prevent brute-force attacks
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1h
  message: 'To many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public'))); // Auto correct the path name (missing or redundant '/')

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // filters out any keys that start with $ or contain a dot (.) to prevent NoSQL injection attacks

// Data sanitization against XSS (Cross-Site Scripting) attacks
app.use(xss()); // cleans up user input by removing any HTML tags or scripts that could be used for XSS attacks

// Prevent parameter pollution (removes duplicate query parameters). Can add whitelist options to allow certain parameters.
app.use(hpp());

// Reading data from the urlencoded form into req.body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
// must have '/' first
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

// Error handling middleware (must use regex in Express v5)
app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
