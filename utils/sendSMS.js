const twilio = require("twilio");
const accountSid = "AC738b984c278833aad29daabf9c84b676";
const authtoken = "1d3b7048fc6ba3789014b87b6a657f9d";
const messagebird = require("messagebird")("8lcdxqhx7W1HQcHdYpuYtKxqe");

const sendSMS = async (msg, userPhone) => {
  try {
    const client = new twilio(accountSid, authtoken);
    await client.messages.create({
      body: ` ${msg} `,
      from: "+19206575386",
      to: userPhone,
    });
    console.log("SMS sent");
  } catch (error) {
    console.log(error);
  }
};

const sendOTP = (number, otp) => {
  var params = {
    originator: "Your Brand",
    recipients: [`+91${number}`],
    body: `OTP for login verification is ${otp}`,
  };

  messagebird.messages.create(params, function (err, response) {
    if (err) {
      return console.log(err);
    }
  });
};

const verifySMS = (msg, number) => {
  var params = {
    originator: "Your Brand",
    recipients: [`+91${number}`],
    body: msg,
  };

  messagebird.messages.create(params, function (err, response) {
    if (err) {
      return console.log(err);
    }
  });
};

module.exports = { sendSMS, sendOTP, verifySMS };
