//import mongoose from 'mongoose';
const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("Database connection established")
    })
};

module.exports = connectDB;
