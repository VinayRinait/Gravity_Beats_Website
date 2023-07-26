//import mongoose from 'mongoose';
const mongoose = require("mongoose");

const ReviewsSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    vendorId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Reviews = mongoose.model("Reviews", ReviewsSchema);
module.exports = Reviews;
