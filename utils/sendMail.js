const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const messagebird = require("messagebird")("8lcdxqhx7W1HQcHdYpuYtKxqe");
// const hbs = require("nodemailer-express-handlebars");

const registrationMail = async (msg, to, sub) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "noreply@gravitybites.in",
      pass: "fbofwidpewraiqmh",
    },
  });
  return await transporter.sendMail({
    from: `"Gravity Bites" <gravitybites8.in@gmail.com>`, // sender address
    to: to, // list of receivers
    subject: sub, // Subject line
    text: "Test", // plain text body
    html: msg, // html body
  });
};
const sendMail = async (token, to, user) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "noreply@gravitybites.in",
      pass: "fbofwidpewraiqmh",
    },
  });
  return await transporter.sendMail({
    from: `"Gravity Bites" <gravitybites8.in@gmail.com>`, // sender address
    to: to, // list of receivers
    subject: "Password reset link", // Subject line
    text: "Test", // plain text body
    html: `Click on the following link to reset your password www.gravitybites.in/${user}/resetPassword/${token}`, // html body
  });
};

const sendNotice = async (to, message, sub) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "noreply@gravitybites.in",
      pass: "fbofwidpewraiqmh",
    },
  });
  return await transporter.sendMail({
    from: `"Gravity Bites" <gravitybites8.in@gmail.com>`, // sender address
    to: to, // list of receivers
    subject: sub, // Subject line
    text: "Test", // plain text body
    html: message, // html body
  });
};
// const sending = async (to) => {
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: "gravitybites8.in@gmail.com",
//       pass: "yidojmfsvgzkclac",
//     },
//   });
//   transporter.use(
//     "compile",
//     hbs({
//       viewEngine: "express-handlebars",
//       viewPath: "../views/",
//     })
//   );
//   return await transporter.sendMail({
//     from: `"Gravity Bites" <gravitybites8.in@gmail.com>`, // sender address
//     to: to, // list of receivers
//     subject: "Password reset link", // Subject line
//     text: "Test", // plain text body
//     attachments: [
//       {
//         filename: "Mongo.pdf",
//         path: "./Mongo.pdf",
//         contentType: "application/pdf",
//       },
//     ],
//     template: "index",
//     // html: `Click on the following link to reset your password www.gravitybites.in/resetPassword/`, // html body
//   });
// };

const successfullOrder = async (msg, to, time) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "noreply@gravitybites.in",
      pass: "fbofwidpewraiqmh",
    },
  });
  return await transporter.sendMail({
    from: `"Gravity Bites" <gravitybites8.in@gmail.com>`, // sender address
    to: to, // list of receivers
    subject: `Order Details - ${time} `, // Subject line
    text: "Test", // plain text body
    html: msg, // html body
  });
};
const forgetPassword = async (msg, to) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // user: "gravitybites8.in@gmail.com",
      // pass: "yidojmfsvgzkclac",
      user: "noreply@gravitybites.in",
      pass: "fbofwidpewraiqmh",
    },
  });
  return await transporter.sendMail({
    from: `"Gravity Bites" <gravitybites8.in@gmail.com>`, // sender address
    to: to, // list of receivers
    subject: `Reset Password Request`, // Subject line
    text: "Test", // plain text body
    html: `Use this code to reset your account password ${msg}`, // html body
  });
};

module.exports = {
  registrationMail,
  sendMail,
  successfullOrder,
  forgetPassword,
  sendNotice,
};
