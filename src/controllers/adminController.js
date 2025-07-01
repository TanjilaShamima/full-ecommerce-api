const User = require("../models/userModel");
const { Op } = require("sequelize");
const createError = require("http-errors");
const { successResponse } = require("../services/response");

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
    return successResponse(res, {
      statusCode: 200,
      message: "Users loaded successfully",
      payload: {
        users,
      },
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        prev: page > 1 ? page - 1 : null,
        next: count > offset + limit ? page + 1 : null,
      },
    });
  } catch (error) {
    throw createError(500, "Failed to retrieve users");
  }
};

const updateUsersRoleById = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    const user = await User.findByPk(userId);
    if (!user) throw createError(404, "User not found");
    user.role = role;
    await user.save();
    return successResponse(res, {
      statusCode: 200,
      message: `User role updated for ID: ${userId}`,
    });
  } catch (error) {
    throw createError(500, "Failed to update user role");
  }
};

const approvedUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) throw createError(404, "User not found");
    if (!user.requestRole)
      throw createError(400, "No requested role to approve");
    user.role = user.requestRole;
    user.requestRole = null;
    user.status = user.role === "artisan" ? "pending" : "active";
    await user.save();
    return successResponse(res, {
      statusCode: 200,
      message: `User role approved for ID: ${userId}`,
    });
  } catch (error) {
    throw createError(500, "Failed to approve user role");
  }
};

const getAllRoleRequests = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const where = {
      role: "artisan",
      status: "pending",
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
    return successResponse(res, {
      statusCode: 200,
      message: "Role requests loaded successfully",
      payload: {
        users,
      },
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    throw createError(500, "Failed to retrieve role requests");
  }
};

module.exports = {
  getAllUsers,
  updateUsersRoleById,
  approvedUserRole,
  getAllRoleRequests,
};
