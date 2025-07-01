const express = require("express");
const router = express.Router();
const validateSchema = require("../middlewares/validateSchema");
const roleSchema = require("../schemas/roleSchema");
const permitRole = require("../middlewares/permitRole");
const { isLoggedIn } = require("../middlewares/auth");
const {
  deleteRoleById,
  updateRoleById,
  getRoles,
  createRole,
} = require("../controllers/roleController");

/**
 * @swagger
 * tags:
 *   - name: Role
 *     description: Role management APIs
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - roleName
 *         - permissions
 *       properties:
 *         roleName:
 *           type: string
 *         permissions:
 *           type: string
 *           enum: [super_admin, admin, customer, artisan, merchant]
 *         description:
 *           type: string
 *       example:
 *         roleName: admin
 *         permissions: admin
 *         description: Admin role
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Automatically set to current time when role is created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Automatically set to current time when role is updated
 */
/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role (admin and super admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleName
 *               - permissions
 *             properties:
 *               roleName:
 *                 type: string
 *               permissions:
 *                 type: string
 *                 enum: [super_admin, admin, customer, artisan, merchant]
 *               description:
 *                 type: string
 *             example:
 *               roleName: admin
 *               permissions: admin
 *               description: Admin role
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get all roles (admin and super admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Role]
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update role by ID (admin and super admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 *   delete:
 *     summary: Delete role by ID (admin and super admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 */
router.post(
  "/",
  isLoggedIn,
  permitRole(["admin", "super_admin"]),
  validateSchema(roleSchema),
  createRole
);
router.get("/", isLoggedIn, permitRole(["admin", "super_admin"]), getRoles);
router.put(
  "/:id",
  isLoggedIn,
  permitRole(["admin", "super_admin"]),
  validateSchema(roleSchema),
  updateRoleById
);
router.delete("/:id", isLoggedIn, permitRole(["admin", "super_admin"]), deleteRoleById);

module.exports = router;
