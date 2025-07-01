const appConfig = require("../config/constant");

const verifyEmailTemplate = (email, name, otp) => {
  const emailData = {
    email: email,
    subject: "Email verification email",
    body: `
    <h2>Hello ${name},</h2>
    <p>Your otp is ${otp}.</p>
    <p>This otp will be expired within 10 minutes</p>
    `,
  };

  return emailData;
};

const resetPasswordEmailTemplate = (email, name, token) => {
  const emailData = {
    email: email,
    subject: "Reset Password",
    body: `
    <h2>Hello ${name},</h2>
    <p>Please click here to this<a href="${appConfig.appDomain}/api/v1/user/reset-password/${token}" target="_blank"> link </a> to reset your password.</p>
    `,
  };

  return emailData;
};

module.exports = {
  verifyEmailTemplate,
  resetPasswordEmailTemplate,
};
