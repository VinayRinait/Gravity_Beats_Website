const asyncHandler = require("express-async-handler");
const NewsLetter = require("../models/NewsLetter.js");

const signNewsletter = asyncHandler(async (req, res) => {
  try {
    let { email, userName } = req.body;
    let duplicate = await NewsLetter.findOne({ email: email });
    if (duplicate) {
      return res
        .status(500)
        .json({ mess: "You have already Signed Up for our NewsLetter" });
    }
    let obj = {
      email: email,
      userName: userName,
    };
    let newsletter = await NewsLetter.create(obj);
    res
      .status(200)
      .json({
        success: true,
        stationCode: 200,
        message: "Thank You for Signing Up to our Newsletter",
      });
    
    
    
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

module.exports = { signNewsletter };
