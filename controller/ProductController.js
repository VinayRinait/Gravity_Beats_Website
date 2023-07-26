const asyncHandler = require("express-async-handler");
const Category = require("../models/Category.js");
const jwt = require("jsonwebtoken");
const Product = require("../models/Products.js");
const Store = require("../models/Store.js");
const SubCategory = require("../models/subCategory.js");

const addProduct = asyncHandler(async (req, res) => {
  try {
    console.log(req);
    let token = req.headers.authorization.split(" ")[1];
    let storeid = jwt.verify(token, process.env.JWT_SECRET);
    if (!storeid) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "Authentication Failed",
      });
    }
    // Add here to look for category and then use the gst inside that to the product controller
    let category = await Category.findOne({
      subcategory: req.body.subcategory,
    });
    const url = req.protocol + '://' + req.get('host')
    let obj = {
      name: req.body.name,
      image: url + '/uploads/' + req.file.filename,
      category: req.body.category,
      subcategory: req.body.subcategory,
      veg: req.body.veg || true,
      bestSeller: req.body.bestSeller || false,
      chefSpecial: req.body.chefSpecial || false,
      vendorId: storeid.id,
      gst: category.gstPercent,
      variable: req.body.variable,
    };
    // send price,qty,discount,unit,inStock as objects in variable array.
    let product = await Product.create(obj);
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "New product added by vendor",
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

const getProducts = asyncHandler(async (req, res) => {
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
    // let store = await Store.findById(storeid.id);
    // let mycategory = await Category.find({
    //   parent: "null",
    //   subcategory: store.categories,
    // });
    let products = await Product.find({
      vendorId: storeid.id,
      subcategory: req.params.subcategoryName,
    });
    res.status(200).json({
      success: true,
      stationCode: 200,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const getSubcategories = asyncHandler(async (req, res) => {
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
    let store = await Store.findById(storeid.id);
    let mycategory = await Category.findOne({
      subcategory: store.categories,
    });
    let category = await SubCategory.find({ categoryid: mycategory._id });
    return res.status(200).json({
      success: true,
      stationCode: 200,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const getcategories = asyncHandler(async (req, res) => {
  try {
    let category = await Category.find();
    return res.status(200).json({
      success: true,
      stationCode: 200,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

const mysubcategory = asyncHandler(async (req, res) => {
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

    const storesubcategory = await Product.distinct("subcategory", {
      vendorId: storeid.id,
    });
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: storesubcategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
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
    let exists = await Product.findById(req.params.productId);
    if (exists) {
      exists.name = req.body.name || exists.name;
      exists.variable = req.body.variable || exists.variable;
      exists.veg = req.body.veg || exists.veg;
      exists.bestSeller = req.body.bestSeller || exists.bestSeller;
      exists.chefSpecial = req.body.chefSpecial || exists.chefSpecial;
      await exists.save();
      res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Product Updated",
      });
    } else {
      res.status(404).json({
        status: 404,
        stationCode: 404,
        message: "Product not found",
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
const makeTopSelling = asyncHandler(async (req, res) => {
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
    let exists = await Product.findById(req.params.productId);
    if (!exists) {
      return res.status(404).json({
        status: 404,
        stationCode: 404,
        message: "Product not found",
      });
    } else {
      exists.variable.topSelling = true;
      await exists.save();

      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Product in Top Selling",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const makeoutOfTopSelling = asyncHandler(async (req, res) => {
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
    let exists = await Product.findById(req.params.productId);
    if (!exists) {
      return res.status(404).json({
        status: 404,
        stationCode: 404,
        message: "Product not found",
      });
    } else {
      exists.variable.topSelling = false;
      await exists.save();

      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Product out of Top Selling",
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

const deleteProduct = asyncHandler(async (req, res) => {
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
    await Product.deleteOne({ _id: req.params.productId });
    return res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Product Deleted",
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
  mysubcategory,
  addProduct,
  getProducts,
  getSubcategories,
  updateProduct,
  deleteProduct,
  makeTopSelling,
  makeoutOfTopSelling,
  getcategories
};
