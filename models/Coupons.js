//import mongoose from 'mongoose';
const mongoose = require("mongoose");

const CouponsSchema = mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
      unique: true,
    },
    minimumOrderValue: {
      type: Number,
      default: 150
    },
    isPercent: {
      type: Boolean,
      default: true,
    },
    amountOff: {
      type: Number,
      default: 0,
    },
    timesredeemed: {
      type: Number,
      default: 0,
    },
    expiryDuration: {
      type: Date,
      required: true,
    },
    offeredBy: {
      type: String,
      required: true,
    },
    storeId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Coupons = mongoose.model("Coupons", CouponsSchema);
module.exports = Coupons;
