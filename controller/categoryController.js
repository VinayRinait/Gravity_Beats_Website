const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");

exports.getCategories = asyncHandler(async (req, res) => {
  try {
    let categories = await Category.find({});
    res.status(200).json({
      status: 200,
      stationCode: 200,
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
