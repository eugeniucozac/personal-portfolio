const nodemailer = require("nodemailer");
const {EMAIL_USERNAME, EMAIL_PASSWORD} = require("../config/passwords");

let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,  
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
      }  
      /*  
      tls: {
          rejectUnauthorized: false
      } */
});

let sendMail = (mailOptions)=>{
  transporter.sendMail(mailOptions, (error, info) => {});
};

module.exports = sendMail;