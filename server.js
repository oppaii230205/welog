const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Synchronous error handling
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  // console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

const app = require('./app');

const port = process.env.PORT || 3000;

// Connect .env file to our application
dotenv.config({ path: './config.env' });

// Connect to MongoDB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    //useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

// Start the server
console.log(`Running in ${process.env.NODE_ENV} mode`);

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Asynchronous error handling
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); // '1' stands for unhandled rejection, '0' for success
  });
});
