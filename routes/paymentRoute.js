const PaytmChecksum  = require("./PaytmChecksum");

const router = require("express").Router();

const MERCHANT_KEY = "your_merchant_key_here";
const CALLBACK_URL = "http://localhost:8080/payment/paytm/callback";

router.post("/paytm/initiate-payment", (req, res) => {
  const { amount } = req.body;
  const orderId = `ORDER_${new Date().getTime()}`;

  //   PAYTM_MID= GRAVIT79418918817630
  // PAYTM_MERCHANT_KEY = KWdUxFiLL&lLPxgW
  // PAYTM_WEBSITE = DEFAULT
  // PAYTM_INDUSTRY_TYPE= ECommerce
  // PAYTM_CHANNEL_ID= WEB
  // PAYTM_ENV= securegw.paytm.in
  const params = {};
  params["MID"] = process.env.PAYTM_MID;
  params["WEBSITE"] = process.env.PAYTM_WEBSITE;
  params["CHANNEL_ID"] = process.env.PAYTM_CHANNEL_ID;
  params["INDUSTRY_TYPE_ID"] = process.env.INDUSTRY_TYPE;
  params["ORDER_ID"] = orderId;
  params["CUST_ID"] = "JKHYRTGHVHFGFGtg6567";
  params["TXN_AMOUNT"] = amount;
  params["CALLBACK_URL"] = CALLBACK_URL;
  params["EMAIL"] = "imohammedakash@gmail.com";
  params["MOBILE_NO"] = "7029793127";

  PaytmChecksum.generateSignature(
    JSON.stringify(params),
    process.env.MERCHANT_KEY,
    (err, checksum) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      const paytmParams = {
        ...params,
        CHECKSUMHASH: checksum,
      };
      res.json(paytmParams);
    }
  );
});

router.post("/paytm/callback", (req, res) => {
  const body = req.body;
  const checksumhash = body.CHECKSUMHASH;
  const orderId = body.ORDERID;
  const result = PaytmChecksum.verifychecksum(body, MERCHANT_KEY, checksumhash);

  if (result) {
    res.json({ message: "Payment successful" });
  } else {
    res.json({ message: "Payment failed" });
  }
});

module.exports = router;
