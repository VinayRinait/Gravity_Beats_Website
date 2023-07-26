//import path from 'path';
const path = require("path");
//import express from 'express';
const express = require("express");
//import dotenv from 'dotenv';
const dotenv = require("dotenv");
//import multer from 'multer';
const multer = require("multer");
//import cors from 'cors';
const cors = require("cors");
//import mongoose from 'mongoose';
const mongoose = require("mongoose");
//import morgan from 'morgan';
const morgan = require("morgan");

const bodyParser = require("body-parser");
//import connectDB from './config/connectDB.js';
const connectDB = require("./config/connectDB");
//routes
//import userRoutes from './routes/userRoutes.js';
const userRoutes = require("./routes/userRoutes");
const trainRoutes = require("./routes/trainRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
//import storeRoutes from './routes/storeRoutes.js';
const storeRoutes = require("./routes/storeRoutes");
//import uploadRoute from './routes/uploadRoute.js';
const uploadRoute = require("./routes/uploadRoute");
const adminRoutes = require("./routes/adminRoutes");
//import otpRoute from './routes/smsIntegrationRoutes.js';
// const otproute= require('./routes/smsIntegrationRoutes');
//import productRoute from './routes/productRoutes.js'
const productRoute = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const PaymentRoute = require('./routes/paymentRoute')
dotenv.config();
connectDB();
 
//DB connection will come here

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  // app.use(express.static("build"));
}

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(express.static(__dirname));
app.use("/api/users", userRoutes);
app.use(`/api/stores`, storeRoutes);
app.use(`/api/upload`, uploadRoute);
app.use(`/api/train`, trainRoutes);

// app.use(`/api/sms`, otpRoute);
app.use(`/api/products`, productRoute);
app.use(`/api/payment`, PaymentRoute);
app.use(`/api/orders`, orderRoutes);  
app.use(`/api/delivery`, deliveryRoutes);
app.use(`/api/admin`, adminRoutes);

// const __dirname = path.resolve()
app.use("/", express.static(path.join(__dirname, "/build")));
const PORT = 5001;

const server = app.listen(process.env.PORT || PORT, () => {
  console.log(`Server Running on port http://localhost:${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the Server due to unhandled rejection`);
  server.close(() => {
    process.exit(1);
  });
});
