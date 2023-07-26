//import asyncHandler from 'express-async-handler';
const asyncHandler = require("express-async-handler");
const Address = require("../models/Address.js");
const Complaints = require("../models/Complaints");
const Reviews = require("../models/Reviews");
const { generateToken, resetPassToken } = require("../utils/generateToken.js");
const jwt = require("jsonwebtoken");
const Order = require("../models/Orders.js");
const Delivery = require("../models/Delivery.js");
const Store = require("../models/Store.js");
const Category = require("../models/Category.js");
const SubCategory = require("../models/subCategory.js");
const Product = require("../models/Products.js");
const Coupons = require("../models/Coupons.js");
const Cart = require("../models/Cart.js");
const Prescription = require("../models/Prescription.js");
// const CustomDelivery = require("../models/CustomDelivery.js");
const axios = require("axios");
const Admin = require("../models/Admin.js");
const { Client } = require("@googlemaps/google-maps-services-js");
const {registrationMail,forgetPassword, sendMail,} = require("../utils/sendMail.js");
const User = require("../models/User.js");
const mailer = require("../middleware/mailer.js");
const Transanction = require("../models/transanction.js");
const { ObjectId } = require('mongodb');
// const {
//   AddOnResultContext,
// } = require("twilio/lib/rest/api/v2010/account/recording/addOnResult.js");
// const sdk = require("api")("@cashfreedocs-new/v2#97f8kl3sscv9e");
// const PaymentGateway = require("@cashfreepayments/cashfree-sdk");

