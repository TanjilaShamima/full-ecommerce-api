const CraftType = require("../models/craftTypeModel");
const createError = require("http-errors");
const { successResponse } = require("../services/response");

const createNewCraft = async (req, res) => {
  try {
    const craft = await CraftType.create({
      name: req.body.name,
      description: req.body.description,
    });
    return successResponse(res, {
      statusCode: 201,
      message: "Craft type created successfully",
      payload: { craft },
    });
  } catch (err) {
    throw createError(400, err.message);
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
    if (!updated) throw createError(404, "Craft type not found");
    const craft = await CraftType.findByPk(req.params.id);
    return successResponse(res, {
      statusCode: 200,
      message: "Craft type updated successfully",
      payload: { craft },
    });
  } catch (err) {
    throw createError(400, err.message);
  }
};

const deleteCraftById = async (req, res) => {
  try {
    const deleted = await CraftType.destroy({ where: { id: req.params.id } });
    if (!deleted) throw createError(404, "Craft type not found");
    return successResponse(res, {
      statusCode: 200,
      message: "Craft type deleted successfully",
    });
  } catch (err) {
    throw createError(500, err.message);
  }
};

const getAllCraft = async (req, res) => {
  try {
    const crafts = await CraftType.findAll();
    return successResponse(res, {
      statusCode: 200,
      message: "Craft types loaded successfully",
      payload: { crafts },
    });
  } catch (err) {
    throw createError(500, err.message);
  }
};

const getCraftById = async (req, res) => {
  try {
    const craft = await CraftType.findByPk(req.params.id);
    if (!craft) throw createError(404, "Craft type not found");
    return successResponse(res, {
      statusCode: 200,
      message: "Craft type loaded successfully",
      payload: { craft },
    });
  } catch (err) {
    throw createError(500, err.message);
  }
};

module.exports = {
  createNewCraft,
  updateCraftById,
  deleteCraftById,
  getAllCraft,
  getCraftById,
};
