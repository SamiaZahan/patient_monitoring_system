require('dotenv').config();
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s
})
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB Atlas:', error);
    process.exit(1);
  });
