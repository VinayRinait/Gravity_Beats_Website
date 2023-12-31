//import jwt from 'jsonwebtoken'
const jwt = require("jsonwebtoken");
//import asyncHandler from 'express-async-handler'
const asyncHandler = require("express-async-handler");
//import User from '../models/user.js'
const User = require("../models/User.js");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log(token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.userType == "admin") {
    console.log("req.body");
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

const vendor = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.userType == "vendor") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an vendor");
  }
};

module.exports = { protect, admin, vendor };
