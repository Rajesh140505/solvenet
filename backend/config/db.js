const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://rajesh140505_db_user:Rajesh140505%40@cluster0.auaiuiu.mongodb.net/solvenet';
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = dbConnection;
