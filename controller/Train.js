const asyncHandler = require("express-async-handler");
const User = require("../models/User.js");
const Order = require("../models/Orders.js");
const Delivery = require("../models/Delivery.js");
const Store = require("../models/Store.js");
const Category = require("../models/Category.js");
const Product = require("../models/Products.js");
const Coupons = require("../models/Coupons.js");
const Cart = require("../models/Cart.js");
const Prescription = require("../models/Prescription.js");
const CustomDelivery = require("../models/CustomDelivery.js");
const axios = require("axios");
const Admin = require("../models/Admin.js");
const { Client } = require("@googlemaps/google-maps-services-js");

// Enter PNR details to fetch details

const coachDetails = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let userid = jwt.verify(token, process.env.JWT_SECRET);
    if (!userid) {
      return res.status(500).json({ msg: "User not found" });
    }

    const options = {
      method: "GET",
      url: "https://irctc1.p.rapidapi.com/api/v2/getPNRStatus",
      params: { pnrNumber: "6503529710" },
      //   enter pnr number req.body.pnrCode
      headers: {
        "X-RapidAPI-Key": "32bed9662bmsh54904754881bd7dp13dbb1jsn4353e7936215",
        "X-RapidAPI-Host": "irctc1.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        return res.status(200).json({ response });
      })
      .catch(function (error) {
        return res.status(500).json({
          success: false,
          stationCode: 500,
          message: error.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Submit details to fetch Station to order Food

const liveStatus = asyncHandler(async (req, res) => {
  // AIzaSyCUp07QM56rvYC1gKmRnAIDAZQKKq5w2hc
  try {
    // let token = req.headers.authorization.split(" ")[1];
    // let userid = jwt.verify(token, process.env.JWT_SECRET);
    // if (!userid) {
    //   return res.status(500).json({ msg: "User not found" });
    // }

    const options = {
      method: "GET",
      url: "https://irctc1.p.rapidapi.com/api/v1/liveTrainStatus",
      params: { trainNo: "12925" },
      headers: {
        "X-RapidAPI-Key": "32bed9662bmsh54904754881bd7dp13dbb1jsn4353e7936215",
        "X-RapidAPI-Host": "irctc1.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        const dt = response.data;
        const currentStatus = response.data.data.current_location_info[0];
        const lastStation = response.data.data.current_location_info[1];
        const currentStation = response.data.data.current_station_code;
        const source = response.data.data.source;
        const trainName = response.data.data.ir_train_name;
        const trainNo = response.data.data.train_number;
        const currentState = response.data.data.current_state_code;
        const trainStart = response.data.data.train_start_date;
        const statusAsof = response.data.data.status_as_of;
        const delay = response.data.data.delay;
        return res.status(200).json({
          currentState,
          lastStation,
          currentStatus,
          currentStation,
          trainName,
          trainNo,
          trainStart,
          delay,
          statusAsof,
          source,
        });
      })
      .catch(function (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          stationCode: 500,
          message: error.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

const fetchStations = asyncHandler(async (req, res) => {
  try {
    // let token = req.headers.authorization.split(" ")[1];
    // let userid = jwt.verify(token, process.env.JWT_SECRET);
    // if (!userid) {
    //   return res.status(500).json({ msg: "User not found" });
    // }

    const options = {
      method: "GET",
      url: "https://irctc1.p.rapidapi.com/api/v1/getTrainSchedule",
      params: { trainNo: "12925" },
      headers: {
        "X-RapidAPI-Key": "32bed9662bmsh54904754881bd7dp13dbb1jsn4353e7936215",
        "X-RapidAPI-Host": "irctc1.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then((response) => {
        return res.status(200).json({
          success: true,
          statusCode: 200,
          data: response,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          stationCode: 500,
          message: error.message,
        });
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
  fetchStations,
  coachDetails,
  liveStatus,
};

const client = new Client({});
