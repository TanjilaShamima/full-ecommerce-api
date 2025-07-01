// Artisan Profile Controller

const ArtisanProfile = require("../models/artisanProfileModel");

const getArtisanById = async (req, res) => {
  // Implement logic to get artisan profile by ID
}; 

const updateArtisanById = async (req, res) => {
  // Implement logic to update artisan profile by ID
};

const createArtisanProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const artisanProfile = await ArtisanProfile.create({
      ...req.body,
      userId,
    });
    res.status(201).json(artisanProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getArtisanById,
  updateArtisanById,
  createArtisanProfile,
};
