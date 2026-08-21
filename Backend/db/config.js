const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const url = process.env.MONGO_URI?.trim();
    if (!url) {
      throw new Error("MONGO_URI is undefined. Check your .env file location.");
    }
    await mongoose.connect(url, {
      dbName: "JewelTrack",
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
