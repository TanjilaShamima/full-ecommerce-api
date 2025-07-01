// Auth Controller

const User = require("../models/userModel");
const { Op } = require("sequelize");
const createError = require("http-errors");
const { successResponse } = require("../services/response");
const {
  verifyEmailTemplate,
  resetPasswordEmailTemplate,
} = require("../utils/emailTemplate");
const { sendWithNodemailer } = require("../services/emailServices");
const {
  createJsonWebToken,
  verifyJsonWebToken,
} = require("../services/jsonWebToken");
const appConfig = require("../config/constant");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const {
      email,
      fullName,
      mobile,
      password,
      role
    } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { mobile }] },
    });
    if (existingUser) {
      throw createError(400, "User with this email or mobile already exists");
    }

    // otp generate
    const otp = Math.floor(1000000 + Math.random() * 9000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    // Create username from email prefix if not provided
    const username = email.split("@")[0];

    const user = await User.create({
      email,
      fullName,
      mobile,
      password,
      username,
      status: role ? "pending" : "active",
      role: role ? role : 'customer',
      otp,
      otpExpiresAt,
    });
    const emailData = verifyEmailTemplate(email, fullName, otp);
    await sendWithNodemailer(emailData);
    successResponse(res, {
      statusCode: 201,
      message:
        "User registered successfully. One otp is send to user mail. Please verify!",
      payload: user,
    });
  } catch (err) {
    throw createError(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw createError(400, "Email and password are required");
    const foundUser = await User.findOne({ where: { email } });
    if (!foundUser) throw createError(401, "Invalid email or password");
    if (!foundUser.verifiedAt) throw createError(403, "Please verify your email before logging in");
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) throw createError(401, "Invalid email or password");
    const payload = {
      userId: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
      fullName: foundUser.fullName,
      googleId: foundUser.googleId,
    };
    const token = createJsonWebToken(
      payload,
      appConfig.jwt.accessKey.privateKey,
      "1d"
    );
    return successResponse(res, {
      statusCode: 200,
      message: "Login successful",
      payload: {
        ...foundUser.dataValues,
        token
      }
    });
  } catch (err) {
    throw createError(err.status || 500, err.message);
  }
};

const verifyUser = async (req, res) => {
  try {
    const { otp } = req.body;
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      throw createError(404, "User not found");
    }
    if (user.otp !== otp) {
      throw createError(400, "Invalid OTP");
    }
    if (user.otpExpiresAt < new Date()) {
      throw createError(400, "OTP expired");
    }
    user.otp = null;
    user.otpExpiresAt = null;
    user.verifiedAt = new Date();
    await user.save();
    successResponse(res, {
      statusCode: 200,
      message: "User verified successfully",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const forgetPass = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) throw createError(400, "Email is required");
    const user = await User.findOne({ where: { email } });
    if (!user) throw createError(404, "User with this email does not exist");
    // Create reset token (JWT, expires in 15 min)
    const token = createJsonWebToken(
      { userId: user.id, email: user.email },
      appConfig.jwt.accessKey.privateKey,
      "15m"
    );
    // Send email
    const emailData = resetPasswordEmailTemplate(user.email, user.fullName || user.username, token);
    await sendWithNodemailer(emailData);
    return successResponse(res, {
      statusCode: 200,
      message: "Password reset email sent. Please check your inbox.",
    });
  } catch (err) {
    throw createError(err.status || 500, err.message);
  }
};

const resetPass = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) throw createError(400, "Token and newPassword are required");
    let decoded;
    try {
      decoded = verifyJsonWebToken(token, appConfig.jwt.accessKey.publicKey);
    } catch (err) {
      throw createError(400, "Invalid or expired reset token");
    }
    const user = await User.findByPk(decoded.userId);
    if (!user) throw createError(404, "User not found");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    return successResponse(res, {
      statusCode: 200,
      message: "Password reset successful. You can now log in with your new password.",
    });
  } catch (err) {
    throw createError(err.status || 500, err.message);
  }
};

const loginGoogle = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw createError(401, "Google authentication failed");
    }
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      googleId: user.googleId,
    };
    const token = createJsonWebToken(
      payload,
      appConfig.jwt.accessKey.privateKey,
      "1d"
    );
    return successResponse(res, {
      statusCode: 200,
      message: "Google login successful",
      payload: {
        ...user,
        token
      }
    });
  } catch (err) {
    throw createError(500, err.message);
  }
};
const loginMobile = async (req, res) => {
  // Implement mobile login logic here
};

const logout = async (req, res) => {
  try {
    // Implement logout logic here (stateless JWT, so just respond OK)
    return successResponse(res, {
      statusCode: 200,
      message: "Logout successful",
    });
  } catch (err) {
    throw createError(500, err.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  forgetPass,
  resetPass,
  loginGoogle,
  loginMobile,
  logout,
};
