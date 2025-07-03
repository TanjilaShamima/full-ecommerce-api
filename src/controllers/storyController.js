const {
  removeAllSizesImage,
  processUploadedImage,
} = require("../middlewares/upload");
const Story = require("../models/storyModel");
const { successResponse } = require("../services/response");
const createError = require("http-errors");

const createStory = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const userId = req.user.id;

    let images = [];
    if (req.files && req.files.length > 0) {
      if (req.files.length < 1 || req.files.length > 5) {
        throw createError(400, "You can upload between 1 and 5 images.");
      }
      for (const file of req.files) {
        const imageUrl = await processUploadedImage(
          file.buffer,
          file.originalname
        );
        images.push({ url: imageUrl });
      }
    }

    const newStory = await Story.create({
      title,
      content,
      userId,
      tags,
      images: images.length > 0 ? images : null,
    });
    successResponse(res, {
      statusCode: 201,
      message: "Story created successfully",
      payload: { story: newStory },
    });
  } catch (error) {
    throw createError(
      error.status || 500,
      error.message || "Failed to create story"
    );
  }
};

const getAllStories = async (req, res) => {
  try {
    const stories = await Story.findAll({
      include: [{ model: User, as: "user", attributes: ["id", "username"] }],
    });
    res.status(200).json(stories);
    successResponse(res, {
      statusCode: 200,
      message: "Stories retrieved successfully",
      payload: { stories },
    });
  } catch (error) {
    throw createError(
      error.status || 500,
      error.message || "Failed to retrieve stories"
    );
  }
};

const getStoryById = async (req, res) => {
  try {
    const storyId = req.params.id;
    const story = await Story.findByPk(storyId, {
      include: [{ model: User, as: "user", attributes: ["id", "username"] }],
    });

    if (!story) {
      throw createError(404, "Story not found");
    }
    successResponse(res, {
      statusCode: 200,
      message: "Story retrieved successfully",
      payload: { story },
    });
  } catch (error) {
    throw createError(
      error.status || 500,
      error.message || "Failed to retrieve story"
    );
  }
};

const updateStory = async (req, res) => {
  try {
    const storyId = req.params.id;
    const { title, content } = req.body;

    const story = await Story.findByPk(storyId);
    if (!story) {
      throw createError(404, "Story not found");
    }
    if (req.files && req.files.length > 0) {
      // Remove old images from S3 if new images are uploaded
      if (story.images && story.images.length > 0) {
        for (const img of story.images) {
          removeAllSizesImage(img.url || img);
        }
      }
      // Process new images
      const newImages = [];
      for (const file of req.files.slice(0, 3)) {
        const imageUrl = await processUploadedImage(
          file.buffer,
          file.originalname
        );
        newImages.push({ url: imageUrl });
      }
      story.images = newImages;
    }

    story.title = title;
    story.content = content;
    await story.save();

    successResponse(res, {
      statusCode: 200,
      message: "Story updated successfully",
      payload: { story },
    });
  } catch (error) {
    throw createError(
      error.status || 500,
      error.message || "Failed to update story"
    );
  }
};

const deleteStory = async (req, res) => {
  try {
    const storyId = req.params.id;

    const story = await Story.findByPk(storyId);
    if (!story) {
      throw createError(404, "Story not found");
    }

    if (story.images && story.images.length > 0) {
      // Assuming removeAllSizesImageFromS3 is a function that deletes images from S3
      for (const img of story.images) {
        removeAllSizesImage(img.url || img);
      }
    }

    await story.destroy();
    successResponse(res, {
      statusCode: 204,
      message: "Story deleted successfully",
    });
  } catch (error) {
    throw createError(
      error.status || 500,
      error.message || "Failed to delete story"
    );
  }
};

module.exports = {
  createStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
};
