const express = require("express");
const router = express.Router();
const craftTypeController = require("../controllers/craftTypeController");
const validateSchema = require("../middlewares/validateSchema");
const craftTypeSchema = require("../schemas/craftTypeSchema");
const permitRole = require("../middlewares/permitRole");
const { isLoggedIn } = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   - name: Craft Type
 *     description: Craft Type management APIs
 * components:
 *   schemas:
 *     Craft Type:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *       example:
 *         name: Pottery
 *         description: Handmade pottery crafts
 */
/**
 * @swagger
 * /craft-types:
 *   post:
 *     summary: Create a new craft type
 *     security:
 *       - bearerAuth: []
 *     tags: [Craft Type]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               name: Pottery
 *               description: Handmade pottery crafts
 *     responses:
 *       201:
 *         description: Craft type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Craft Type'
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get all craft types
 *     tags: [Craft Type]
 *     responses:
 *       200:
 *         description: List of craft types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Craft Type'
 */
/**
 * @swagger
 * /craft-types/{id}:
 *   put:
 *     summary: Update craft type by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Craft Type]
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
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               name: Pottery
 *               description: Handmade pottery crafts
 *     responses:
 *       200:
 *         description: Craft type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Craft Type'
 *       404:
 *         description: Craft type not found
 *   delete:
 *     summary: Delete craft type by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Craft Type]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Craft type deleted successfully
 *       404:
 *         description: Craft type not found
 */
router.post(
  "/",
  isLoggedIn,
  validateSchema(craftTypeSchema),
  permitRole(["super_admin", "admin"]),
  craftTypeController.createNewCraft
);
router.get("/", craftTypeController.getAllCraft);
router.get("/:id", craftTypeController.getCraftById);
router.put(
  "/:id",
  isLoggedIn,
  validateSchema(craftTypeSchema),
  permitRole(["super_admin", "admin"]),
  craftTypeController.updateCraftById
);
router.delete(
  "/:id",
  isLoggedIn,
  permitRole(["super_admin", "admin"]),
  craftTypeController.deleteCraftById
);

module.exports = router;
