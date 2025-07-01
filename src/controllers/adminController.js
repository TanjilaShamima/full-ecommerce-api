const User = require("../models/userModel");
const Role = require("../models/roleModel");
const { Op } = require("sequelize");
const createError = require("http-errors");

const getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const where = search
      ? {
          [Op.or]: [
            { email: { [Op.iLike]: `%${search}%` } },
            { fullName: { [Op.iLike]: `%${search}%` } },
            { username: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const { rows: users, count } = await User.findAndCountAll({
      where,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password", "otp", "otpExpiresAt"] },
      include: [
        { model: Role, as: "role", attributes: ["roleName", "permissions"] },
        {
          model: Role,
          as: "requestRole",
          attributes: ["roleName", "permissions"],
        },
      ],
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
    const { role: permissions } = req.body;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const role = await Role.findOne({ where: { roleName: permissions } });
    if (!role) return res.status(400).json({ error: "Role not found" });
    user.roleId = role.id;
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
      requestRoleId: { [Op.not]: null },
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
      include: [
        { model: Role, as: "role", attributes: ["roleName", "permissions"] },
        {
          model: Role,
          as: "requestRole",
          attributes: ["roleName", "permissions"],
        },
      ],
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
