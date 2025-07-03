const Product = require("../models/productModel");
const { successResponse } = require("../services/response");
const createError = require("http-errors");
const { processUploadedImage } = require("../middlewares/upload");
const { Op } = require("sequelize");
const User = require("../models/userModel");
const ArtisanProfile = require("../models/artisanProfileModel");

const addNewProduct = async (req, res) => {
  const userId = req.user.userId || req.user.id;
  if (!userId) {
    throw createError(401, "Unauthorized: User ID not found");
  }
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      tags,
      material,
      dimensions,
      color,
      size,
    } = req.body;

    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files.slice(0, 5)) {
        const imageUrl = await processUploadedImage(
          file.buffer,
          file.originalname
        );
        images.push(imageUrl);
      }
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: images.length > 0 ? images : null,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      material,
      dimensions: dimensions ? JSON.parse(dimensions) : null,
      color,
      size,
      userId, // Associate product with the user
    });
    successResponse(res, {
      statusCode: 201,
      message: "Product created successfully",
      payload: { product: newProduct },
    });
  } catch (error) {
    throw createError(
      error.status || 500,
      error.message || "Failed to add product"
    );
  }
};

const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      name,
      userId,
      artisanName,
      tags,
      minPrice,
      maxPrice,
    } = req.query;

    const where = {};
    if (category) where.category = category;
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (userId) where.userId = userId;
    if (tags)
      where.tags = { [Op.overlap]: Array.isArray(tags) ? tags : [tags] };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    // Join with User/ArtisanProfile for artisanName filter
    const include = [];
    if (artisanName) {
      include.push({
        model: User,
        as: "user",
        include: [
          {
            model: ArtisanProfile,
            as: "artisanProfile",
            where: { name: { [Op.iLike]: `%${artisanName}%` } },
            required: true,
          },
        ],
        required: true,
      });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include,
      offset,
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    successResponse(res, {
      statusCode: 200,
      message: "Products retrieved successfully",
      payload: {
        products,
      },
      meta: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
        prev: parseInt(page) > 1 ? parseInt(page) - 1 : null,
        next: count > offset + parseInt(limit) ? parseInt(page) + 1 : null,
      },
    });
  } catch (error) {
    throw createError(
      error.status || 500,
      error.message || "Failed to retrieve products"
    );
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if (!product) {
      throw createError(404, "Product not found");
    }
    successResponse(res, {
      statusCode: 200,
      message: "Product retrieved successfully",
      payload: { product },
    });
  } catch (error) {
    throw createError(
      error.status || 500,
      error.message || "Failed to retrieve product"
    );
  }
};

const updateProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      name,
      description,
      price,
      category,
      stock,
      tags,
      material,
      dimensions,
      color,
      size,
    } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) {
      throw createError(404, "Product not found");
    }
    if (req.files && req.files.length > 0) {
      let images = [];
      for (const file of req.files.slice(0, 5)) {
        const imageUrl = await processUploadedImage(
          file.buffer,
          file.originalname
        );
        images.push(imageUrl);
      }
      product.images = images;
    }
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (tags !== undefined) product.tags = tags;
    if (material !== undefined) product.material = material;
    if (dimensions !== undefined) product.dimensions = JSON.parse(dimensions);
    if (color !== undefined) product.color = color;
    if (size !== undefined) product.size = size;
    await product.save();
    successResponse(res, {
      statusCode: 200,
      message: "Product updated successfully",
      payload: { product },
    });
  } catch (error) {
    throw createError(
      error.status || 500,
      error.message || "Failed to update product"
    );
  }
};

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if (!product) {
      throw createError(404, "Product not found");
    }
    await product.destroy();
    successResponse(res, {
      statusCode: 204,
      message: "Product deleted successfully",
    });
  } catch (error) {
    throw createError(
      error.status || 500,
      error.message || "Failed to delete product"
    );
  }
};

module.exports = {
  addNewProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
