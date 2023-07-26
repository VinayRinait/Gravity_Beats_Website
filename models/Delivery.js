//import mongoose from "mongoose";
const mongoose = require("mongoose");
//import bcrypt from "bcryptjs";
const bcrypt = require("bcryptjs");

const geocoder = require("../utils/geocoder.js");

const deliverySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    orderType: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      default: "Available",
    },
    orderReference: {
      type: String,
    },
    drivingLicense: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    tShirt: { type: String, required: true },
    otp: { type: String, default: "" },
    upiId: { type: String, unique: true },
    panNo: { type: String, unique: true },
    panImage: { type: String, default: "null" },
    voterImage: { type: String, default: "null" },
    aadharImage: { type: String, default: "null" },
    userImage: { type: String, required: true },
    drivinglicenseImage: { type: String, required: true },
    voterId: { type: String, unique: true },
    aadharNo: { type: String, unique: true },
    vehicleRC: { type: String, unique: true },
    insurancePolicy: { type: String, unique: true },
    bankName: { type: String, required: true },
    accountHolder: { type: String, required: true },
    accountNo: { type: Number, required: true },
    ifsc: { type: String, required: true },
    todayOrders: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    incentives: [
      {
        amount: {
          type: Number,
          default: 0,
        },
        date: {
          type: Date,
        },
        thisMonth: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

deliverySchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

deliverySchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;
