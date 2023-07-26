
const Store = require('../models/Store')
const axios = require('axios')
exports.payout = async (req, res) => {  
    // const {paymentMethod UPi or bank} = req.body
    let token = req.headers.authorization.split(" ")[1];
    let storeid = jwt.verify(token, process.env.JWT_SECRET);
    if (!storeid) {
      return res.status(500).json({
        success: false,
        stationCode: 500,
        message: "Authentication Failed",
      });
    }
  const store = await Store.findById(storeid.id);
  if (store.contact_id === null) {
    await fetch('https://api.razorpay.com/v1/contacts', {
      headers: {
        'Authorization': 'Basic ' + btoa(process.env.RAZORPAY_USERNAME + ':' + process.env.RAZORPAY_PASSWORD)
      }
    })
      .then(response => {
        // Handle response here
      })
      .catch(error => {
        // Handle error here
      });
  }

    
    




}