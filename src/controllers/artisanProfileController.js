// Artisan Profile Controller

const ArtisanProfile = require("../models/artisanProfileModel");
const createError = require("http-errors");
const { successResponse } = require("../services/response");
const { processUploadedImagesToS3, removeAllSizesImageFromS3 } = require("../middlewares/upload");
const User = require("../models/userModel");

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
    // Validate productType
    const allowedProductTypes = ["pottery", "textile", "jewelry", "woodwork", "painting", "other"];
    if (req.body.productType && !allowedProductTypes.includes(req.body.productType)) {
      throw createError(400, "Invalid productType");
    }
    // Remove old images from S3 if new images are uploaded
    let images = artisanProfile.images || [];
    if (req.files && req.files.length > 0) {
      if (images.length > 0 && typeof removeAllSizesImageFromS3 === 'function') {
        for (const img of images) {
          await removeAllSizesImageFromS3(img.url || img);
        }
      }
      images = [];
      for (const file of req.files.slice(0, 3)) {
        const imageUrl = await processUploadedImagesToS3(file.buffer, file.originalname);
        images.push({ url: imageUrl });
      }
    }
    // Update all fields
    const updatableFields = ["name", "tagLine", "district", "city", "productType", "socialMedia", "about"];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) artisanProfile[field] = req.body[field];
    });
    if (req.files && req.files.length > 0) {
      artisanProfile.images = images;
    }
    await artisanProfile.save();
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
    // productType as enum (dropdown)
    const allowedProductTypes = ["pottery", "textile", "jewelry", "woodwork", "painting", "other"];
    if (req.body.productType && !allowedProductTypes.includes(req.body.productType)) {
      throw createError(400, "Invalid productType");
    }
    // Handle up to 3 images upload to S3
    let images = [];
    if (req.files && req.files.length > 0) {
      // Assume processUploadedImagesToS3 returns the S3 url for each file
      for (const file of req.files.slice(0, 3)) {
        const imageUrl = await processUploadedImagesToS3(file.buffer, file.originalname);
        images.push({ url: imageUrl });
      }
    }
    const artisanProfile = await ArtisanProfile.create({
      ...req.body,
      userId,
      images: images.length > 0 ? images : null,
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

const getAllArtisans = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", status } = req.query;
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
      role: "artisan",
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

module.exports = {
  getArtisanById,
  updateArtisanById,
  createArtisanProfile,
  getAllArtisans
};
