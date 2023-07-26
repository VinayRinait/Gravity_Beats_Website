const nodemailer = require("nodemailer");

async function sendMail(userName, userEmail) {
  let transporter = nodemailer.createTransport({
    service: "gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "",
      pass: "",
    },
  });
  var mailOptions = {
    from: `gravitybites8.in@gmail.com`, // sender address
    to: userEmail, // list of receivers
    subject: "Email Confirmation - Registered!", // Subject line
    // text: "Test", // plain text body
    text: `Hey ${userName}, Thank You for registering with us`, // html body
  };
  return transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = { sendMail };
