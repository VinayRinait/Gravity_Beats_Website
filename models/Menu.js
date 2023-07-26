//import mongoose from "mongoose";
const mongoose = require("mongoose");
//import bcrypt from "bcryptjs";
const bcrypt = require("bcryptjs");

const MenuSchema = mongoose.Schema({
  vendorId: {
    type: String,
    required: true,
  },
  menu: [
    {
      productName: {
        type: String,
        reuired: true,
      },
      productPrice: {
        type: String, 
        required: true,
      },
    }, 
  ],
});

const Menu = mongoose.model("Menu", MenuSchema);
module.exports = Menu;
