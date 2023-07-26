//import express, { Router } from 'express';
const express = require("express");
//import {registerStore, login} from '../controller/StoreController.js';
const {
  registerStore,
  login,
  updateStore,
  terms,
  support,
  goOffline,
  goOnline,
  addtoMenu,
  removefromMenu,
  packagingCharge,
  updateStation,
  createCoupons,
  deleteCoupons,
  viewAdminCoupon,
  showMenu,
  addCoupon,
  viewCoupon,
  sendLink,
  inStock,
  resetLink,
  changePassword,
  outOfStock,
  storeProfile,
} = require("../controller/StoreController.js");
const { protect } = require("../middleware/authMiddleware.js");
const { sendstoreOtp, verifystoreOtp } = require("../controller/OtpVerify.js");
const upload = require("../middleware/upload.js");
const {filterStore} = require("../controller/StoreController");

const router = express.Router();
router.post(
  `/register-store`,
  upload.fields([
    { name: "cancelledCheque", maxCount: 1 },
    { name: "storeImage" , maxCount: 1 },
    { name: "uploadGSTcertificate", maxCount: 1 },
    { name: "licenseImage", maxCount: 1 },
    { name: "uploadPan", maxCount: 1 },
    { name: "uploadMenu", maxCount: 1 },
  ]),
  registerStore
);
router.post(
  `/update-store`,
  updateStore
);
router.post(`/login`, login);
router.post(`/changePassword`, changePassword);
router.post(`/inStock/:productId`, inStock);
router.post(`/resetLink/:tokenId`, resetLink);
router.post("/sendstoreOtp", sendstoreOtp);
router.post("/verifystoreOtp", verifystoreOtp);
router.post(`/sendLink`, sendLink);
router.get(`/showMenu`, showMenu);
router.post(`/packagingCharge`, packagingCharge);
router.post(`/updateStation`, updateStation);
router.get(`/viewAdminCoupon`, viewAdminCoupon);
router.post(`/addtoMenu`, addtoMenu);
router.post(`/removefromMenu`, removefromMenu);
router.get(`/viewCoupon`, viewCoupon);
router.put(`/goOnline`, goOnline);
router.post(`/deleteCoupons/:couponId`, deleteCoupons);
router.put(`/goOffline`, goOffline);
router.post(`/addCoupon`, addCoupon);
router.post(`/createCoupons`, createCoupons);
router.get("/terms", terms);
router.post("/support", support);
router.put("/outStock/:id", outOfStock);
router.get("/mystore", storeProfile);
router.get('/filter', filterStore);

module.exports = router;