// Register
const register = asyncHandler(async (req, res) => {
  try {
    let { email } = req.body;
    let duplicate = await User.findOne({ email: email });
    if (duplicate) {
      return res.status(500).json({
        success: false,
        stateCode: 500,
        message: "User already exists,please try to login",
      });
    } else {
      let user = await User.create(req.body);
      // Adding an address simultaneously while creating user.
      let obj = {
        userId: user._id.toString(),
        addressType: "Home",
        streetName: user.address.streetName,
        streetNumber: user.address.streetNumber,
        city: user.address.city,
        countryCode: user.address.countryCode,
        zipcode: user.address.zipcode,
        stateCode: user.address.stateCode,
      };

      let address = await Address.create(obj);
      const txt = `Thank You for Signing Up with Gravity Bites.Enjoy great deals and offers while you order from your favourite store only on on our mobile app. Download it ow from Playstore. Your Login creationals are userName:- ${email} Password:- ${req.body.password}`;
      mailer(email, "New Registration confirmation", txt);
      res.status(200).json({
        success: true,
        statusCode: 200,
        _id: user._id,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const sendMailer = async (req, res) => {
  try {
    await mailer(req.body.email, req.body.subject, req.body.message);
    res.status(200).json({
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
};

// Login
const login = asyncHandler(async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(500).json({
        success: false,
        stateCode: 500,
        message: "User not found",
      });
    }
    if (await user.matchPassword(password)) {
      res.status(200).json({
        success: true,
        statusCode: 200,
        _id: user._id,
        token: generateToken(user._id),
      });
    } else {
      res.status(500).json({
        success: false,
        stateCode: 500,
        message: `Password didn't match`,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

//Change Password
const changePassword = asyncHandler(async (req, res) => {
  try {
    let { email } = req.body;
    let user = await User.findOne({ email: email });
    if (user && (await user.matchPassword(req.body.password))) {
      user.password = req.body.newPassword;
      user.save();
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Password updated",
      });
    }
    res.status(500).json({
      success: false,
      stateCode: 500,
      message: "Invalid email or password",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

//send Link
const sendLink = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email: email });
    if (user) {
      const token = resetPassToken(user._id);
      sendMail(token, email, "user");
    }
    res.status(500).json({
      success: false,
      stateCode: 500,
      message: "Email not found ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Reset Link
const resetLink = asyncHandler(async (req, res) => {
  try {
    let token = req.params.tokenId;
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(404).json({
        success: false,
        stateCode: 404,
        message: "User not found",
      });
    }
    let user = await User.findById(userid.id);
    if (user) {
      user.password = req.body.newPassword;
      await user.save();
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Password updated",
      });
    }
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: "invalid reset link",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Cancel Order
const cancelOrder = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(404).json({
        success: false,
        stateCode: 404,
        message: "User not found",
      });
    }
    let order = await Order.findById(req.params.orderId);
    let vendorId = order.vendorId.toString();
    let store = await Store.findById(vendorId);
    let category = store.categories;
    if (category == "Food & Beverages") {
      order.status = "Cancelled";
      order.save();
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Order cancelled by customer",
      });
    } else {
      if (order.status == "Order Accepted" && order.deliveryPartner == "") {
        order.status = "Cancelled";
        // let deliveryId = order.deliveryPartner;
        // let delivery = await Delivery.findById(deliveryId.toString());
        // (delivery.isAvailable = true),
        //   (delivery.status = ""),
        //   (delivery.orderType = "");
        // delivery.orderReference = "";
        // delivery.save();
      }
      order.save();
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Order cancelled by customer",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
// add Prescription
const addPrescription = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(404).json({
        success: false,
        stateCode: 404,
        message: "User not found",
      });
    }
    let obj = {
      userId: userid.id,
      ...req.body,
    };
    const prescription = await Prescription.create(obj);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Prescription added ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
// Add Tip Amount to Delivery Person
const addTip = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(404).json({
        success: false,
        stateCode: 404,
        message: "User not found",
      });
    }
    const order = await Order.findById(req.params.orderId);
    order.deliveryTip = req.body.deliveryTip;
    order.save();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Thank You for your reward",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Add Intruction for Order
const addInstruction = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(404).json({
        success: false,
        stateCode: 404,
        message: "User not found",
      });
    }
    const order = await Order.findById(req.params.orderId);
    order.instruction = req.body.instruction;
    await order.save();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        "Your instructions are valuable for us to serve your desired order",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

const customDelivery = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(userid.id);
    if (!user) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "User not Found",
      });
    }
    let category = await Category.findOne({ parent: "custom" });
    let orderaddress = await Address.findOne({ _id: req.body.addressId });
    const couponCode = req.body.couponCode || null;

    const admin = await Admin.findById(process.env.ADMIN_ID);
    let distFee = 0;
    let baseFare = admin.baseFare;
    // will modify this to let admin decide base Distance
    if (req.body.distance > 8) {
      let remainingDistance = req.body.distance - 8;
      distFee = remainingDistance * admin.customdistanceFee; //distance Fee per km
    }
    let subTotal = distFee + admin.customPackaging + admin.baseFare;
    let totalGST = (subTotal / 100) * category.gstPercent;
    let serves = (subTotal / 100) * admin.serviceFee;
    let cashRedeemed = (subTotal / 100) * category.cashBack;
    // change this and add cashback for custom at admin End

    if (couponCode) {
      let code = await Coupons.findOne({
        offeredBy: "admin",
        couponCode: req.body.couponCode.toString(),
      });
      if (code) {
        const expiry = new Date(code.expiryDuration);
        const currDate = new Date(Date.now());
        if (expiry - currDate > 0) {
          if (code.isPercent) {
            const amount = subTotal;
            const discount = (amount / 100) * code.amountOff;
            subTotal = amount - discount;
          } else {
            const amount = subTotal;
            if (amount < code.amountOff) {
              return res.status(500).json({
                success: false,
                stationCode: 500,
                message: "Coupon Not Applicable",
              });
            }
            subTotal = amount - code.amountOff;
          }
        } else {
          return res.status(500).json({
            success: false,
            stationCode: 500,
            message: "Coupon Code Expired",
          });
        }
      } else {
        return res.status(500).json({
          success: false,
          stationCode: 500,
          message: "Invalid Coupon Code",
        });
      }
    }
    var Total = subTotal + totalGST + serves;
    let cashRemaining = req.body.cashbackUsed;
    if (cashRemaining > parseInt(Total)) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Cashback Used is greater than total amount Order declined",
      });
    } else {
      const checkDate = new Date(Date.now());
      for (let i = 0; i < user.cashback.length; i++) {
        const expiry = new Date(user.cashback[i].expiryDate);

        if (expiry - checkDate > 0) {
          if (user.cashback[i].amount > cashRemaining) {
            user.cashback[i].amount = user.cashback[i].amount - cashRemaining;
            Total = Total - cashRemaining;
            user.cashbackAvailable = user.cashbackAvailable - cashRemaining;
            cashRemaining = 0;
          } else {
            cashRemaining = cashRemaining - user.cashback[i].amount;
            Total = Total - user.cashback[i].amount;
            user.cashbackAvailable =
              user.cashbackAvailable - user.cashback[i].amount;
            user.cashback[i].amount = 0;
          }
        } else {
          user.cashbackAvailable =
            user.cashbackAvailable - user.cashback[i].amount;
          user.cashback[i].amount = 0;
        }
      }
    }
    // // ******************************
    user.cashbackAvailable += cashRedeemed;
    const today1 = new Date(Date.now());
    today1.setDate(today1.getDate() + 30);

    let cash = {
      expiryDate: today1,
      amount: cashRedeemed,
    };
    const result = user.cashback.filter((ele) => ele.amount != 0);
    user.cashback = [...result, cash];
    // // ******************************
    await user.save();
    let deliveryOption = req.body.deliveryOption || "Home Delivery";
    let DeliverySlot = {
      deliveryTime: req.body.deliverySlot,
      now: req.body.now,
    };
    if (!req.body.now) {
      Total = parseInt(Total) - admin.deliverLaterDiscount;
    }

    let obj = {
      userId: userid.id,
      products: [],
      vendorId: process.env.ADMIN_ID,
      status: "Order Placed",
      Total: parseInt(Total),
      GST: totalGST,
      subTotal: subTotal,
      productImage: req.body.productImage,
      packagingCharges: admin.customPackaging,
      deliverySlot: DeliverySlot,
      distanceFee: distFee || 0,
      serviceFee: serves || 0,
      baseFare: baseFare || 0,
      cashbackUsed: req.body.cashbackUsed,
      instruction: req.body.instruction || null,
      deliveryOption: deliveryOption,
      couponCode: req.body.couponCode || null,
      address: orderaddress,
      pickupAddress: req.body.pickupAddress,
      ordertype: "Custom",
    };
    console.log(obj, "obj");
    const newOrder = await Order.create(obj);
    res.status(200).json({
      success: true,
      stateCode200,
      message: "Order Placed Successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

//Assign Delivery Person for Custom Delivery Order
const assignCustomDelivery = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(userid.id);
    if (!user) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "Login to continue",
      });
    }
    const order = await Order.findById(req.params.orderId);
    if(!order) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: `Order ID does not exists`,
      });
    }
    const delivery = await Delivery.find({ isAvailable: true });
    const deliveryman = delivery[Math.floor(Math.random() * delivery.length)];
    const orderAssignedTo = await Delivery.findById(deliveryman._id);
    order.deliveryPartner = deliveryman._id;

    orderAssignedTo.isAvailable = false;
    orderAssignedTo.status = "Assigned";
    orderAssignedTo.orderType = "Custom";
    await orderAssignedTo.save();
    await order.save();
    return res.status(200).json({
      success: true,
      stateCode: 200,
      message: "Custom order assigned to Delivery Person",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const logout = (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "Please Login to logout",
      });
    }
    res.clearCookie("username");
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "log out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
};

