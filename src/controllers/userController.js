// User Controller

const User = require("../models/userModel");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const { successResponse } = require("../services/response");
const {
  removeAllSizesImageFromS3,
  processUploadedImagesToS3,
} = require("../middlewares/upload");
const logger = require("../utils/logger");

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password", "otp", "otpExpiresAt"] },
    });
    if (!user) throw createError(404, "User not found");
    return successResponse(res, {
      statusCode: 200,
      message: "User loaded successfully",
      payload: { user },
    });
  } catch (err) {
    throw createError(500, err.message);
  }
};

const getMyDetails = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password", "otp", "otpExpiresAt"] },
    });
    if (!user) throw createError(404, "User not found");
    return successResponse(res, {
      statusCode: 200,
      message: "My details loaded successfully",
      payload: { user },
    });
  } catch (err) {
    throw createError(500, err.message);
  }
};

const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (parseInt(userId) !== (req.user.userId || req.user.id)) {
      throw createError(403, "You can only update your own profile");
    }
    const user = await User.findByPk(userId);
    if (!user) throw createError(404, "User not found");
    // Only update provided fields
    const updatableFields = ["fullName", "dateOfBirth", "gender", "mobile"];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
      else user[field] = user[field];
    });
    // Handle image upload (S3)
    if (req.file) {
      logger.info("req.file", req.file);
      if (user.image) {
        await removeAllSizesImageFromS3(user.image);
      }
      user.image = await processUploadedImagesToS3(
        req.file.buffer,
        req.file.originalname
      );
    }
    await user.save();
    return successResponse(res, {
      statusCode: 200,
      message: "User updated successfully",
      payload: { user },
    });
  } catch (err) {
    throw createError(500, err.message);
  }
};

const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (parseInt(userId) !== (req.user.userId || req.user.id)) {
      throw createError(403, "You can only delete your own account");
    }
    const user = await User.findByPk(userId);
    if (!user) throw createError(404, "User not found");
    await user.destroy();
    return successResponse(res, {
      statusCode: 200,
      message: "User deleted successfully",
    });
  } catch (err) {
    throw createError(500, err.message);
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw createError(400, "oldPassword and newPassword are required");
    }
    const user = await User.findByPk(userId);
    if (!user) throw createError(404, "User not found");
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw createError(401, "Old password is incorrect");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    return successResponse(res, {
      statusCode: 200,
      message: "Password updated successfully",
    });
  } catch (err) {
    throw createError(500, err.message);
  }
};

module.exports = {
  getUserById,
  getMyDetails,
  updateUserById,
  deleteUserById,
  updatePassword,
};
