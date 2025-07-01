// Auth Controller

const User = require("../models/userModel");
const Role = require("../models/roleModel");
const { Op } = require("sequelize");
const createError = require("http-errors");
const { successResponse } = require("../services/response");
const { verifyEmailTemplate } = require("../utils/emailTemplate");
const { sendWithNodemailer } = require("../services/emailServices");
const { createJsonWebToken } = require("../services/jsonWebToken");
const appConfig = require("../config/constant");

const registerUser = async (req, res) => {
  try {
    const {
      email,
      fullName,
      mobile,
      password,
      requestRole: requestRoleName,
    } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { mobile }] },
    });
    if (existingUser) {
      throw createError(400, "User with this email or mobile already exists");
    }
    // Find the 'customer' role for default
    const customerRole = await Role.findOne({
      where: { permissions: "customer" },
    });
    if (!customerRole) {
      throw createError(500, "Default customer role not found in Roles table");
    }
    let requestRoleId = null;
    if (requestRoleName) {
      const reqRole = await Role.findOne({
        where: { permissions: requestRoleName },
      });
      if (!reqRole) {
        throw createError(400, "Requested role does not exist");
      }
      requestRoleId = reqRole.id;
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
      status: true,
      roleId: customerRole.id,
      requestRoleId,
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
  // Implement login logic here
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
    user.status = true;
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
  // Implement password reset logic here
};

const resetPass = async (req, res) => {
  // Implement password reset logic here
};
const loginGoogle = async (req, res) => {
  try {
    // req.user is set by passport after successful Google OAuth
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Google authentication failed" });
    }
    // Issue JWT
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.roleId,
      fullName: user.fullName,
      googleId: user.googleId,
    };
    const token = createJsonWebToken(
      payload,
      appConfig.jwt.accessKey.privateKey,
      "1d"
    );
    return res.status(200).json({
      message: "Google login successful",
      token,
      user: payload,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const loginMobile = async (req, res) => {
  // Implement mobile login logic here
};

const logout = async (req, res) => {
  // Implement logout logic here
};

const registerUserWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    // Here you would verify the Google token and extract user info
    // For demonstration, let's assume you have a function verifyGoogleToken(token)
    // const googleUser = await verifyGoogleToken(token);
    // Example mock:
    const googleUser = {
      email: "googleuser@example.com",
      fullName: "Google User",
      googleId: "google-id-123",
      images: "https://example.com/photo.jpg",
    };
    // Check if user already exists
    let user = await User.findOne({ where: { email: googleUser.email } });
    if (!user) {
      user = await User.create({
        email: googleUser.email,
        fullName: googleUser.fullName,
        googleId: googleUser.googleId,
        images: googleUser.images,
        username: googleUser.email.split("@")[0],
        status: true,
      });
    }
    res
      .status(201)
      .json({ message: "User registered with Google successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
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
  registerUserWithGoogle,
};