// Add new Address
const newAddress = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "User not Found",
      });
    }

    let address = await Address.create({
      userId: userid.id,
      ...req.body,
    });
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "New address added by user",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// My-Address
const myAddress = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    const myaddress = await Address.find({ userId: userid.id });
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: myaddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
// Update Home Address
const updateAddress = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(userid.id);
    const myaddress = await Address.findOne({ _id: req.params.addressId });
    console.log(myaddress);
    user.address.city = myaddress.city;
    user.address.streetName = myaddress.streetName;
    user.address.streetNumber = myaddress.streetNumber;
    user.address.zipcode = myaddress.zipcode;
    user.address.countryCode = myaddress.countryCode;
    user.address.stateCode = myaddress.stateCode;
    await user.save();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Home Address Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Send Terms and Conditions
const terms = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(404).json({
        success: false,
        stateCode: 404,
        message: "User not found",
      });
    }
    const admin = await Admin.findById(process.env.ADMIN_ID);
    const termsofuse = admin.termsConditions.customer;
    const privacyPolicy = admin.termsConditions.privacyPolicy;
    const aboutUs = admin.termsConditions.aboutUs;
    res.status(200).json({
      success: true,
      statusCode: 200,
      termsofuse: termsofuse,
      privacyPolicy: privacyPolicy,
      aboutUs: aboutUs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const wallet = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(404).json({
        success: false,
        stateCode: 404,
        message: "User not found",
      });
    }
    const orders = await Order.find({ userId: userid.id, status: "Delivered" });
    res.json({ availableBalance: "$ 114", orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const myaccount = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(404).json({
        success: false,
        stateCode: 404,
        message: "User not found",
      });
    }
    const user = await User.findById(userid.id);
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Add Complain
const addComplain = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(404).json({
        success: false,
        stateCode: 404,
        message: "Authentication Failed",
      });
    }
    let obj = {
      message: req.body.message,
      storeId: userid.id,
      phoneNo: req.body.phoneNo,
      user: "Customer",
    };

    const user = await User.findById(userid.id);

    let complain = await Complaints.create(obj);
    text = "Here is your Complain to GravityBites.in: " + req.body.message;
    mailer(user.email, "Complain", txt);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Complaint Registered",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Add Review to Order (Post req)
const addReview = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(404).json({
        success: false,
        stateCode: 404,
        message: "User not found",
      });
    }
    let obj = {
      userId: userid.id,
      vendorId: req.body.vendorId,
      rating: req.body.rating,
      comment: req.body.comment,
    };
    let newReview = await Reviews.create(obj);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "New Review Added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// myorders
