require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const cors = require('cors');

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

if (!mongoURI) {
  console.error('MongoDB connection string is missing. Please check your .env file.');
  process.exit(1); 
}
mongoose.connect(mongoURI)
.then(() => {
  console.log('MongoDB connected');
  app.use(cors());
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error('MongoDB connection error:', err));
