// Artisan Profile Controller

const ArtisanProfile = require("../models/artisanProfileModel");
const createError = require("http-errors");
const { successResponse } = require("../services/response");

const getArtisanById = async (req, res) => {
  try {
    const userId = req.params.id;
    const artisanProfile = await ArtisanProfile.findOne({ where: { userId } });
    if (!artisanProfile) throw createError(404, "Artisan profile not found");
    return successResponse(res, {
      statusCode: 200,
      message: "Artisan profile loaded successfully",
      payload: { artisanProfile },
    });
  } catch (err) {
    throw createError(500, err.message);
  }
};

const updateArtisanById = async (req, res) => {
  try {
    const userId = req.params.id;
    const artisanProfile = await ArtisanProfile.findOne({ where: { userId } });
    if (!artisanProfile) throw createError(404, "Artisan profile not found");
    await artisanProfile.update(req.body);
    return successResponse(res, {
      statusCode: 200,
      message: "Artisan profile updated successfully",
      payload: { artisanProfile },
    });
  } catch (err) {
    throw createError(400, err.message);
  }
};

const createArtisanProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const artisanProfile = await ArtisanProfile.create({
      ...req.body,
      userId,
    });
    return successResponse(res, {
      statusCode: 201,
      message: "Artisan profile created successfully",
      payload: { artisanProfile },
    });
  } catch (err) {
    throw createError(400, err.message);
  }
};

module.exports = {
  getArtisanById,
  updateArtisanById,
  createArtisanProfile,
};