const myorders = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(404).json({
        success: false,
        stateCode: 404,
        message: "User not found",
      });
    }
    const orders = await Order.find({ userId: userid.id.toString() }).populate([
      {
        path: "vendorId",
        model: "Store",
        select:
          "_id categories storeName storeImage address lattitude longitude",
      },
      {
        path: "userId",
        model: "User",
        select: "_id name lastName",
      },
      {
        path: "deliveryPartner",
        model: "Delivery",
        select: "_id name",
      },
    ]);
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Particular Order Info
const particularOrder = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(404).json({
        success: false,
        stateCode: 404,
        message: "User not found",
      });
    }
    const order = await Order.findById(req.params.orderId).populate([
      {
        path: "products.productId",
        model: "Product",
        select: "_id price image name variable",
      },
    ]);
    let totalItems = 0;
    order.products.forEach((ele) => (totalItems += ele.quantity));
    const products = order.products;
    const Total = order.Total;
    const packagingCharges = order.packagingCharges;
    const GST = order.GST;
    const distanceFee = order.distanceFee;
    const baseFare = order.baseFare;
    const subTotal = order.subTotal;

    res.status(200).json({
      success: true,
      statusCode: 200,
      Products: products,
      Total: Total,
      subTotal: subTotal,
      packagingCharges: packagingCharges,
      GST: GST,
      distanceFee: distanceFee,
      baseFare: baseFare,
      totalItems: totalItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// remove expired Coins
const removeCoins = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userid.id);
    if (!user) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "User not Found",
      });
    }
    user.cashback.forEach((ele) => {
      const expiry = new Date(ele.expiryDate);
      const currDate = new Date(Date.now());
      if (expiry - currDate < 0) {
        ele.amount = 0;
      }
    });
    let result = user.cashback.filter((ele) => ele.amount != 0);
    user.cashback = result;
    user.save();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Expired Coins Removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Prescription Order
const prescriptionOrder = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(userid.id);
    if (!user) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "User not Found",
      });
    }
    let vendor = await Store.findById(req.body.vendorId);
    const admin = await Admin.findById(process.env.ADMIN_ID);
    let distFee = 0;
    let baseFare = admin.baseFare;
    // will modify this to let admin decide base Distance
    if (req.body.distance > 8) {
      let remainingDistance = req.body.distance - 8;
      distFee = remainingDistance * admin.distanceFee; //distance Fee per km
    }
    let orderaddress = await Address.findOne({ _id: req.body.addressId });
    let DeliverySlot = {
      deliveryTime: req.body.deliverySlot,
      now: req.body.now,
    };
    let obj = {
      userId: userid.id,
      products: [],
      vendorId: req.body.vendorId,
      status: "Order Placed",
      subTotal: 0,
      Total: 0,
      GST: 0,
      deliverySlot: DeliverySlot,
      packagingCharges: vendor?.packagingCharge || 0,
      distanceFee: distFee,
      baseFare: baseFare,
      cashbackUsed: 0,
      instruction: req.body.instruction || null,
      deliveryOption: req.body.deliveryOption,
      couponCode: null,
      address: orderaddress,
      productImage: req.body.productImage,
      pickupAddress: vendor.address,
      ordertype: "Prescription",
    };

    const newOrder = await Order.create(obj);
    let obj2 = {
      vendorId: req.body.vendorId,
      userId: userid.id,
      DrName: req.body.DrName,
      urgent: req.body.urgent,
      image: req.body.productImage,
      description: req.body.description,
      orderId: newOrder._id,
    };
    const newPrescription = await Prescription.create(obj2);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Prescription sent to the Medical Store",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// view Coupons
