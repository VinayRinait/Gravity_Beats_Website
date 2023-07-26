//import mongoose from 'mongoose';
const mongoose = require("mongoose");
const BannerSchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Banner = mongoose.model("banner", BannerSchema);
module.exports = Banner;
