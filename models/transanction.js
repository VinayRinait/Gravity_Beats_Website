//import mongoose from 'mongoose';
const mongoose = require("mongoose");
const TransanctionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Transanction = mongoose.model("transanction", TransanctionSchema);
module.exports = Transanction;