const viewCoupon = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Login to continue",
      });
    }
    const store = await Store.findById(req.body.vendorId).populate([
      {
        path: "myCoupons.couponId",
        model: "Coupons",
        select:
          "_id category image offeredBy expiryDuration isPercent amountOff couponCode",
      },
    ]);
    const coupons = store.myCoupons;
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
// Fetch Stores with click on Banner
const fetchCouponStore = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Login to continue",
      });
    }
    const couponId = req.params.couponId;
    const stores = await Store.find({
      myCoupons: { $in: {_id: ObjectId(couponId)} },
    });
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: stores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
// Order placing Customer End (Post req)
const placeOrder = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    console.log(userid);
    let user = await User.findById(userid.id);
    console.log(user);
    if (!user) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "User not Found",
      });
    }
    let cart = await Cart.findOne({
      userId: userid.id,
      status: "shopping",
    });
    if (!cart) {
      return res.status(500).json({
        success: false,
        message: "empty cart",
      });
    }
    let vendor = await Store.findById(cart.vendorId.toString());
    let subTotal = 0;
    let totalGST = 0;
    cart.products.forEach((ele) => {
      subTotal += ele.price;
      totalGST += ele.gst;
    });

    let orderaddress = await Address.findOne({ _id: req.body.addressId });
    const couponCode = req.body.couponCode || null;

    const admin = await Admin.findById(process.env.ADMIN_ID);
    let distFee = 0;
    let baseFare = admin.baseFare;
    // will modify this to let admin decide base Distance
    if (req.body.distance > 10) {
      let remainingDistance = req.body.distance - 10;
      distFee = remainingDistance * admin.distanceFee; //distance Fee per km
    }
    // let serves = (subTotal / 100) * admin.serviceFee;
    let cashRedeemed = (subTotal / 100) * vendor.cashback;

    if (couponCode) {
      let code = await Coupons.findOne({
        couponCode: req.body.couponCode.toString(),
      });
      const result = vendor.myCoupons.filter((ele) => {
        return ele.couponId.toString() == code._id.toString();
      });
      if (result && code) {
        const expiry = new Date(code.expiryDuration);
        const currDate = new Date(Date.now());
        if (expiry - currDate > 0) {
          if (code.isPercent) {
            const amount = subTotal;
            const discount = (amount / 100) * code.amountOff;
            subTotal = amount - discount;
          } else {
            const amount = subTotal;
            if (amount < code.amountOff) {
              return res.status(500).json({
                success: false,
                stateCode: 500,
                message: "Coupon Not Applicable",
              });
            }
            subTotal = amount - code.amountOff;
          }
        } else {
          return res.status(500).json({
            success: false,
            stationCode: 500,
            message: "Invalid Coupon Code",
          });
        }
      }
    }
    var Total =
      subTotal + totalGST + distFee + vendor.packagingCharge + admin.baseFare;
    let cashRemaining = req.body.cashbackUsed;
    if (cashRemaining > parseInt(Total)) {
      const message =
        "Cashback Used is greater than total amount Order declined";
      return res
        .status(500)
        .json({ success: false, stateCode: 500, message: message });
    } else {
      const checkDate = new Date(Date.now());
      for (let i = 0; i < user.cashback.length; i++) {
        const expiry = new Date(user.cashback[i].expiryDate);
        if (expiry - checkDate > 0) {
          if (user.cashback[i].amount > cashRemaining) {
            user.cashback[i].amount = user.cashback[i].amount - cashRemaining;
            Total = Total - cashRemaining;
            user.cashbackAvailable = user.cashbackAvailable - cashRemaining;
            cashRemaining = 0;
          } else {
            cashRemaining = cashRemaining - user.cashback[i].amount;
            Total = Total - user.cashback[i].amount;
            user.cashbackAvailable =
              user.cashbackAvailable - user.cashback[i].amount;
            user.cashback[i].amount = 0;
          }
        } else {
          user.cashbackAvailable =
            user.cashbackAvailable - user.cashback[i].amount;
          user.cashback[i].amount = 0;
        }
      }
    }
    // // ******************************
    user.cashbackAvailable += cashRedeemed;
    const today1 = new Date(Date.now());
    today1.setDate(today1.getDate() + 30);

    let cash = {
      expiryDate: today1,
      amount: cashRedeemed,
    };
    const result = user.cashback.filter((ele) => ele.amount != 0);
    user.cashback = [...result, cash];
    // // ******************************

    await user.save();
    let deliveryOption = req.body.deliveryOption || "Home Delivery";
    let DeliverySlot = {
      deliveryTime: req.body.deliverySlot,
      now: req.body.now,
    };
    if (!req.body.now) {
      Total = Total - admin.deliverLaterDiscount;
    }
    if (deliveryOption == "Takeway") {
      Total = Total - distFee - baseFare;
      distFee = 0;
      baseFare = 0;
    }

    let obj = {
      userId: userid.id,
      products: cart.products,
      vendorId: cart.vendorId,
      status: "Order Placed",
      Total: parseInt(Total),
      GST: totalGST,
      subTotal: subTotal,
      productImage: "",
      deliverySlot: DeliverySlot,
      packagingCharges: vendor.packagingCharge || 0,
      distanceFee: distFee || 0,
      baseFare: baseFare || 0,
      cashbackUsed: req.body.cashbackUsed,
      instruction: req.body.instruction || null,
      deliveryOption: deliveryOption,
      couponCode: req.body.couponCode || null,
      address: orderaddress,
      pickupAddress: vendor.address,
      ordertype: "Regular",
    };
    const newOrder = await Order.create(obj);
    cart.status = "Order Placed";
    await cart.save();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Order Placed Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// New add to cart
