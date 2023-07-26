//import asyncHandler from 'express-async-handler';
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Order = require("../models/Orders");
const Reviews = require("../models/Reviews");
const Product = require("../models/Products.js");
const Store = require("../models/Store.js");
const Delivery = require("../models/Delivery.js");

// Fetch Reviews (Get req)
exports.fetchReviews = asyncHandler(async (req, res) => {
  try {
    let token = req.headers[authorization].split(" ")[1];
    let storeid = jwt.verify(token, process.env.JWT_SECRET);
    if (!storeid) {
      return res.json("Authentication Failed");
    }
    const reviews = await Reviews.find({
      vendorId: storeid.id.toString(),
    }).populate([
      {
        path: "userId",
        model: "User",
        select: "_id name",
      },
    ]);
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Wallet Amount (Get req)
exports.walletAmount = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let storeid = jwt.verify(token, process.env.JWT_SECRET);
    if (!storeid) {
      return res.status(500).json({ msg: "User not found" });
    }
    res.status(200).json({ amount: "$500" });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

exports.prescriptionOrder = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let storeid = jwt.verify(token, process.env.JWT_SECRET);
    if (!storeid) {
      return res.json("Authentication Failed");
    }
    const products = req.body.products;
    const order = await Order.findById(req.params.orderId);
    const admin = await Admin.findById(process.env.ADMIN_ID);
    if (!order.deliverySlot[now]) {
      order.Total = req.body.Total - admin.deliverLaterDiscount;
    }
    order.products = products;
    order.GST = req.body.GST;
    order.packagingCharges =
      req.body.packagingCharges || order.packagingCharges;
    order.status = "Order Accepted";
    await order.save();
    res.status(200).json("Order Accepted by Store");
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Get Order Details for Vendor Side (Get Req)
exports.getallorders = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let storeid = jwt.verify(token, process.env.JWT_SECRET);
    if (!storeid) {
      return res.status(500).json("Authnetication Failed");
    }
    // const store = await Store.find({ _id: storeid.id.toString() });
    // if (store.isApproved == false) {
    //   return res.status(500).json("Registeration approval pending by admin");
    // }

    const orders = await Order.find({
      vendorId: storeid.id.toString(),
    }).populate([
      {
        path: "userId",
        model: "User",
        select: "_id name lastname phoneNo",
      },
      {
        path: "products.productId",
        model: "Product",
        select: "_id name image",
      },
    ]);
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let storeid = jwt.verify(token, process.env.JWT_SECRET);
    if (!storeid) {
      return res.status(500).json("Authnetication Failed");
    }
    const order = await Order.findById(req.params.orderId);
    order.status = "Order Accepted";
    await order.save();
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Order Accepted by Store",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
// Assign Delivery Person
exports.assignDelivery = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let storeid = jwt.verify(token, process.env.JWT_SECRET);
    if (!storeid) {
      return res.status(500).json("Authnetication Failed");
    }
    const order = await Order.findById(req.params.orderId);
    if (order.deliveryOption == "Home Delivery") {
      const delivery = await Delivery.find({ isAvailable: true });
      const deliveryman = delivery[Math.floor(Math.random() * delivery.length)];
      const orderAssignedTo = await Delivery.findById(deliveryman._id);
      order.deliveryPartner = deliveryman._id;
      orderAssignedTo.isAvailable = false;
      orderAssignedTo.status = "Assigned";
      orderAssignedTo.orderType = "Regular";
      await orderAssignedTo.save();
      await order.save();
      return res
        .status(200)
        .json({ mess: "Order Accepted By Store and Delivery Person Assigned" });
    }
    order.deliveryPartner = null;
    await order.save();
    res.status(200).json({
      mess: "Order Accepted by Store, Please Pickup order from Store",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
exports.declineOrderStatus = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let storeid = jwt.verify(token, process.env.JWT_SECRET);
    if (!storeid) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "Authentication Failed",
      });
    }
    const order = await Order.findById(req.params.orderId);
    order.status = "Order Declined";
    await order.save();
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Order Declined By Store",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Orders between Dates (Get req)
exports.betweendates = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let storeid = jwt.verify(token, process.env.JWT_SECRET);
    if (!storeid) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "Authentication Failed",
      });
    }
    // const store = await Store.findById(storeid.id);
    // if (store.isApproved == false) {
    //   return res.status(500).json("Registeration approval pending by admin");
    // }
    // createdAt: {
    //   $gte: ISODate("2022-04-24T00:10:40.294Z"),
    //   $lt: ISODate("2022-04-26T00:10:40.294Z"),
    // },
    let orders = await Order.find({ vendorId: storeid.id.toString() }).populate(
      [
        {
          path: "products.productId",
          model: "Product",
          select: "_id price name image",
        },
      ]
    );
    let orderNo = orders.length;
    let itemsold = 0;
    let earning = 0;
    orders.forEach((ele) => {
      earning += ele.Total;
      itemsold += ele.products.length;
    });
    res.status(200).json({
      success: true,
      stationCode: 200,
      orderNo: orderNo,
      ItemSold: itemsold,
      Earning: earning,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

//Get Top Selling Products (Get req)
exports.topselling = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let storeid = jwt.verify(token, process.env.JWT_SECRET);
    if (!storeid) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "Authentication Failed",
      });
    }
    // const store = await Store.find({ _id: storeid.id.toString() });
    // if (store.isApproved == false) {
    //   return res.status(500).json("Registeration approval pending by admin");
    // }
    let orders = await Order.aggregate([
      { $match: { vendorId: storeid.id.toString() } },
      {
        $unwind: {
          path: "$products",
        },
      },
      {
        $group: {
          _id: "$products.productId",
          totalSold: {
            $sum: "$products.quantity",
          },
        },
      },
      {
        $sort: {
          totalSold: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);
    // .populate([
    //   {
    //     path: "products.productId",
    //     model: "Product",
    //     select:
    //       "_id name,image,category,subcategory",
    //   },
    // ]);
    // const storeProduct = await Product.distinct("vendorId", {
    //   subcategory: categoryName,
    // });
    // const now = await Store.find({ _id: { $in: storeProduct } });
    let details = await Product.populate(orders, {
      path: "_id",
      select: { _id: 5, name: 5, image: 5 },
    });
    res.status(200).json({
      success: true,
      stationCode: 200,
      data: details,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
