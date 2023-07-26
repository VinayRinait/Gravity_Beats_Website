//import mongoose from "mongoose";
const mongoose = require("mongoose");
//import bcrypt from "bcryptjs";
const bcrypt = require("bcryptjs");

const ProductSchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  vendorId: {
    type: String,
    required: true,
  },
  variable: [
    {
      variableName: {
        type: String,
        required: true,
      },
      topSelling: {
        type: Boolean,
        default: false,
      } ,
      price: {
        type: Number,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
      inStock: {
        type: Boolean,
        default: true,
      },
    },
  ],
  gst: {
    type: Number,
    default: 0,
  },
  veg: {
    type: Boolean,
    default: true,
  },
  bestSeller: {
    type: Boolean,
    default: false,
  },
  chefSpecial: {
    type: Boolean,
    default: false,
  },
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
