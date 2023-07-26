//import express from 'express';
const express = require("express");
//import {protect} from '../middleware/authMiddleware.js';
const { protect } = require("../middleware/authMiddleware.js");

const {
  assignDelivery,
  getallorders,
  topselling,
  betweendates,
  updateOrderStatus,
  declineOrderStatus,
  walletAmount,
  fetchReviews,
  prescriptionOrder,
} = require("../controller/orderController");

const router = express.Router();
 
router.get(`/betweendates`, protect, betweendates);
router.get(`/topselling`, protect, topselling);
router.post(`/assignDelivery/:orderId`, assignDelivery);
router.post(`/updateOrderStatus/:orderId`, updateOrderStatus);
router.post(`/prescriptionOrder/:orderId`, prescriptionOrder);
router.post(`/declineOrderStatus/:orderId`, declineOrderStatus);
router.get(`/walletAmount`, protect, walletAmount);
router.get(`/fetchReviews`, protect, fetchReviews);
router.get(`/getallorders`, protect, getallorders);

module.exports = router;
