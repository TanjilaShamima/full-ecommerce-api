// Address Controller

const Address = require("../models/addressModel");
const User = require("../models/userModel");
const createError = require("http-errors");
const { successResponse } = require("../services/response");

const addressFields = [
  "addressLine1",
  "addressLine2",
  "city",
  "state",
  "postalCode",
  "country",
];

const getAllAddressesByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const addresses = await Address.findAll({ where: { userId } });
    return successResponse(res, {
      statusCode: 200,
      message: "Addresses loaded successfully",
      payload: { addresses },
    });
  } catch (err) {
    throw createError(500, err.message);
  }
};

const createAddressByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    if (parseInt(userId) !== (req.user.userId || req.user.id)) {
      throw createError(403, "You can only add addresses to your own account");
    }
    const addressData = {};
    addressFields.forEach((field) => {
      if (req.body[field] !== undefined) addressData[field] = req.body[field];
    });
    addressData.userId = userId;
    const address = await Address.create(addressData);
    return successResponse(res, {
      statusCode: 201,
      message: "Address created successfully",
      payload: { address },
    });
  } catch (err) {
    throw createError(400, err.message);
  }
};

const updateAddressByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const addressId = req.params.addressId;
    if (parseInt(userId) !== (req.user.userId || req.user.id)) {
      throw createError(403, "You can only update your own addresses");
    }
    const address = await Address.findOne({ where: { id: addressId, userId } });
    if (!address) throw createError(404, "Address not found");
    const addressData = {};
    addressFields.forEach((field) => {
      if (req.body[field] !== undefined) addressData[field] = req.body[field];
    });
    await address.update(addressData);
    return successResponse(res, {
      statusCode: 200,
      message: "Address updated successfully",
      payload: { address },
    });
  } catch (err) {
    throw createError(400, err.message);
  }
};

const deleteAddressByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const addressId = req.params.addressId;
    if (parseInt(userId) !== (req.user.userId || req.user.id)) {
      throw createError(403, "You can only delete your own addresses");
    }
    const address = await Address.findOne({ where: { id: addressId, userId } });
    if (!address) throw createError(404, "Address not found");
    await address.destroy();
    return successResponse(res, {
      statusCode: 200,
      message: "Address deleted successfully",
    });
  } catch (err) {
    throw createError(500, err.message);
  }
};

module.exports = {
  getAllAddressesByUserId,
  createAddressByUserId,
  deleteAddressByUserId,
  updateAddressByUserId,
};