const addNew = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: userid.id.toString() });
    if (!user) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "User not Found",
      });
    }
    const cartexists = await Cart.findOne({
      userId: userid.id.toString(),
      status: "shopping",
    });
    if (cartexists) {
      const currProduct = await Product.findById(req.params.productid);
      if (currProduct.vendorId === cartexists.vendorId) {
        const productalready = cartexists.products.findIndex(
          (ele) => ele.productId.toString() === req.params.productid
        );
        if (productalready > -1) {
          const cartid = cartexists._id;
          const ourcart = await Cart.findById(cartid);
          ourcart.products[productalready].quantity += 1;
          const newPrice =
            req.body.price - (req.body.price / 100) * req.body.discount;
          ourcart.products[productalready].gst =
            ourcart.products[productalready].gst +
            (req.body.price / 100) * currProduct.gst;
          ourcart.products[productalready].price =
            ourcart.products[productalready].price + newPrice;
          ourcart.products[productalready].variables = [
            ...ourcart.products[productalready].variables,
            req.body.objectId,
          ];
          ourcart.save();
          return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Product Quantity Increased",
          });
        } else {
          const Price =
            req.body.price - (req.body.price / 100) * req.body.discount;
          const newProduct = {
            productId: req.params.productid,
            gst: (req.body.price / 100) * currProduct.gst,
            quantity: 1,
            price: Price,
            variables: [req.body.objectId],
          };
          // console.log(newProduct);
          const cartid = cartexists._id;
          const ourcart = await Cart.findById(cartid);
          ourcart.products.push(newProduct);
          await ourcart.save();
          return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "New Product Added to Cart",
          });
        }
      } else {
        return res.status(500).json({
          success: false,
          stateCode: 500,
          message: "Discard the previous Cart to add product from new Vendor",
        });
      }
    } else {
      const currProduct = await Product.findById(req.params.productid);
      const Price = req.body.price - (req.body.price / 100) * req.body.discount;
      console.log(Price);
      const newProduct = {
        productId: req.params.productid,
        quantity: 1,
        gst: (req.body.price / 100) * currProduct.gst,
        price: Price,
        variables: [req.body.objectId],
      };
      const newCart = await Cart.create({
        userId: userid.id,
        vendorId: currProduct.vendorId,
        products: [newProduct],
        status: "shopping",
      });
      console.log(newCart);
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "New product added Successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Reduce Quantity of Product from cart
const reduceQuantity = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "User not Found",
      });
    }
    const cartexists = await Cart.findOne({
      userId: userid.id.toString(),
      status: "shopping",
    });
    // .populate([
    //   {
    //     path: "products.productId",
    //     model: "Product",
    //     select: "_id variable",
    //   },
    // ]);

    const productalready = cartexists.products.findIndex(
      (ele) => ele.productId.toString() === req.params.productid
    );
    if (productalready > -1) {
      if (cartexists.products[productalready].quantity > 1) {
        const currProduct = await Product.findById(req.params.productid);
        const productType = cartexists.products[productalready].variables[-1];
        const typeDetails = currProduct.variable[productType];
        const newQuantity = cartexists.products[productalready].quantity - 1;
        const Price = (typeDetails.price / 100) * typeDetails.discount;
        const GST = (typeDetails.price / 100) * currProduct.gst;
        cartexists.products[productalready].quantity = newQuantity;
        cartexists.products[productalready].gst =
          cartexists.products[productalready].gst - GST;
        cartexists.products[productalready].price =
          cartexists.products[productalready].price - Price;
        cartexists.products[productalready].variables = cartexists.products[
          productalready
        ].variables.slice0(0, -1);
        cartexists.save();
        return res.status(200).json({
          success: true,
          statusCode: 200,
          message: "Product Quantity Decreased",
        });
      } else {
        cartexists.products.filter((ele, index) => {
          ele.productId.toString() != req.params.productid;
        });
        cartexists.save();
      }
    } else {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "Product doesn't exits in cart",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
// Discard the existing cart
const discardCart = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: userid.id });
    if (!user) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "User not Found",
      });
    }
    const cartexists = await Cart.find({
      userId: userid.id,
      status: "shopping",
    });
    await Cart.deleteOne({ _id: cartexists._id });
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Cart Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// View Existing Cart
const viewCart = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: userid.id });
    if (!user) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "User not Found",
      });
    }
    const cartexists = await Cart.findOne({
      userId: userid.id,
      status: "shopping",
    }).populate([
      {
        path: "products.productId",
        model: "Product",
        select: "_id name image variable ",
      },
      {
        path: "vendorId",
        model: "Store",
        select: "_id storeName",
      },
    ]);
    let subTotal = 0;
    let totalGST = 0;
    cartexists.products.forEach((ele) => {
      subTotal += ele.price;
      totalGST += ele.gst;
    });
    const Total = subTotal + totalGST;
    const productCart = cartexists.products;
    const storename = cartexists.vendorId.storeName;
    res.status(200).json({
      success: true,
      statusCode: 200,
      productCart: productCart,
      SoreName: storename,
      SubTotal: subTotal,
      TotalGST: totalGST,
      Total: Total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

const viewProduct = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: userid.id });
    if (!user) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "User not Found",
      });
    }
    const variable = req.body.variable;
    const type = req.body.variables;
    const variations = [];
    const variate = {};
    type.forEach((ele) => {
      if (variate[ele]) {
        variate[ele] = parseInt(variate[ele]) + 1;
      } else {
        variate[ele] = 1;
      }
    });
    variable.forEach((ele) => {
      if (variate[ele._id.toString()]) {
        const newPrice = ele.price - (ele.price / 100) * ele.discount;
        const obj = {
          qty: variate[ele._id.toString()],
          price: variate[ele._id.toString()] * newPrice,
          variableName: ele.variableName,
          unit: ele.unit,
        };
        variations.push(obj);
      }
    });
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: variations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
// Fetch Stores By category
const fetchBycategory = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Login to continue",
      });
    }
    let user =  await User.findById(req.params.userid);

    let category = await Category.findById(req.params.categoryId);
  //  console.log("category==>",category)
    const categoryName = category.subcategory;
    let options = await Store.find({ categories: categoryName });


    // const admin = await Admin.findById(process.env.ADMIN_ID);
    // console.log("admin",admin)
    // let myCity = user.address.city;
    // console.log("myCity",myCity)

    // let available = admin.availableStations.filter((ele) => {
    //   return ele.city == myCity;
    // });
    if (options) {
      // let stores = options.filter((ele) => {
      //   return ele.address.city == myCity;
      // });
      return res.status(200).json({
        success: true,
        stateCode: 200,
        data: options,
        distance: "5km",
        time: "20mins",
        avgReview: "4.2",
      });
    } else {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Service not available in your city",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});



// Fetch Stores according to sub-category of food items

const fetchStorebySubcategory = asyncHandler(async (req, res) => {
  console.log("asdas")
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Login to continue",
      });
    }
  //   let user =await User.findById(req.params.userId);
  // console.log("user",user)

    let mycategory = await SubCategory.findById(req.params.subcategoryId);
    console.log("mycategory==>",mycategory)
    // const categoryName = mycategory.subcategory;
    // console.log("categoryName===>",categoryName)

    // const storeProduct = await Product.distinct("vendorId", {
    //   subcategory: categoryName,
    // });

    // const now = await Store.find({ _id:{ $in: storeProduct } });

    // const admin = await Admin.findById(process.env.ADMIN_ID);
    // console.log("admin==>",admin)
    // let myCity = user.address.city;
    // let available = admin.availableStations.filter((ele) => {
    //   return ele.city == myCity;
    // });
    if (mycategory) {
      // let stores = now.filter((ele) => {
      //   return ele.address.city == myCity;
      // });
      res.status(200).json({
        success: true,
        statusCode: 200,
        data: mycategory,
      });
    } else {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Service not available in your city",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});


// Fetch Products based on store and sub category
const fetchFirstProducts = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Login to continue",
      });
    }
    const subCategory = await Product.distinct("subcategory", {
      vendorId: req.params.vendorId,
    });
    const products = [];
    for (let product of subCategory) {
      let options = await Product.find({
        vendorId: req.params.vendorId,
        subcategory: product,
      });
      let obj = {
        [product]: options,
      };
      products.push(obj);
    }
    let reviews = await Reviews.find({ vendorId: req.params.vendorId });
    let totalreviews = reviews.length;
    res.status(200).json({
      success: true,
      statusCode: 200,
      totalreviews: totalreviews,
      subCategory: subCategory,
      Products: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Fetch Products based on store and sub category
const fetchProducts = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Login to continue",
      });
    }
    let options = await Product.find({vendorId:req.params.vendorId,categoryId:req.params.categoryName});

    console.log("option==>",options)

    let reviews = await Reviews.find({ vendorId:req.params.vendorId });
    console.log("review==>",reviews)

    let totalreviews = reviews.length;
    console.log("totalreciew==>",totalreviews)
    res.status(200).json({
      success: true,
      statusCode: 200,
      Options: options,
      TotalReviews: totalreviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Add Favourite Stores
const addFav = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Login to continue",
      });
    }
    const user = await User.findById(userid.id);
    let obj = {
      vendorId: req.body.vendorId,
    };
    let result = [...user.myFav, obj];
    user.myFav = result;
    await user.save();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Store added to favourite list",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const createTransanction = async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Please Login first",
      });
    }

    let obj = {
      userId: userid.id,
      amount: req.body.amount,
      type: req.body.type,
    };
    await Transanction.create(obj);
    res.status(200).json({
      success: true,
      message: "Transanction Data Successfully Saved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
};


// Show Favourite Stores
const showFav = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Login to continue",
      });
    }
    const user = await User.findById(userid.id).populate([
      {
        path: "myFav.vendorId",
        model: "Store",
        select:
          "_id storeImage address fullName storeName phoneNo email liscenseNo,",
      },
    ]);
    const stores = user.myFav;
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: stores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Add delivery Rating and Reviews for order
const orderRating = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Login to continue",
      });
    }
    const order = await Order.findById(req.body.orderId);
    order.rating = req.body.rating;
    order.deliveryReview = req.body.review;
    await order.save();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Thank You for rating the order",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

