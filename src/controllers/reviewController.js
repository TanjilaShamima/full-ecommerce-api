const Reviews = require("../models/reviewModel");
const createError = require("http-errors");
const { successResponse } = require("../services/response");

const addNewReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, rating, comment } = req.body;
    if (!productId || !rating) throw createError(400, "productId and rating are required");
    const review = await Reviews.create({ userId, productId, rating, comment });
    successResponse(res, {
      statusCode: 201,
      message: "Review created successfully",
      payload: { review },
    });
  } catch (error) {
    throw createError(error.status || 500, error.message || "Failed to add review");
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Reviews.findAll();
    successResponse(res, {
      statusCode: 200,
      message: "Reviews retrieved successfully",
      payload: { reviews },
    });
  } catch (error) {
    throw createError(error.status || 500, error.message || "Failed to get reviews");
  }
};

const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Reviews.findByPk(id);
    if (!review) throw createError(404, "Review not found");
    successResponse(res, {
      statusCode: 200,
      message: "Review retrieved successfully",
      payload: { review },
    });
  } catch (error) {
    throw createError(error.status || 500, error.message || "Failed to get review");
  }
};

const updateReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const review = await Reviews.findByPk(id);
    if (!review) throw createError(404, "Review not found");
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    await review.save();
    successResponse(res, {
      statusCode: 200,
      message: "Review updated successfully",
      payload: { review },
    });
  } catch (error) {
    throw createError(error.status || 500, error.message || "Failed to update review");
  }
};

const deleteReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Reviews.findByPk(id);
    if (!review) throw createError(404, "Review not found");
    await review.destroy();
    successResponse(res, {
      statusCode: 204,
      message: "Review deleted successfully",
    });
  } catch (error) {
    throw createError(error.status || 500, error.message || "Failed to delete review");
  }
};

module.exports = {
  addNewReview,
  getAllReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
};
