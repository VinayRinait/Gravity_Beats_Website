//import mongoose from 'mongoose';
const mongoose = require("mongoose");
const CategorySchema = mongoose.Schema({
  parent: {
    type: String,
    required: true,
  },
  // subcategory: {
  //   type: String,
  //   required:false,
  // },
  image: {
    type: String,
    required: true,
  },
  bgColor: {
    type: String,
    required: true,
  },
  hsnCode: {
    type: String,
    required: true,
  },
  gstPercent: {
    type: Number,
    required: true,
  },
  commision: {
    type: Number,
    default: 100
  },
  cashBack: {
    type: Number,
    required: true,
  },
  commision: {
    type: Number,
    required: true,
  },
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
