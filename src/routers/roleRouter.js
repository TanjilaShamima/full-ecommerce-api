const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const validateSchema = require("../middlewares/validateSchema");
const roleSchema = require("../schemas/roleSchema");
const permitRole = require("../middlewares/permitRole");

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Role management APIs
 */
/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role (admin and super admin only)
 *     tags: [Role]
 *   get:
 *     summary: Get all roles (admin and super admin only)
 *     tags: [Role]
 * /roles/{id}:
 *   put:
 *     summary: Update role by ID (admin and super admin only)
 *     tags: [Role]
 *   delete:
 *     summary: Delete role by ID (admin and super admin only)
 *     tags: [Role]
 */
router.post(
  "/",
  permitRole(["admin", "super_admin"]),
  validateSchema(roleSchema),
  roleController.createRole
);
/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles (admin and super admin only)
 *     tags: [Role]
 */
router.get("/", permitRole(["admin", "super_admin"]), roleController.getRoles);
/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update role by ID (admin and super admin only)
 *     tags: [Role]
 */
router.put(
  "/:id",
  permitRole(["admin", "super_admin"]),
  validateSchema(roleSchema),
  roleController.updateRoleById
);
/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete role by ID (admin and super admin only)
 *     tags: [Role]
 */
router.delete("/:id", permitRole(["admin", "super_admin"]), roleController.deleteRoleById);

module.exports = router;
