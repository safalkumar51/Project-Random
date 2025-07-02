const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to Database!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Optional: Exit the process if connection fails
  });

module.exports = mongoose.Connection;