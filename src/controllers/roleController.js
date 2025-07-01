const Role = require("../models/roleModel");

/**
 * Create a new role (admin and super admin only)
 */
const createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get all roles (admin and super admin only)
 */
const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update role by ID (admin and super admin only)
 */
const updateRoleById = async (req, res) => {
  try {
    const [updated] = await Role.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Role not found" });
    const role = await Role.findByPk(req.params.id);
    res.status(200).json(role);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Delete role by ID (admin and super admin only)
 */
const deleteRoleById = async (req, res) => {
  try {
    const deleted = await Role.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Role not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createRole,
  getRoles,
  updateRoleById,
  deleteRoleById,
};
