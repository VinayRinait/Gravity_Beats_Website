var messagebird = require("messagebird")('Y8hQPBlWYS3YMb4BiFlHpQhpf');
const sendSMS = (reciever, body) => {
  var params = {
    originator: "GRAVIBITES",
    recipients: [`+91${reciever}`],
    body: body,
  };
  messagebird.messages.create(params, function (err, response) {
    if (err) {
      return console.log(err);
    }
    console.log(response);
  });
};

module.exports = sendSMS
