const mongoose = require("mongoose");

const connectDB = async () => {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    let url = process.env.MONGO_URI?.trim();
    if (!url) {
      throw new Error("MONGO_URI is undefined. Check your .env file location.");
    }
    if (url.startsWith("MONGO_URI=")) {
      url = url.replace(/^MONGO_URI=/, "").trim();
    }
    await mongoose.connect(url, {
      dbName: "JewelTrack",
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;

