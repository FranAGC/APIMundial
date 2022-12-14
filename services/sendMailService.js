var nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAILPASS
    }
  });
  


  class SendMail {

    constructor(){
    }


    enviarmail = (token, correo) => {
      var mailOptions = {
        from: process.env.EMAIL,
        to: correo,
        subject: 'API Mundial Qatar 2022',
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


