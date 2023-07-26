
//import mongoose from "mongoose";
const mongoose = require("mongoose");
//import bcrypt from "bcryptjs";
const bcrypt = require("bcryptjs");

const AddressSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  addressType: { type: String, required: true },
  streetName: { type: String, required: true },
  streetNumber: { type: String },
  city: { type: String, required: true },
  countryCode: { type: String, required: true },
  stateCode: { type: String, required: true },
  zipcode: { type: String, required: true },
});

const Address = mongoose.model("Address", AddressSchema);
module.exports = Address;
