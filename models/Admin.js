const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = mongoose.Schema(
  {
    termsConditions: {
      customer: {
        type: String,
        required: true,
      },
      vendor: {
        type: String,
        required: true,
      },
      delivery: {
        type: String,
        required: true,
      },
      aboutUs: {
        type: String,
        required: true,
      },
      privacyPolicy: {
        type: String,
        required: true,
      },
    },
    // slotNow: [
    //   {
    //     slot: {
    //       type: String,
    //     },
    //     isActive: {
    //       type: Boolean,
    //       default: true,
    //     },
    //   },
    // ],
    // slotLater: [
    //   {
    //     slot: {
    //       type: String,
    //     },
    //     isActive: {
    //       type: Boolean,
    //       default: true,
    //     },
    //   },
    // ],
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
    deliverLaterDiscount: {
      type: Number,
      default: 0,
    },
    serviceFee: {
      type: Number,
      default: 0,
    },
    distanceFee: {
      type: Number,
      default: 0,
    },
    baseFare: {
      type: Number,
      default: 0,
    },
    incentiveTen1: {
      type: Number,
      default: 0,
    },
    incentiveTen2: {
      type: Number,
      default: 0,
    },
    incentiveTen3: {
      type: Number,
      default: 0,
    },
    incentiveTen4: {
      type: Number,
      default: 0,
    },
    incentiveTen5: {
      type: Number,
      default: 0,
    },
    customPackaging: {
      type: Number,
      default: 0,
    },
    deliveryDistance: {
      type: Number,
      default: 0,
    },
    customdistanceFee: {
      type: Number,
      default: 0,
    },
    insentive: {
      type: Number,
      default: 0,
    },
    maxInsentive: {
      type: Number,
      default: 0,
    },
    cashBackTime: {
      type: Number,
      default: 0,
    },
    currencyCode: {
      type: Number,
      default: 0,
    },
    currencyIcon: {
      type: String,
      default: '₹',
    },
    taxInPercent: {
      type: Number,
      default: 0,
    },
    supportEmail: {
      type: String,
    },
    supportPhone: {
      type: Number
    },
    deliveryFeePerKm: {
      type: Number,
      default: 0,
    },
    distanceMetric: {
      type: Number,
      default: 0,
    },
    referAmount: {
      type: Number,
      default: 0,
    },
    meetFish: {
      type: Number,
      default: 100
    },
    foodMeal: {
      type: Number,
      default: 100
    },
    pharmaMedicines: {
      type: Number,
      default: 100
    },
    petSupplies: {
      type: Number,
      default: 100
    },
    vegitablesFruit: {
      type: Number,
      default: 100
    },
    customDelivery: {
      type: Number,
      default: 100
    },


    availableStations: [
      {
        city: {
          type: String,
        },
        stationCode: {
          type: String,
          // unique: true,
        },
        lat: {
          type: String,
        },
        long: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();


    
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Admin = mongoose.model("Admin", AdminSchema);  

module.exports = Admin;
