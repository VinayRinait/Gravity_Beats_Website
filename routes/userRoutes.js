//import express from 'express';
const express = require("express");
// import {
// register,
// login
// } from "../controller/userController.js"
const {
  reduceQuantity,
  fetchCategories,
  fetchsubCategories,
  fetchCoupons,
  viewCart,
  addNew,
  cancelOrder,
  discardCart,
  particularOrder,
  register,
  login,
  newAddress,
  terms,
  addComplain,
  addReview,
  myorders,
  myAddress,
  fetchBycategory,
  fetchProducts,
  placeOrder,
  wallet,
  myaccount,
  addPrescription,
  fetchStorebySubcategory,
  getsubCategory,
  addTip,
  addInstruction,
  updateAddress,
  removeCoins,
  prescriptionOrder,
  viewCoupon,
  fetchCouponStore,
  addFav,
  orderRating,
  customDelivery,
  assignCustomDelivery,
  removeFav,
  storeReviews,
  showFav,
  changePassword,
  sendLink,
  resetLink,
  viewProduct,
  fetchFirstProducts,
  logout,
  sendMailer,
  createTransanction,
  getSubCategoryById,
  getSubCategoryId,

} = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware.js");

const { sendmyOtp, verifymyOtp } = require("../controller/OtpVerify.js");
const mailer = require("../middleware/mailer");
const router = express.Router();

router.post("/register", register);
router.put(`/removeCoins`, removeCoins);
router.post(`/changePassword`, changePassword);
router.post(`/sendLink`, sendLink);
router.post(`/resetLink/:tokenId`, resetLink);
router.post(`/addInstruction/:orderId`, addInstruction);
router.post(`/addTip/:orderId`, addTip);
router.post(`/orderRating`, orderRating);
router.post(`/addFav`, addFav);
router.get(`/showFav`, showFav);
router.post(`/removeFav`, removeFav);
router.post(`/storeReviews`, storeReviews);
router.post(`/viewCoupon`, viewCoupon);
router.post("/addPrescription", addPrescription);
router.post("/sendmyOtp", sendmyOtp);
router.post("/verifymyOtp", verifymyOtp);
router.post(`/viewProduct`, viewProduct);
router.post("/login", login);
router.get(`/fetchCoupons/:categoryId`, fetchCoupons);

router.get(`/fetchCategories`, fetchCategories);
router.get(`/fetchBycategory/:categoryId`, protect, fetchBycategory);

router.get(`/wallet`, wallet);
router.get(`/myaccount`, myaccount);

//satendra api
router.post(`/getSubCategoryById`, getSubCategoryById);


router.get(`/fetchsubCategories`, fetchsubCategories);


router.get(`/getsubCategory/:vendorId`, getsubCategory);

router.post(`/addNew/:productid`, addNew);
router.post(`/reduceQuantity/:productid`, reduceQuantity);
router.get(`/viewCart`, viewCart);
router.post("/newAddress", newAddress);
router.post("/addComplain", addComplain);
router.put("/discardCart", discardCart);
router.post("/addReview", addReview);
router.get("/myorders", myorders);
router.post(`/cancelOrder/:orderId`, cancelOrder);
router.post(`/updateAddress/:addressId`, updateAddress);
router.get(`/fetchCouponStore/:couponId`, fetchCouponStore);
router.get("/particularOrder/:orderId", particularOrder);
router.get("/myAddress", myAddress);


router.get(`/fetchStorebySubcategory/:subcategoryId`, protect, fetchStorebySubcategory);



router.get("/terms", terms);
router.get(`/fetchProducts/:vendorId/:categoryName`, protect, fetchProducts);
router.get(`/fetchFirstProducts/:vendorId`, protect, fetchFirstProducts);
router.post(`/placeOrder`, placeOrder);
router.post(`/customDelivery`, customDelivery);
router.post(`/prescriptionOrder`, prescriptionOrder);
router.post(`/transanction`, createTransanction);
router.post(`/assignCustomDelivery/:orderId`, assignCustomDelivery);
router.get("/logout", logout);

module.exports = router;
