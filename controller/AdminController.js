const asyncHandler = require("express-async-handler");
const User = require("../models/User.js");
const Complaints = require("../models/Complaints");
const { generateToken } = require("../utils/generateToken.js");
const jwt = require("jsonwebtoken");
const Order = require("../models/Orders.js");
const Delivery = require("../models/Delivery.js");
const Store = require("../models/Store.js");
const Product = require("../models/Products.js");
const sendMail = require("../utils/sendMail.js");
const Admin = require("../models/Admin.js");
const Category = require("../models/Category.js");
const Coupons = require("../models/Coupons.js");
const Menu = require("../models/Menu.js");
const sendSMS = require("../utils/sendSMS.js");
const { updateIncentive, updateMonth } = require("../utils/Scheduler.js");
const { sendNotice } = require("../utils/sendMail.js");
const csv = require("csvtojson");
const { response } = require("express");
const Banner = require("../models/Banner.js");
const SubCategory = require("../models/subCategory.js");
const mailer = require("../middleware/mailer.js");
const Transanction = require("../models/transanction.js");
// Add Station for Delivery
const addStation = asyncHandler(async (req, res) => {
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
    let admin = await Admin.findById(adminid.id);
    let availableStations = admin.availableStations;
    let obj = {
      city: req.body.city,
      stationCode: req.body.stationCode,
      lat: req.body.lat,
      long: req.body.long,
    };
    let result = [...availableStations, obj];
    admin.availableStations = result;
    await admin.save();
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "New Station Added for delivery",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
// Send Incentives to all delivery person
const sendIncentive = asyncHandler(async (req, res) => {
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
    const delivery = await Delivery.distinct("_id");
    const today1 = new Date(Date.now());
    today1.setDate(today1.getDate() + 2);
    today1.setHours(0, 0, 0, 0);
    // const today2 = new Date(today1.getTime() + 60000);
    updateIncentive(delivery, today1, adminid.id);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Monthly Incentives Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

const settleMonthlyIncentive = asyncHandler(async (req, res) => {
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
    const delivery = await Delivery.distinct("_id");
    updateMonth(delivery);
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Incentives Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// update Incentive Amount
const updateIncentiveAmount = asyncHandler(async (req, res) => {
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
    let exists = await Admin.findById(adminid.id);
    if (exists) {
      exists.incentiveTen1 = req.body.incentiveTen1 || exists.incentiveTen1;
      exists.incentiveTen2 = req.body.incentiveTen2 || exists.incentiveTen2;
      exists.incentiveTen3 = req.body.incentiveTen3 || exists.incentiveTen3;
      exists.incentiveTen4 = req.body.incentiveTen4 || exists.incentiveTen4;
      exists.incentiveTen5 = req.body.incentiveTen5 || exists.incentiveTen5;
      exists.save();
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Incentives Updated",
      });
    }
    res.status(404).json({
      success: false,
      stationCode: 404,
      message: "User not found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const getAdmin = asyncHandler(async (req, res) => {
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
    let admin = await Admin.findById(adminid.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        stationCode: 404,
        message: "Admin not found",
      });
    }
    res.status(200).json({
      success: true,
      stationCode: 200,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const getAdminController = asyncHandler(async (req, res) => {
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
    let admin = await Admin.findById(adminid.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        stationCode: 404,
        message: "Admin not found",
      });
    }
    const {
      firstName,
      lastName,
      email,
      createdAt,
      updatedAt,
      phoneNo,
      password,
      isAdmin,
      ...control
    } = admin._doc;
    res.status(200).json({
      success: true,
      stationCode: 200,
      control,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const updateAdminController = asyncHandler(async (req, res) => {
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
    let admin = await Admin.findById(adminid.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        stationCode: 404,
        message: "Admin not found",
      });
    }
    const newAdmin = await Admin.findByIdAndUpdate(
      { _id: adminid.id },
      req.body
    );
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Admin Updated",
      newAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const getIncentiveAmount = asyncHandler(async (req, res) => {
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
    let exists = await Admin.findById(adminid.id);
    if (!exists) {
      return res.status(404).json({
        success: false,
        stationCode: 404,
        message: "Admin not found",
      });
    }

    const obj = {
      incentiveTen1: exists.incentiveTen1,
      incentiveTen2: exists.incentiveTen2,
      incentiveTen3: exists.incentiveTen3,
      incentiveTen4: exists.incentiveTen4,
      incentiveTen5: exists.incentiveTen5,
    };
    res.status(200).json({
      success: true,
      stationCode: 200,
      data: obj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Upload Menu
const addMenu = asyncHandler(async (req, res) => {
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
    const menu = await Menu.findOne({vendorId: req.params.vendorId });
    const { fileName } = req.body;
    if (menu) {
      const productArray = await csv().fromFile(
        `${__dirname}/../routes/csvuploads/${fileName}`
      );
      menu.menu = [...menu.menu, ...productArray];
      menu.save();
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Menu Updated",
      });
    } else {
      const productArray = await csv().fromFile(
        `${__dirname}/../routes/csvuploads/${fileName}`
      );
      let newObj = {
        vendorId: req.params.vendorId,
        menu: productArray,
      };
      const newMenu = await Menu.create(newObj);
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "New menu added",
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

// Display Menu
const showMenu = asyncHandler(async (req, res) => {
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
    const menu = await Menu.findOne({ vendorId: req.params.vendorId });
    if (menu) {
      const mymenu = menu.menu;
      return res.status(200).json({
        success: true,
        stationCode: 200,
        data: mymenu,
      });
    } else {
      const mymenu = [];
      return res.status(200).json({
        success: true,
        stationCode: 200,
        data: mymenu,
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

// update cashback amount for vendors by category
const updateCashback = asyncHandler(async (req, res) => {
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
    const vendors = await Store.find();
    const category = await Category.find();
    vendors.forEach((ele) => {
      category.forEach((element) => {
        if (element.subcategory == ele.categories) {
          ele.cashback = element.cashBack;
          ele.save();
        }
      });
    });
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Cashback Updated for old vendors",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Terms & Conditions
const termsConditions = asyncHandler(async (req, res) => {
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
    const admin = await Admin.findById(adminid.id);
    const terms = admin.termsConditions;
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: terms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
// Add Slot
const addSlot = asyncHandler(async (req, res) => {
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
    const admin = await Admin.findById(adminid.id);
    const { isActive, timeInterval, isNow } = req.body;
    if (isNow) {
      const obj = {
        slot: timeInterval,
        isActive: isActive,
      };
      admin.slotNow = [...admin.slotNow, obj];
      admin.save();
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "New time slot added",
      });
    }
    const obj = {
      slot: timeInterval,
      isActive: isActive,
    };
    admin.slotLater = [...admin.slotLater, obj];
    admin.save();
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "New time slot added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
// View Time Slots
const viewSlots = asyncHandler(async (req, res) => {
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
    const admin = await Admin.findById(adminid.id);
    const slotNow = admin.slotNow;
    const slotLater = admin.slotLater;
    res.status(200).json({
      success: true,
      stationCode: 200,
      SlotNowData: slotNow,
      slotLaterData: slotLater,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
// Remove Slots
const removeSlot = asyncHandler(async (req, res) => {
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
    const admin = await Admin.findById(adminid.id);
    const { slotIndex, isNow } = req.body;
    if (isNow) {
      admin.slotNow.splice(slotIndex, 1);
      admin.save();
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Time Slot removed ",
      });
    }
    admin.slotLater.splice(slotIndex, 1);
    admin.save();
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Time Slot removed ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Toggle Active State of Time Slot
const toggleSlot = asyncHandler(async (req, res) => {
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
    const admin = await Admin.findById(adminid.id);
    const { slotIndex, isNow } = req.body;
    if (isNow) {
      admin.slotNow[slotIndex].isActive = !admin.slotNow[slotIndex];
      admin.save();
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Time Slot Toggled ",
      });
    }
    admin.slotLater[slotIndex].isActive = !admin.slotLater[slotIndex];
    admin.save();
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Time Slot Toggled ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Update Terms & Conditions
const updateTerms = asyncHandler(async (req, res) => {
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
    const exists = await Admin.findById(adminid.id);
    exists.termsConditions.customer =
      req.body.customer || exists.termsConditions.customer;
    exists.termsConditions.vendor =
      req.body.vendor || exists.termsConditions.vendor;
    exists.termsConditions.delivery =
      req.body.delivery || exists.termsConditions.delivery;
    exists.termsConditions.aboutUs =
      req.body.aboutUs || exists.termsConditions.aboutUs;
    exists.termsConditions.privacyPolicy =
      req.body.privacyPolicy || exists.termsConditions.privacyPolicy;
    await exists.save();
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Terms & Conditions Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Register
const register = asyncHandler(async (req, res) => {
  try {
    let { email } = req.body;
    let duplicate = await Admin.findOne({ email: email });
    if (duplicate) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "Admin already exists,please try to login",
      });
    } else {
      let admin = await Admin.create(req.body);
      res.json({
        _id: admin._id,
        admin,
        token: generateToken(admin._id),
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

// Login
const login = asyncHandler(async (req, res) => {
  try {
    let { email, password } = req.body;
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(500).json({
        success: false,
        stateCode: 500,
        message: `Invalid email or password`,
      });
    }
    if (await admin.matchPassword(password)) {
      res.status(200).json({
        success: true,
        stationCode: 200,
        _id: admin._id,
        token: generateToken(admin._id),
      });
    } else {
      res.status(500).json({
        success: false,
        stateCode: 500,
        message: `Invalid email or password`,
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

// Create Category
const createCategory = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let adminid = jwt.verify(token, process.env.JWT_SECRET);
    if (!adminid) {
      return res.json("Login to continue");
    }
    const url = req.protocol + "://" + req.get("host");
    let obj = {
      parent: req.body.parent,
      image: url + "/uploads/" + req.file.filename,
      // subcategory: req.body.subcategory,
      bgColor: "red",
      hsnCode: req.body.hsnCode,
      gstPercent: req.body.gstPercent,
      cashBack: req.body.cashBack,
      commision: req.body.commision,
    };
    const category = await Category.create(obj);
    res.status(200).json({
      success: true,
      message: "New Cateogry is Created",
      category,
    });
  } catch (error) {
    res.status(500).json({ success: false, stateCode: 500, message: error.message });
  }
});
const getTransanction = async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let adminid = jwt.verify(token, process.env.JWT_SECRET);
    if (!adminid) {
      return res.json("Login to continue");
    }
    const transanction = await Transanction.find();
    const total = transanction.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amount,
      0
    );
    res.status(200).json({
      success: true,
      stateCode: 200,
      totalAmount: total,
      transanction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
};

const createsubCategory = asyncHandler(async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let adminid = jwt.verify(token, process.env.JWT_SECRET);
    if (!adminid) {
      return res.json("Login to continue");
    }
    
    const url = req.protocol + "://" + req.get("host");
    let obj = {
      // parent: req.body.parent,
      categoryid:req.body.categoryid,
      image: url + "/uploads/" + req.file.filename,
      subcategory: req.body.subcategory,
    };
    console.log("obj",obj)
    const subcategory = await SubCategory.create(obj);
    console.log(subcategory)
    res.status(200).json({
      success: true,
      message: "New sub Cateogry is Created",
      subcategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stateCode: 500,
      message: error.message,
    });
  }
});


const updateUser = asyncHandler(async (req, res) => {
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
    let user = await User.findById(req.params.id);
    console.log(user);
    if (user) {
      await User.updateOne({ _id: req.params.id }, req.body);
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "User Updated",
      });
    }
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: "User Not found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
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
    let user = await User.findById(req.params.id);
    console.log(user);
    if (user) {
      await User.deleteOne({ _id: req.params.id });
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "User Deleted",
      });
    }
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: "User Not found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
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
    let category = await Category.findById({ _id: req.params.categoryId });
    if (category) {
      await Category.deleteOne({ _id: req.params.categoryId });
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Category Deleted",
      });
    }
    res
      .status(500)
      .json({ success: false, stateCode: 500, message: "Category not found" });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
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
    var newParent = "null";
    if (req.body.parent != "null") {
      var parent = await Category.findOne({ subcategory: req.body.parent });
      newParent = parent._id.toString();
    }
    let exists = await Category.findById(req.params.categoryId);
    const url = req.protocol + "://" + req.get("host");

    if (exists) {
      exists.gstPercent = req.body.gstPercent || exists.gstPercent;
      exists.cashBack = req.body.cashBack || exists.cashBack;
      exists.hsnCode = req.body.hsnCode || exists.hsnCode;
      exists.parent = newParent;
      (exists.image = url + "/uploads/" + req.file.filename),
        (exists.subcategory = req.body.subcategory || exists.subcategory);
      await exists.save();
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Category Updated",
      });
    }
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: "Category not found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Delete SubCategory
const deleteSubCategory = asyncHandler(async (req, res) => {
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
    let subcategory = await SubCategory.findById({ _id: req.params.subcategoryId });
    console.log("subcategory===>",subcategory)
    if (subcategory) {
      await SubCategory.deleteOne({ _id: req.params.subcategoryId });
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "SubCategory Deleted",
      });
    }
    res
      .status(500)
      .json({ success: false, stateCode: 500, message: "SubCategory not found" });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});


const updatesubCategory = asyncHandler(async (req, res) => {
  console.log(req.params);
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
    let exists = await SubCategory.findById(req.params.id);
    console.log(exists)
    if (!exists) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "sub Category not found",
      });
    }
    const url = req.protocol + "://" + req.get("host");
    exists.parent = req.body.parent|| exists.parent;
    exists.image =  req.body.image || exists.image;
    exists.subcategory = req.body.subcategory || exists.subcategory;
    await exists.save();
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "subCategory Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Create Coupons
const createCoupons = asyncHandler(async (req, res) => {
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
    let id = adminid.id;
    const url = req.protocol + "://" + req.get("host");
    let obj = {
      category: req.body.category,
      image: url + "/uploads/" + req.file.filename,
      couponCode: req.body.couponCode,
      isPercent: req.body.isPercent,
      minimumOrderValue: req.body.minimumOrderValue,
      amountOff: req.body.amountOff,
      expiryDuration: req.body.expiryDuration,
      offeredBy: "admin",
      storeId: id,
    };
    const coupon = await Coupons.create(obj);
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "New Coupon is Created",
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const createBanner = asyncHandler(async (req, res) => {
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
    const url = req.protocol + "://" + req.get("host");

    let obj = {
      category: req.body.category,
      image: url + "/uploads/" + req.file.filename,
    };
    const banner = await Banner.create(obj);
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "New banner is Created",
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const getBanner = asyncHandler(async (req, res) => {
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
    const banner = await Banner.find();
    res.status(200).json({
      success: true,
      stationCode: 200,
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const updateBanner = asyncHandler(async (req, res) => {
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
    let banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        stationCode: 404,
        message: "Banner not found",
      });
    }
    banner.category = req.body.category;
    banner.image = req.body.image;
    const newBanner = await banner.save();
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Banner Updated",
      newBanner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const deleteBanner = asyncHandler(async (req, res) => {
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
    let banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        stationCode: 404,
        message: "banner not found",
      });
    }
    const deletedBanner = await Banner.deleteOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Below Banner Deleted",
      deletedBanner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

const getBannerById = asyncHandler(async (req, res) => {
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
    let banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        stationCode: 404,
        message: "banner not found",
      });
    }
    res.status(200).json({
      success: true,
      stationCode: 200,
      banner,
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
    let adminid = jwt.verify(token, process.env.JWT_SECRET);
    if (!adminid) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Login to continue",
      });
    }

    const coupon = await Coupons.find({
      offeredBy: "admin",
      storeId: adminid.id.toString(),
    });
    res.status(200).json({
      success: true,
      stationCode: 200,
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const viewProducts = asyncHandler(async (req, res) => {
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

    const products = await Product.find();
    res.status(200).json({
      success: true,
      stationCode: 200,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// view Category
const viewCategory = asyncHandler(async (req, res) => {
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
    const categories = await Category.find();
    res.status(200).json({
      success: true,
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


const viewSubCategory = asyncHandler(async (req, res) => {
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
    const subcategories = await SubCategory.aggregate([
     
      {
        $lookup: 
      {
       from: 'categories', 
       localField: 'categoryid', 
       foreignField: '_id', 
       as:'CategoryList'
      }
  }])
  
    console.log("lookup==>",subcategories)
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



const viewSubCategorybycategoryid = asyncHandler(async (req, res) => {
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

    const subcategorybycategoryid = await SubCategory.find({categoryid:req.params.categoryid});
    console.log(subcategorybycategoryid)
    res.status(200).json({
      success: true,
      stationCode: 200,
      data: subcategorybycategoryid,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});



// fetch sub Category
const fetchSubcategory = asyncHandler(async (req, res) => {
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
    const category = await Category.find();
    res.status(200).json({
      success: true,
      stationCode: 200,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Delete Coupons
const deleteCoupons = asyncHandler(async (req, res) => {
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
    let coupon = await Coupons.findById({ _id: req.params.couponId });
    if (coupon) {
      await Coupons.deleteOne({ _id: req.params.couponId });
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Coupon Deleted",
      });
    }
    res.status(404).json({
      success: false,
      stationCode: 404,
      message: "Coupon not found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Update Charges
const updateCharges = asyncHandler(async (req, res) => {
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
    let exists = await Admin.findById(adminid.id);
    if (exists) {
      exists.serviceFee = req.body.serviceFee || exists.serviceFee;
      exists.distanceFee = req.body.distanceFee || exists.distanceFee;
      exists.baseFare = req.body.baseFare || exists.baseFare;
      exists.customdistanceFee =
        req.body.customdistanceFee || exists.customdistanceFee;
      exists.customPackaging =
        req.body.customPackaging || exists.customPackaging;
      exists.save();
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Charges Updated",
      });
    }
    res.status(404).json({
      success: false,
      stationCode: 404,
      message: "User not found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const getCharges = asyncHandler(async (req, res) => {
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
    let exists = await Admin.findById(adminid.id);
    if (!exists) {
      return res.status(404).json({
        success: false,
        stationCode: 404,
        message: "Admin not found",
      });
    }
    const obj = {
      distanceFee: exists.distanceFee,
      baseFare: exists.baseFare,
      customdistanceFee: exists.customdistanceFee,
      customPackaging: exists.customPackaging,
      serviceFee: exists.serviceFee,
    };
    res.status(200).json({
      success: true,
      stationCode: 200,
      data: obj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// View all Vendors
const viewVendors = asyncHandler(async (req, res) => {
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
    const vendors = await Store.find();
    // Can add a query to show only approved vendors
    res.status(200).json({
      success: true,
      stationCode: 200,
      data: vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const productBetween = asyncHandler(async (req, res) => {
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
    const vendors = await Store.find();
    // Can add a query to show only approved vendors
    res.status(200).json({
      success: true,
      stationCode: 200,
      data: vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// View Particular Vendor
const viewParticularVendor = asyncHandler(async (req, res) => {
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
    const vendor = await Store.findById(req.params.vendorId);
    // Can add a query to show only approved vendors
    res.status(200).json({
      success: true,
      stationCode: 200,
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// View Particular Delivery
const viewParticularDelivery = asyncHandler(async (req, res) => {
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
    const delivery = await Delivery.findById(req.params.deliveryId);
    // Can add a query to show only approved vendors
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

// Approve Vendors
const approveVendors = asyncHandler(async (req, res) => {
  try {
    console.log(req.params.vendorId)
    console.log("body Header " + req.headers.authorization);
    let token = req.headers.authorization.split(" ")[1];
    let adminid = jwt.verify(token, process.env.JWT_SECRET);
    if (!adminid) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Login to continue",
      });
    }
    const vendor = await Store.findById(req.params.vendorId);
    vendor.isApproved = true;

    // await Promise.all([
    //   sendMail("Your registration request has been approved", vendor.email),
    // ]);

    await vendor.save();
    // let mes =
    //   "Thank You for Joining Gravity Bites. Your documents have been verified by our team. Grow your business with us";
    // mailer(vendor.email, "Vendor Approved", mes);
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Vendor Registration Approved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Disapprove Vendors
const disapproveVendors = asyncHandler(async (req, res) => {
  try {
    console.log(req.params.vendorId)
    let token = req.headers.authorization.split(" ")[1];
    let adminid = jwt.verify(token, process.env.JWT_SECRET);
    if (!adminid) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Login to continue",
      });
    }
    const vendor = await Store.findById(req.params.vendorId);
    vendor.isApproved = false;
    // await Promise.all([
    //   sendMail("Your registration request was not approved", vendor.email),
    // ]);

    await vendor.save();
    let mes =
      "Your account request has been dis-aaproved by our team as you didn't meet all the requirements to become a valid gravityBites partner.";
    mailer(vendor.email, "Vendor disApproved", mes);
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Vendor Registration was disapproved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Remove Vendor
const removeVendor = asyncHandler(async (req, res) => {
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
    const vendor = await Store.find({ _id: req.params.storeId });
    if (vendor) {
      await Store.deleteOne({
        _id: req.params.storeId,
      });
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Vendor was removed",
      });
    }
    res.status(404).json({
      success: false,
      statusCode: 404,
      message: "Vendor not found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Send Notice
const sendnotice = asyncHandler(async (req, res) => {
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
    const { message, email, sub } = req.body;
    mailer(email, sub, message);
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Notice sent to the user mail id",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// View all Delivery Personnel
const viewDelivery = asyncHandler(async (req, res) => {
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
    const delivery = await Delivery.find();
    // Can add a query to give only approved delivery person
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

// Approve Delivery Personnel
const approveDelivery = asyncHandler(async (req, res) => {
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
    const delivery = await Delivery.findById(req.params.deliveryId);

    delivery.isApproved = true;

    // await Promise.all([
    //   sendMail("Your registration request has been approved", delivery.email),
    // ]);
    await delivery.save();
    let mes =
      "Congratulations you account has been approved, login in to your account to receive your frst order.";
    mailer(delivery.email, "Delivery Approved", mes);
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Delivery Person Approved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Disapprove Delivery
const disapproveDelivery = asyncHandler(async (req, res) => {
  try {
    console.log(req.params.deliveryId)
    let token = req.headers.authorization.split(" ")[1];
    let adminid = jwt.verify(token, process.env.JWT_SECRET);
    if (!adminid) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Login to continue",
      });
    }
    const delivery = await Delivery.findById(req.params.deliveryId);
    delivery.isApproved = false;
    // await Promise.all([
    //   sendMail("Your registration request was not approved", delivery.email),
    // ]);
    await delivery.save();
    let mes =
      "Your account request has been dis-aproved by our team as you didn't meet all the requirements to become a valid gravity bites partner.";
    mailer(delivery.email, "Delivery disApproved", mes);
    res.status(200).json({
      success: true,
      stationCode: 200,
      message: "Delivery Registration was disapproved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Remove Delivery Personal
const removeDelivery = asyncHandler(async (req, res) => {
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
    const delivery = await Delivery.find({
      _id: req.params.deliveryId,
    });
    if (delivery) {
      await Delivery.deleteOne({
        _id: req.params.deliveryId,
      });
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Delivery Person was removed",
      });
    }
    res.status(404).json({
      success: false,
      stationCode: 404,
      message: "Delivery Person not found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// View Customers
const viewCustomers = asyncHandler(async (req, res) => {
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
    const customers = await User.find();
    res.status(200).json({
      success: true,
      stationCode: 200,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const viewProfit = asyncHandler(async (req, res) => {
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
    const profit = await Store.find();
    res.status(200).json({
      success: true,
      stationCode: 200,
      data: profit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// View Complaints
const viewComplaints = asyncHandler(async (req, res) => {
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
    const complaintStore = await Complaints.find({ user: "Vendor" }).populate([
      {
        path: "storeId",
        model: "Store",
        select: "fullName email",
      },
    ]);
    const complaintCustomer = await Complaints.find({
      user: "Customer",
    }).populate([
      {
        path: "storeId",
        model: "User",
        select: "name lastName email",
      },
    ]);
    const complaintDelivery = await Complaints.find({
      user: "Delivery",
    }).populate([
      {
        path: "storeId",
        model: "Delivery",
        select: "name email",
      },
    ]);
    const complaints = [
      ...complaintStore,
      ...complaintDelivery,
      ...complaintCustomer,
    ];
    res.status(200).json({
      success: true,
      stationCode: 200,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});

// Address Complaints
const addressComplaints = asyncHandler(async (req, res) => {
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
    const complaint = await Complaints.findById(req.params.complaintId);
    if (complaint.user == "Vendor") {
      const vendor = await Store.findById(complaint.storeId.toString());
      let mess = req.body.message;
      complaint.status = "closed";
      registrationMail(mess, vendor.email, "Complaint Addressed ");
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Complaint has been addressed",
      });
    }
    if (complaint.user == "Customer") {
      const vendor = await User.findById(complaint.storeId.toString());
      let mess = req.body.message;
      complaint.status = "closed";
      registrationMail(mess, vendor.email, "Complaint Addressed ");
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Complaint has been addressed",
      });
    }
    if (complaint.user == "Delivery") {
      const vendor = await Delivery.findById(complaint.storeId.toString());
      let mess = req.body.message;
      complaint.status = "closed";
      registrationMail(mess, vendor.email, "Complaint Addressed ");
      return res.status(200).json({
        success: true,
        stationCode: 200,
        message: "Complaint has been addressed",
      });
    }
    res.status(404).json({
      success: false,
      stationCode: 404,
      message: "Complaint not found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
});
const totalOrder = async (req, res) => {
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
    const totalOrder = await Order.find();
    var size = Object.keys(totalOrder).length;
    res.status(200).json({
      success: true,
      size,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
};
const totalUser = async (req, res) => {
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
    const totalUser = await User.find();
    var size = Object.keys(totalUser).length;
    res.status(200).json({
      success: true,
      size,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
};
const latestOrder = async (req, res) => {
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
    const latestOrder = await Order.find().sort({ createdAt: -1 }).limit(1);
    res.status(200).json({
      success: true,
      latestOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
};
const userData = async (req, res) => {
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
    const date_today = new Date();
    const lastday = new Date();
    lastday.setDate(lastday.getDate() - 1);
    const lastweek = new Date();
    lastweek.setDate(lastweek.getDate() - 7);
    const lastmonth = new Date();
    lastmonth.setDate(lastmonth.getDate() - 30);

    console.log(lastmonth);
    console.log(lastweek);
    console.log(lastmonth);
    const lastdayData = await User.find({
      createdAt: {
        $gte: lastday,
        $lt: date_today.toISOString(),
      },
    });
    const lastdaysize = Object.keys(lastdayData).length;

    const lastWeekData = await User.find({
      createdAt: {
        $gte: lastweek,
        $lt: date_today.toISOString(),
      },
    });

    const lastweeksize = Object.keys(lastWeekData).length;

    const lastMonthData = await User.find({
      createdAt: {
        $gte: lastmonth,
        $lt: date_today.toISOString(),
      },
    });
    const total = await User.find();
    const totalSize = Object.keys(total).length;
    const lastmonthsize = Object.keys(lastMonthData).length;
    res.status(200).json({
      success: true,
      lastdaysize,
      lastmonthsize,
      lastweeksize,
      totalSize,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
};
const getAllOrder = async (req, res) => {
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
    const order = await Order.find();
    res.status(200).json({
      success: true,
      stateCode: 200,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
};
const orderData = async (req, res) => {
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
    const date_today = new Date();
    const lastday = new Date();
    lastday.setDate(lastday.getDate() - 1);
    const lastweek = new Date();
    lastweek.setDate(lastweek.getDate() - 7);
    const lastmonth = new Date();
    lastmonth.setDate(lastmonth.getDate() - 30);

    console.log(lastmonth);
    console.log(lastweek);
    console.log(lastmonth);
    const lastdayData = await Order.find({
      createdAt: {
        $gte: lastday,
        $lt: date_today.toISOString(),
      },
    });
    const lastdaysize = Object.keys(lastdayData).length;

    const lastWeekData = await Order.find({
      createdAt: {
        $gte: lastweek,
        $lt: date_today.toISOString(),
      },
    });

    const lastweeksize = Object.keys(lastWeekData).length;

    const lastMonthData = await Order.find({
      createdAt: {
        $gte: lastmonth,
        $lt: date_today.toISOString(),
      },
    });
    const lastmonthsize = Object.keys(lastMonthData).length;
    const total = await Order.find();
    const totalSize = Object.keys(total).length;
    res.status(200).json({
      success: true,
      lastdaysize,
      lastmonthsize,
      lastweeksize,
      totalSize,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
};

const logout = (req, res) => {
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
    // res.end()
    res.clearCookie().status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      stationCode: 500,
      message: error.message,
    });
  }
};
module.exports = {
  addMenu,
  showMenu,
  latestOrder,
  createCategory,
  updateCategory,
  updatesubCategory,
  deleteCategory,
  createCoupons,
  deleteCoupons,
  register,
  login,
  logout,
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
  sendIncentive,
  settleMonthlyIncentive,
  updateIncentiveAmount,
  addStation,
  updateCashback,
  viewParticularDelivery,
  updateCharges,
  getCharges,
  sendnotice,
  updateTerms,
  termsConditions,
  addSlot,
  getIncentiveAmount,
  viewSlots,
  removeSlot,
  toggleSlot,
  updateUser,
  deleteUser,
  createBanner,
  getBanner,
  updateBanner,
  userData,
  deleteBanner,
  getBannerById,
  getAdmin,
  getAdminController,
  updateAdminController,
  viewProducts,
  totalOrder,
  orderData,
  createsubCategory,
  viewSubCategory,
  totalUser,
  getAllOrder,
  getTransanction,
  viewSubCategorybycategoryid,
  deleteSubCategory,
};
