const mongoose = require("mongoose");

async function connectDB() {
  try {
    
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("✅ LAX MongoDB connected successfully");

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
}

module.exports = connectDB;
