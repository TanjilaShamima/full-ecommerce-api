// User Controller

const User = require("../models/userModel");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password", "otp", "otpExpiresAt"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMyDetails = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password", "otp", "otpExpiresAt"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (parseInt(userId) !== (req.user.userId || req.user.id)) {
      return res.status(403).json({ error: "You can only update your own profile" });
    }
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const updatableFields = ["fullName", "dateOfBirth", "gender", "mobile", "images"];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });
    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (parseInt(userId) !== (req.user.userId || req.user.id)) {
      return res.status(403).json({ error: "You can only delete your own account" });
    }
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "oldPassword and newPassword are required" });
    }
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: "Old password is incorrect" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUserById,
  getMyDetails,
  updateUserById,
  deleteUserById,
  updatePassword,
};
