//import mongoose from 'mongoose';
const mongoose = require("mongoose");
const subCategorySchema = mongoose.Schema({
  parent: {
    type: String,
    required:false,
  },
  categoryid:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Category',
      required:true
      
  },
  subcategory: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
});

const SubCategory = mongoose.model("subCategory", subCategorySchema);
module.exports = SubCategory;
