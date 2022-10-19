var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'frcontreras.78@hotmail.com',
      pass: 'PAXgDUURx2jwt5U'
    }
  });
  


  class SendMail {

    constructor(){
    }


    enviarmail = (token, correo) => {
      var mailOptions = {
        from: 'frcontreras.78@hotmail.com',
        to: correo,
        subject: 'Sending Email using Node.js',
        text: 'Tu token es: ' + token
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    }

}
module.exports = SendMail;


