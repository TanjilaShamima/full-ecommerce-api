const Story = require("../models/storyModel");

const createStory = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const userId = req.user.id;

    const newStory = await Story.create({ title, content, userId, tags });
    res.status(201).json(newStory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllStories = async (req, res) => {
  try {
    const stories = await Story.findAll({
      include: [{ model: User, as: "user", attributes: ["id", "username"] }],
    });
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStoryById = async (req, res) => {
  try {
    const storyId = req.params.id;
    const story = await Story.findByPk(storyId, {
      include: [{ model: User, as: "user", attributes: ["id", "username"] }],
    });

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStory = async (req, res) => {
  try {
    const storyId = req.params.id;
    const { title, content } = req.body;

    const story = await Story.findByPk(storyId);
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    story.title = title;
    story.content = content;
    await story.save();

    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStory = async (req, res) => {
  try {
    const storyId = req.params.id;

    const story = await Story.findByPk(storyId);
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    await story.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
};
