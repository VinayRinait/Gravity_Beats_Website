const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Address = mongoose.Schema({
  streetName: { type: String, required: true },
  streetNumber: { type: String },
  city: { type: String, required: true },
  countryCode: { type: String, required: true },
  stateCode: { type: String, required: true },
  zipcode: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
});

const CustomDeliverySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  deliveryPartner: {
    type: String,
  },
  productImage: {
    type: String,
    required: true,
  },
  couponCode: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  pickupAddress: Address,
  dropoffAddress: Address,
  deliveryDistance: {
    type: Number,
    required: true,
  },
  baseFare: {
    type: Number,
    default: 0,
  },
  cashbackUsed: {
    type: Number,
    default: 0,
  },
  deliveryFee: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  instruction: {
    type: String,
    required: true,
  },
  deliveryTip: {
    type: Number,
    required: true,
  },
  Total: {
    type: Number,
    default: 0,
  },
  GST: {
    type: Number,
    default: 0,
  },
  surgeCharge: {
    type: Number,
    default: 0,
  },
});

const CustomDelivery = mongoose.model("CustomDelivery", CustomDeliverySchema);
module.exports = CustomDelivery;
