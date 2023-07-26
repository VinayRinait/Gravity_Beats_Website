//import mongoose from "mongoose";
const mongoose = require("mongoose");
//import bcrypt from "bcryptjs";
const bcrypt = require("bcryptjs");
// const geocoder = require("../utils/geocoder.js");
// const { NumberContext } = require("twilio/lib/rest/pricing/v2/voice/number");

const StoreSchema = mongoose.Schema(
    {
        fullName: {type: String, required: true},
        storeName: {type: String, required: true},
        phoneNo: {type: String, required: true, minlength: 10},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true, minlength: 6},
        otp: {type: String, default: ""},
        streetName: {type: String, required: true},
        streetNumber: {type: String},
        city: {type: String, required: true},
        countryCode: {type: String, required: true},
        stateCode: {type: String, required: true},
        zipcode: {type: String, required: true},
        latitude: {type: String, required: true},
        longitude: {type: String, required: true},
        isApproved: {
            type: Boolean,
            default: false,
        },
        liscenseNo: {
            type: Number,
            required: true,
        },
        cashback: {
            type: Number,
            required: false,
        },
        openingTime: {
            type: String,
            required: true,
        },
        closingTime: {
            type: String,
            required: true,
        },
        licenseType: {
            type: String,
            required: true,
        },
        online: {
            type: Boolean,
            default: true,
        },
        address: {
            type: Object
        },
        myCoupons: [
            {
                couponId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Coupons",
                },
            },
        ],
        storeImage: {type: String, required: true},
        gst: {type: String, minlength: 15, unique: true, required: false},
        ownerPan: {type: String, required: true, unique: true, minlength: 10},
        bankName: {type: String, required: true},
        accountHolder: {type: String, required: true},
        accountNo: {type: Number, required: true},
        ifsc: {type: String, required: true},
        expiryDate: {type: String},
        licenseImage: {type: String, default: "null"},
        upiId: {type: String, unique: true, required: false},
        storeManager: {type: String, required: true},
        whatsappUpdate: {type: Boolean, required: true},
        categories: {type: String, required: true},
        services: {type: String, required: true},
        active: {type: Boolean, default: true},
        cancelledCheque: {type: String, required: true},
        uploadMenu: {type: String, required: true},
        uploadGSTcertificate: {type: String, required: true},
        uploadPan: {type: String, required: true},
        terms: {type: Boolean, default: true},
        policy: {type: Boolean, default: true},
        storeRating: {type: Number, default: 0},
        commision: {type: Number, default: 0},
        packagingCharge: {type: Number, default: 0},
        deliveryStation: {type: String, default: null},
        deliveryStation: {type: String, default: null},
        contact_id: {
            type: String,
            default: null,
        },
        fund_id: {
            type: String,
            default: null,
        },
        // uploadAadharfront: { type: Buffer, contentType: String, required: true },
        // uploadIds: { type: Buffer, contentType: String, required: false },
        // uploadAadharback: { type: Buffer, contentType: String, required: true },
        // uploadGSTcertificate: { type: Buffer, contentType: String, required: false },
        // uploadPan: { type: Buffer, contentType: String, required: true },
    },
    {
        timestamps: true,
    }
);

StoreSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

StoreSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // const loc = await geocoder.geocode(this.address);
    // console.log(loc, "123456");
    // this.location = {
    //   type: "Point",
    //   coordinates: [loc[0].longitude, loc[0].latitude],
    //   formattedAddress: loc[0].formattedAddress,
    // };
    next();
});

const Store = mongoose.model("Store", StoreSchema);
module.exports = Store;
