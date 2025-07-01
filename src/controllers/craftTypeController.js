const CraftType = require("../models/craftTypeModel");

const createNewCraft = async (req, res) => {
  try {
    const craft = await CraftType.create({
      name: req.body.name,
      description: req.body.description,
    });
    res.status(201).json(craft);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateCraftById = async (req, res) => {
  try {
    const [updated] = await CraftType.update(
      {
        name: req.body.name,
        description: req.body.description,
      },
      { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ error: "Craft type not found" });
    const craft = await CraftType.findByPk(req.params.id);
    res.status(200).json(craft);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteCraftById = async (req, res) => {
  try {
    const deleted = await CraftType.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Craft type not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllCraft = async (req, res) => {
  try {
    const crafts = await CraftType.findAll();
    res.status(200).json(crafts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCraftById = async (req, res) => {
  try {
    const craft = await CraftType.findByPk(req.params.id);
    if (!craft) return res.status(404).json({ error: "Craft type not found" });
    res.status(200).json(craft);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createNewCraft,
  updateCraftById,
  deleteCraftById,
  getAllCraft,
  getCraftById,
};
