const User = require("../models/userModel");
const { Op } = require("sequelize");
const createError = require("http-errors");

const getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", role, status } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const where = {
      ...(search
        ? {
            [Op.or]: [
              { email: { [Op.iLike]: `%${search}%` } },
              { fullName: { [Op.iLike]: `%${search}%` } },
              { username: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : {}),
      ...(role ? { role } : {}),
      ...(status ? { status } : {}),
    };
    const { rows: users, count } = await User.findAndCountAll({
      where,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password", "otp", "otpExpiresAt"] },
    });
    res.status(200).json({
      users,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

const updateUsersRoleById = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.role = role;
    await user.save();
    res.status(200).json({ message: `User role updated for ID: ${userId}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user role" });
  }
};

const approvedUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.requestRoleId)
      return res.status(400).json({ error: "No requested role to approve" });
    user.roleId = user.requestRoleId;
    user.requestRoleId = null;
    await user.save();
    res.status(200).json({ message: `User role approved for ID: ${userId}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to approve user role" });
  }
};

const getAllRoleRequests = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const where = {
      role: 'artisan',
      status: 'pending',
      ...(search
        ? {
            [Op.or]: [
              { email: { [Op.iLike]: `%${search}%` } },
              { fullName: { [Op.iLike]: `%${search}%` } },
              { username: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : {}),
    };
    const { rows: users, count } = await User.findAndCountAll({
      where,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password", "otp", "otpExpiresAt"] },
    });
    res.status(200).json({
      users,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve role requests" });
  }
};

module.exports = {
  getAllUsers,
  updateUsersRoleById,
  approvedUserRole,
  getAllRoleRequests,
};
