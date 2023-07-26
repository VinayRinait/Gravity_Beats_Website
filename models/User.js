//import mongoose from "mongoose";
const mongoose = require("mongoose");
//import bcrypt from "bcryptjs";
const bcrypt = require("bcryptjs");

// const geocoder = require("../utils/geocoder.js");
const Address = mongoose.Schema({
  streetName: { type: String, required: true },
  streetNumber: { type: String },
  city: { type: String, required: true },
  countryCode: { type: String, required: true },
  stateCode: { type: String, required: true },
  zipcode: { type: String, required: true },
});

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
      minlength: 10,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    myFav: [
      {
        vendorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Store",
        },
      },
    ],
    otp: { type: String, default: "" },
    address: Address,
    cashbackAvailable: {
      type: Number,
      default: 0,
    },
    cashback: [
      {
        expiryDate: {
          type: Date,
        },
        amount: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
