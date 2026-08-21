const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
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
    });

    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

module.exports = connectDB;
