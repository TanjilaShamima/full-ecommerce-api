const nodemailer = require("nodemailer");
const appConfig = require("../config/constant");

const transporter = nodemailer.createTransport({
  host: appConfig.email.host,
  port: appConfig.email.port,
  secure: false,
  auth: {
    user: appConfig.email.userName,
    pass: appConfig.email.password,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendWithNodemailer = async (emailData) => {
  try {
    const mailOptions = {
      from: "tanjila.cse.diu@gmail.com",
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.body,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent", info.response);
  } catch (error) {
    console.error("Error happened sending email", error);
    throw new Error(error);
  }
};

module.exports = {
    sendWithNodemailer
}
