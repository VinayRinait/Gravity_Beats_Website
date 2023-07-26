//import asyncHandler from 'express-async-handler';
const asyncHandler = require("express-async-handler");
//import fetch from 'node-fetch';
// const fetch= require('node-fetch');
const fetch = require("node-fetch");
//import otpGenerator from 'otp-generator';
const otpGenerator = require("otp-generator");
//import dotenv from 'dotenv';
const dotenv = require("dotenv");

dotenv.config();

const sendOtp = asyncHandler(async (req, res) => {
  let { number } = req.body;

  try {
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    let headers = {
      "Content-Type": "application/json",
      "api-key": process.env.SMS_API_KEY,
    };

    let body = {
      to: number,
      type: "OTP",
      sender: process.env.SMS_API_SID,
      body: `Dear Customer, ${otp} is your OTP (One Time Password) for the registration.`,
    };
    let response = await fetch(
      `${process.env.SMS_BASE_URL}/${process.env.SMS_API_SID}/messages`,
      { method: "post", body: JSON.stringify(body), headers: headers }
    );

    console.log(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

module.exports = { sendOtp };