const fetchCategories = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Login to continue",
      });
    }
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Remove Store from Favourite
const removeFav = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Login to continue",
      });
    }
    const user = await User.findById(userid.id);
    const result = user.myFav.filter((ele) => {
      return ele.vendorId.toString() != req.body.vendorId;
    });
    user.myFav = result;
    await user.save();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Store removed from favourite list",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Show Store Reviews
const storeReviews = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Login to continue",
      });
    }
    const reviews = await Reviews.find({
      vendorId: req.body.vendorId,
    }).populate([
      {
        path: "userId",
        model: "User",
        select: "_id name",
      },
    ]);
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Fetch by Sub-Cateogry
const fetchsubCategories = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Login to continue",
      });
    }
    const subcategories = await SubCategory.find({});

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: subcategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
// Get store Sub-Cateogry
// fetchsubcategoryByid

const getSubCategoryById = asyncHandler(async (req, res) => {

  try {
    let token = req.headers.authorization.split(" ")[1];
    let adminid = jwt.verify(token, process.env.JWT_SECRET);
    if (!adminid) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Login to continue",
      });
    }

    let subcategories = await SubCategory.findById(req.body);
    console.log("subcategories",subcategories)
    if (!subcategories) {
      return res.status(404).json({
        success: false,
        stationCode: 404,
        message: "Subcategory not found",
      });
    }
    res.status(200).json({
      success: true,
      stationCode: 200,
      data:subcategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});


const getsubCategory = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Login to continue",
      });
    }
    const subCategory = await Product.distinct("subcategory",
    {
      vendorId: req.params.vendorId,
    });
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: subCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Fetch Coupon
const fetchCoupons = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Login to continue",
      });
    }
    const categoryId = req.params.categoryId;
    const categories = await Category.findById(categoryId);
    const name = categories.parent;
    const coupons = await Coupons.find({
      offeredBy: "admin",
      storeId: process.env.ADMIN_ID,
      category: name,
      // Add a category filter over here
    });
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

module.exports = {
  addTip,
  addInstruction,
  customDelivery,
  assignCustomDelivery,
  updateAddress,
  removeCoins,
  prescriptionOrder,
  viewCoupon,
  fetchCouponStore,
  addFav,
  orderRating,
  removeFav,
  storeReviews,
  showFav,
  reduceQuantity,
  getsubCategory,
  fetchsubCategories,
  fetchCategories,
  fetchCoupons,
  viewCart,
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
  changePassword,
  sendLink,
  resetLink,
  addNew,
  viewProduct,
  cancelOrder,
  fetchFirstProducts,
  logout,
  sendMailer,
  createTransanction,
  getSubCategoryById
};
