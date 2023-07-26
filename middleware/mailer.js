const nodemailer = require("nodemailer");
// var smtpTransport = require('nodemailer-smtp-transport');
const mailer = (userEmail, subject, mailingMessage) => {
  const config = {
    // service: process.env.MAIL_SERVICE,
    // port: process.env.MAIL_PORT,
    // secure: true,
    // auth: {
    //   user: process.env.MAILER_USER,
    //   pass: process.env.MAILER_PASS,
    // }

    service: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: {
      user: "noreply@gravitybites.in",
      pass: "3CwpSxcPrdYQ",
    },
    tls: {
      rejectUnAuthorized: true,
    },
  };

  let transporter = nodemailer.createTransport(config);
  let message = {
    from: process.env.MAIL_USER,
    to: userEmail,
    subject: subject,
    html: mailingMessage,
  };
  transporter.sendMail(message, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: " + response);
    }
  });
};

module.exports = mailer;
