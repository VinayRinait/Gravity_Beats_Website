//import mongoose from 'mongoose';
const mongoose = require("mongoose");

const NewsLetterSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const NewsLetter = mongoose.model("NewsLetter", NewsLetterSchema);
module.exports = NewsLetter;
