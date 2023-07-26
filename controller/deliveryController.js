//import asyncHandler from 'express-async-handler';
const asyncHandler = require("express-async-handler");
const Delivery = require("../models/Delivery.js");
const jwt = require("jsonwebtoken");
const Order = require("../models/Orders.js");
const Complaints = require("../models/Complaints.js");
const Admin = require("../models/Admin.js");
const { generateToken, resetPassToken } = require("../utils/generateToken.js");
const {
  registrationMail,
  successfullOrder,
  forgetPassword,
  sendMail,
} = require("../utils/sendMail.js");
const { name } = require("ejs");



const register = asyncHandler(async (req, res) => {
  try {
    let { email } = req.body;
    let exists = await Delivery.findOne({ email: email });

    if (exists) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "User already exists,please try to login",
      });
    }
    let obj = {
      voterImage: url + "/uploads/" + req.files.voterImage[0].filename,
      panImage: url + "/uploads/" + req.files.panImage[0].filename,
      aadharImage : url + "/uploads/" + req.files.aadharImage[0].filename,
      userImage : url + "/uploads/" + req.files.userImage[0].filename,
      drivinglicenseImage : url + "/uploads/" + req.files.drivinglicenseImage[0].filename,
      ...req.body,
    };
    let delivery = await Delivery.create(obj);
    const txt = `Thank You for Signing Up with Gravity Bites.Your account will be activated once all your documents are verified by our team. Your Login creationals are userName:- ${email} Password:- ${req.body.password}. Congratulations on beginning this new journey with us.`;
    mailer(email,"New Registration confirmation", txt)
    res.status(200).json({
      success: true,
      statusCode: 200,
      _id: delivery._id,
      token: generateToken(delivery._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Login
const login = asyncHandler(async (req, res) => {
  try {
    let { email, password } = req.body;
    const delivery = await Delivery.findOne({ email: email });
    if (!delivery) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "User not found",
      });
    }
    if (await delivery.matchPassword(password)) {
      delivery.password = null;
      res.json({
        _id: delivery._id,
        token: generateToken(delivery._id),
      });
    } else {
      res.status(500).json({
        success: false,
        statusCode: 500,
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

// Send Terms and Conditions
const terms = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let deliveryid = jwt.verify(token, process.env.JWT_SECRET);
    if (!deliveryid) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "User not found",
      });
    }
    const admin = await Admin.findById(process.env.ADMIN_ID);
    const termsofuse = admin.termsConditions.delivery;
    const privacyPolicy = admin.termsConditions.privacyPolicy;
    const aboutUs = admin.termsConditions.aboutUs;
    res.json({ termsofuse, privacyPolicy, aboutUs });
    res.json({ termsofuse, companypolicy });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Check available locations

const availableStations = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let deliveryid = jwt.verify(token, process.env.JWT_SECRET);
    if (!deliveryid) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "User not found",
      });
    }
    const admin = await Admin.find(req.params.ADMIN_ID);
    console.log("admin==>",admin)
    // const stations = [];
    // admin.availableStations.forEach((ele) => {
    //   console.log("ele==>",ele.city)
    //   return
    //   if (stations.indexOf(ele.city) == -1) {
    //     stations.push(ele.city);
    //   }
    // });
    res.status(200).json({
      success: true,
      stationCode: 200,
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Go Offline
const goOffline = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let deliveryid = jwt.verify(token, process.env.JWT_SECRET);
    if (!deliveryid) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "User not found",
      });
    }
    let delivery = await Delivery.find(req.params.deliveryid);
    console.log("delivery==>",delivery)
    // if (delivery.isApproved == false) {
    //   return res.status(500).json("Registeration approval pending by admin");
    // }
    delivery.isAvailable = false;
    delivery.status = "Not Available";
    // await delivery.save();
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Offline",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Go Offline
const goOnline = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let deliveryid = jwt.verify(token, process.env.JWT_SECRET);
    if (!deliveryid) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "User not found",
      });
    }
    let delivery = await Delivery.find(req.params.deliveryid);
    if (delivery.isApproved == false) {
      return res.status(500).json("Registeration approval pending by admin");
    }
    delivery.isAvailable = true;
    delivery.status = "Available";
    // await delivery.save();
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Online",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
// Assigned Order
const assigned = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let deliveryid = jwt.verify(token, process.env.JWT_SECRET);
    const delivery = await Delivery.findById(deliveryid.id);
    if (delivery.isAvailable == false && delivery.orderType == "Regular") {
      let order = await Order.findOne({
        deliveryPartner: deliveryid.id.toString(),
        status: "Order Accepted",
      }).populate([
        {
          path: "vendorId",
          model: "Store",
          select: "_id storeName address",
        },
      ]);
      const deliveryaddress = order.address;
      const storeaddress = order.pickupAddress;
      const storename = order.vendorId.storeName;
      return res.status(200).json({
        success: true,
        stationCode: 200,
        deliveryAddress: deliveryaddress,
        StoreAddress: storeaddress,
        storeName: storename,
      });
    } else if (
      delivery.isAvailable == false &&
      delivery.orderType == "Custom"
    ) {
      let customorder = await Order.findOne({
        deliveryPartner: deliveryid.id.toString(),
        status: "Order Placed",
      });
      const storeaddress = customorder.pickupAddress;
      const deliveryaddress = customorder.address;
      const storename = "Custom Delivery";
      return res.status(200).json({
        success: true,
        stationCode: 200,
        deliveryAddress: deliveryaddress,
        StoreAddress: storeaddress,
        storeName: storename,
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

// Marked as Accepted
const accepted = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let deliveryid = jwt.verify(token, process.env.JWT_SECRET);
  
    const delivery = await Delivery.findById(deliveryid.id);
   
    console.log("result==>",delivery)
    if (delivery.isAvailable == false && delivery.orderType == "Regular") {
     
      let order = await Order.findOne({
        deliveryPartner: deliveryid.id,
        status: "Order Accepted",
      }).populate([
        {
          path: "vendorId",
          model: "Store",
          select: "_id storeName address",
        },
        {
          path: "products.productId",
          model: "Product",
          select: "_id price image variable name",
        },
      ]);
      
      delivery.status = "Accepted";
      delivery.orderReference = order._id;
      await delivery.save();
      order.status = "Pickup Arranged";
      const deliveryaddress = order.address;
      const storeaddress = order.pickupAddress;
      await order.save();
      const products = order.products;
      return res.status(200).json({
        success: true,
        stationCode: 200,
        deliveryAddress: delivery,
        StoreAddress: storeaddress,
        Products: products,
      });
    }
     else if (delivery.isAvailable == false && delivery.orderType == "Custom") 
    {
      let customorder = await Order.findOne({
        deliveryPartner: deliveryid.id,
        status: "Order Placed",
      });
      delivery.status = "Accepted";
      delivery.orderReference = customorder._id;
      await delivery.save();
      customorder.status = "Pickup Arranged";
      const deliveryaddress = customorder.address;
      const storeaddress = customorder.pickupAddress;
      const products = customorder.productImage;
      await customorder.save();

      return res.status(200).json({
        success: true,
        stationCode: 200,
        deliveryAddress: deliveryaddress,
        StoreAddress: storeaddress,
        Products: products,
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

// Decline Delivery Request
const declineDelivery = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let deliveryid = jwt.verify(token, process.env.JWT_SECRET);
    if (!deliveryid) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "User not found",
      });
    }
    let delivery = await Delivery.findById(deliveryid.id);
    if (delivery.isAvailable == false && delivery.orderType == "Regular") {
      let order = await Order.findOne({
        deliveryPartner: deliveryid.id,
        status: "Order Accepted",
      }).populate([
        {
          path: "vendorId",
          model: "Store",
          select: "_id storeName address",
        },
        {
          path: "products.productId",
          model: "Product",
          select: "_id price image variable name",
        },
      ]);
      (order.deliveryPartner = ""),
        (delivery.isAvailable = true),
        (delivery.status = ""),
        (delivery.orderType = "");
      await order.save();
      await delivery.save();
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Delivery request declined",
      });
    } else if (
      delivery.isAvailable == false &&
      delivery.orderType == "Custom"
    ) {
      let customorder = await Order.findOne({
        deliveryPartner: deliveryid.id,
        status: "Order Placed",
      });
      (customorder.deliveryPartner = ""),
        (delivery.isAvailable = true),
        (delivery.status = ""),
        (delivery.orderType = "");
      await customorder.save();
      await delivery.save();
      await customorder.save();
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Delivery request declined",
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

// Marked as Picked
const picked = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let deliveryid = jwt.verify(token, process.env.JWT_SECRET);
    if (!deliveryid) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }
    let delivery = await Delivery.findById(deliveryid.id);
    console.log(delivery);
    if (delivery.isAvailable == false && delivery.orderType == "Regular") {
      const order = await Order.findOne({
        deliveryPartner: deliveryid.id.toString(),
        status: "Pickup Arranged",
      });
      delivery.status = "Picked";
      await delivery.save();
      order.status = "Out for Delivery";
      await order.save();
      const deliveryaddress = order.address;
      const storeaddress = order.pickupAddress;
      return res.status(200).json({
        success: true,
        stationCode: 200,
        deliveryAddress: deliveryaddress,
        StoreAddress: storeaddress,
      });
    } else if (
      delivery.isAvailable == false &&
      delivery.orderType == "Custom"
    ) {
      const customorder = await Order.findOne({
        deliveryPartner: deliveryid.id.toString(),
        status: "Pickup Arranged",
      });
      console.log(customorder, "custom");

      delivery.status = "Picked";
      await delivery.save();
      customorder.status = "Out for Delivery";
      await customorder.save();
      const deliveryaddress = customorder.address;
      const storeaddress = customorder.pickupAddress;
      return res.status(200).json({
        success: true,
        stationCode: 200,
        deliveryAddress: deliveryaddress,
        StoreAddress: storeaddress,
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

// Marked as Delivered
const delivered = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let deliveryid = jwt.verify(token, process.env.JWT_SECRET);
    if (!deliveryid) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }
    let delivery = await Delivery.findById(deliveryid.id);
    if (delivery.isAvailable == false && delivery.orderType == "Regular") {
      let order = await Order.findOne({
        deliveryPartner: deliveryid.id,
        status: "Out for Delivery",
      }).populate([
        {
          path: "userId",
          model: "User",
          select: "_id email",
        },
      ]);
      order.status = "Delivered";
      await order.save();
      delivery.status = "Delivered";
      delivery.isAvailable = true;
      delivery.orderReference = "";
      delivery.totalOrders = delivery.totalOrders + 1;
      delivery.todayOrders = delivery.todayOrders + 1;
      await delivery.save();
      const msg = `Your Order ${order._id} has been successfully delivered by our delivery Partner.`;
      const mail = order.userId.email;
      const time = order.updatedAt;
      successfullOrder(msg, mail, time);
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Order Delivered",
      });
    } else if (
      delivery.isAvailable == false &&
      delivery.orderType == "Custom"
    ) {
      let customorder = await Order.findOne({
        deliveryPartner: deliveryid.id,
        status: "Out for Delivery",
      }).populate([
        {
          path: "userId",
          model: "User",
          select: "_id email",
        },
      ]);
      customorder.status = "Delivered";
      await customorder.save();
      delivery.status = "Delivered";
      delivery.orderReference = "";
      delivery.isAvailable = true;
      delivery.totalOrders = delivery.totalOrders + 1;
      delivery.todayOrders = delivery.todayOrders + 1;
      await delivery.save();
      const msg = `Your Order ${customorder._id} has been successfully delivered by our delivery Partner.`;
      const mail = customorder.userId.email;
      const time = customorder.updatedAt;
      successfullOrder(msg, mail, time);
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Order Delivered",
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

// Current Delivery
const currDelivery = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let deliveryid = jwt.verify(token, process.env.JWT_SECRET);
    if (!deliveryid) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "User not found",
      });
    }
    let delivery = await Delivery.find(req.params.deliveryid);
    console.log(delivery)
    // let order = await Order.findById(delivery.orderReference.toString());
    // console.log("order==>",order)
    return res.status(200).json({
      success: true,
      stationCode: 200,
      message: delivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Total Orders Delivered
const ordersDelivered = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let deliveryid = jwt.verify(token, process.env.JWT_SECRET);
    if (!deliveryid) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "User not found",
      });
    }
    let orders = await Order.find(req.params.orderid)
   
    let order = orders.length;
    console.log("order==>",orders)

    res.status(200).json({
      success: true,
      stationCode: 200,
      orderData:order,
      ordersData:orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
// My Profile
const myProfile = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let deliveryid = jwt.verify(token, process.env.JWT_SECRET);
    if (!deliveryid) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "User not found",
      });
    }
    console.log(deliveryid.id);
    let delivery = await Delivery.findById(deliveryid.id);
    console.log(delivery);
    console.log(deliveryid.id);
    res.status(200).json({
      success: true,
      stationCode: 200,
      data: delivery,
    });
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
    let user = await Delivery.findOne({ email: email });
    if (user && (await user.matchPassword(req.body.password))) {
      user.password = req.body.newPassword;
      await user.save();
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Password updated",
      });
    }
    res.status(500).json({
      success: false,
      stationCode: 500,
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
    let user = await Delivery.findOne({ email: email });
    if (user) {
      const token = resetPassToken(user._id);
      sendMail(token, email, "delivery");
    }
    res.status(500).json({
      success: false,
      stationCode: 500,
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

// Add Complain
const addComplain = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "Authentication Failed",
      });
    }
    let obj = {
      message: req.body.message,
      storeId: userid.id,
      phoneNo: req.body.phoneNo,
      user: "Delivery",
    };

    let complain = await Complaints.create(obj);
    res.status(200).json({
      success: true,
      stationCode: 200,
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
// Reset Link
const resetLink = asyncHandler(async (req, res) => {
  try {
    let token = req.params.tokenId;
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "User not found",
      });
    }
    let user = await Delivery.findById(userid.id);
    if (user) {
      user.password = req.body.newPassword;
      await user.save();
      return res.status(200).json({
        success: true,
        stationCode: 200,
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

//  Get Reviews
const getReviews = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let deliveryid = jwt.verify(token, process.env.JWT_SECRET);
    if (!deliveryid) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "User not found",
      });
    }
    let orders = await Order.find({
      deliveryPartner: deliveryid.id,
      status: "Delivered",
    });
    let reviews = [];
    orders.forEach((ele) => {
      if (ele.deliveryReview != "null") {
        reviews.push(ele.deliveryReview);
      }
    });
    res.status(200).json({
      success: true,
      stationCode: 200,
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

module.exports = {
  resetLink,
  sendLink,
  getReviews,
  changePassword,
  myProfile,
  register,
  login,
  terms,
  accepted,
  picked,
  assigned,
  goOffline,
  addComplain,
  goOnline,
  delivered,
  currDelivery,
  ordersDelivered,
  declineDelivery,
  availableStations,
};
