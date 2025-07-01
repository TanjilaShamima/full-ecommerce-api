// Address Controller

const Address = require("../models/addressModel");
const User = require("../models/userModel");
const createError = require("http-errors");

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
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAddressByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    if (parseInt(userId) !== (req.user.userId || req.user.id)) {
      return res.status(403).json({ error: "You can only add addresses to your own account" });
    }
    const addressData = {};
    addressFields.forEach((field) => {
      if (req.body[field] !== undefined) addressData[field] = req.body[field];
    });
    addressData.userId = userId;
    const address = await Address.create(addressData);
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateAddressByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const addressId = req.params.addressId;
    if (parseInt(userId) !== (req.user.userId || req.user.id)) {
      return res.status(403).json({ error: "You can only update your own addresses" });
    }
    const address = await Address.findOne({ where: { id: addressId, userId } });
    if (!address) return res.status(404).json({ error: "Address not found" });
    const addressData = {};
    addressFields.forEach((field) => {
      if (req.body[field] !== undefined) addressData[field] = req.body[field];
    });
    await address.update(addressData);
    res.status(200).json(address);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteAddressByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const addressId = req.params.addressId;
    if (parseInt(userId) !== (req.user.userId || req.user.id)) {
      return res.status(403).json({ error: "You can only delete your own addresses" });
    }
    const address = await Address.findOne({ where: { id: addressId, userId } });
    if (!address) return res.status(404).json({ error: "Address not found" });
    await address.destroy();
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllAddressesByUserId,
  createAddressByUserId,
  deleteAddressByUserId,
  updateAddressByUserId,
};
