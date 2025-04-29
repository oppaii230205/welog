const dotenv = require('dotenv');

const app = require('./app');

const port = process.env.PORT || 3000;

// Connect .env file to our application
dotenv.config({ path: './config.env' });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
