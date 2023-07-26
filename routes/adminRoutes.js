const express = require("express");
const upload = require('../middleware/upload')
// const path = require('path')
// const multer = require("multer");
// var storage = multer.diskStorage({
//   destination:'./uploads/',
//     filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now()+ path.extname(file.originalname));
//   },
// });

// var uploads = multer({ storage: storage });
const {
  createCategory,
  updateCategory,
  deleteCategory,
  createCoupons,
  deleteCoupons,
  register,
  addMenu,
  showMenu,
  login,
  logout,
  getAdmin,
  viewVendors,
  approveVendors,
  disapproveVendors,
  removeVendor,
  viewDelivery,
  approveDelivery,
  disapproveDelivery,
  removeDelivery,
  viewCustomers,
  viewComplaints,
  addressComplaints,
  viewParticularVendor,
  viewCoupon,
  viewCategory,
  fetchSubcategory,
  getIncentiveAmount,
  sendIncentive,
  settleMonthlyIncentive,
  updateIncentiveAmount,
  addStation,
  updateCashback,
  viewParticularDelivery,
  updateCharges,
  sendnotice,
  updateTerms,
  termsConditions,
  viewSlots,
  toggleSlot,
  removeSlot,
  addSlot,
  updateUser,
  deleteUser,
  getCharges,
  createBanner,
  getBanner,
  updateBanner,
  deleteBanner, 
  getBannerById,
  updateAdminController,
  getAdminController,
  viewProducts,
  totalOrder,
  latestOrder,
  userData,
  totalUser,
  orderData,
  getAllOrder,
  getCategoryCom,
  createsubCategory,
  viewSubCategory,
  updatesubCategory,
  getTransanction,
  viewSubCategorybycategoryid,
  deleteSubCategory,

  } = require("../controller/AdminController.js");

const { signNewsletter } = require("../controller/NewsController.js");
const { protect } = require("../middleware/authMiddleware.js");
const { sendadminOtp, verifyadminOtp } = require("../controller/OtpVerify.js");

const router = express.Router();
router.get(`/gettransanction`, getTransanction);
router.post(`/register`, register);
router.post(`/sendNotice`, sendnotice);
router.post(`/removeSlot`, removeSlot);
router.post(`/addSlot`, addSlot);
router.post(`/toggleSlot`, toggleSlot);
router.get(`/termsConditions`, termsConditions);
router.get(`/viewSlots`, viewSlots);
router.post(`/updateTerms`, updateTerms);
router.post(`/updateCashback`, updateCashback);
router.post(`/addStation`, addStation);
router.get(`/showMenu/:vendorId`, showMenu);
router.post(`/addMenu/:vendorId`, addMenu);
router.post(`/sendIncentive`, sendIncentive);
router.post("/signNewsletter", signNewsletter);
router.post(`/settleMonthlyIncentive`, settleMonthlyIncentive);
router.post(`/updateIncentiveAmount`, updateIncentiveAmount);
router.post(`/login`, login);
router.get(`/logout`, logout);
router.get(`/totalorder`, totalOrder);
router.get(`/totaluser`, totalUser);
router.get(`/latestorder`, latestOrder);
router.get(`/userdata`, userData);
router.get(`/orderdata`, orderData);
router.get(`/getallorder`, getAllOrder);
router.post(`/createCategory`, upload.single('image') ,createCategory);

router.post(`/createsubcategory`, upload.single('image') ,createsubCategory);

router.put(`/subcategoryupdate/:id`, upload.single('image') ,updatesubCategory);


router.get(`/viewCategory`, viewCategory);

router.get(`/viewsubcategory`, viewSubCategory);

router.put(`/deleteSubCategory/:subcategoryId`, deleteSubCategory);
router.get(`/viewSubCategorybycategoryid/:categoryid`, viewSubCategorybycategoryid);

router.get(`/viewCoupon`, viewCoupon);
router.get(`/fetchSubcategory`, fetchSubcategory);
router.put(`/deleteCategory/:categoryId`, deleteCategory);
router.post(`/updatecategory/:categoryId`, updateCategory);
router.post(`/createCoupon`, upload.single('image') ,createCoupons);
router.put(`/deleteCoupons/:couponId`, deleteCoupons);
router.get("/viewVendors", viewVendors);updatesubCategory
router.get(`/viewParticularVendor/:vendorId`, viewParticularVendor);
router.get(`/viewParticularDelivery/:deliveryId`, viewParticularDelivery);
router.get("/viewDelivery", viewDelivery);
router.get("/viewCustomers", viewCustomers);
router.get("/viewComplaints", viewComplaints);
router.put(`/removeVendor/:storeId`, removeVendor);
router.put(`/removeDelivery/:deliveryId`, removeDelivery);
router.put(`/addressComplaints/:complaintId`, addressComplaints);
router.put("/updateuser/:id", updateUser);
router.get(`/approveVendors/:vendorId`, approveVendors);
router.get(`/approveDelivery/:deliveryId`, approveDelivery);
router.get(`/disapproveVendors/:vendorId`, disapproveVendors);
router.get(`/disapproveDelivery/:deliveryId`, disapproveDelivery);
router.post(`/updateCharges`, updateCharges);
router.get(`/getcharges`, getCharges);
router.post(`/addStation`, addStation);
router.post(`/updateIncentiveAmount`, updateIncentiveAmount);
router.get(`/getincentiveamount`, getIncentiveAmount);
router.post("/sendOtp", sendadminOtp);
router.post("/verifyOtp", verifyadminOtp);
router.put(`/user/delete/:id`, deleteUser);
router.put(`/user/update/:id`, updateUser);
router.post(`/newbanner`, upload.single('image') ,createBanner);
router.get(`/banner`, getBanner);
router.put(`/banner/:id`, updateBanner);
router.delete(`/banner/:id`, deleteBanner);
router.get(`/banner/:id`, getBannerById);
router.get(`/`, getAdmin);
router.get(`/control`, getAdminController);
router.post(`/updatecontrol`, updateAdminController);
router.get(`/viewproducts`, viewProducts);
module.exports = router;
