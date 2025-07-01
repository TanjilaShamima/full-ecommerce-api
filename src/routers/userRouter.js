const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/userController");
const { getMyDetails } = require("../controllers/userController");
const { updateUserById } = require("../controllers/userController");
const { deleteUserById } = require("../controllers/userController");
const validateSchema = require("../middlewares/validateSchema");
const userSchema = require("../schemas/userSchema");
const { resetPass } = require("../controllers/authController");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User APIs
 */
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *   put:
 *     summary: Update user by ID
 *     tags: [User]
 *   delete:
 *     summary: Delete user by ID
 *     tags: [User]
 */
router.get("/:id", getUserById);
router.put("/:id", validateSchema(userSchema), updateUserById);
router.delete("/:id", deleteUserById);
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get my details
 *     tags: [User]
 */
router.get("/me", getMyDetails);

const {
  getAllAddressesByUserId,
  createAddressByUserId,
  deleteAddressByUserId,
  updateAddressByUserId,
} = require("../controllers/addressController");
const addressSchema = require("../schemas/addressSchema");
const { createArtisanProfile, getArtisanById, updateArtisanById } = require("../controllers/artisanProfileController");
const artisanProfileSchema = require("../schemas/artisanProfileSchema");

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address APIs
 */
/**
 * @swagger
 * /users/{id}/addresses:
 *   get:
 *     summary: Get all addresses by user ID
 *     tags: [Address]
 *   post:
 *     summary: Create address by user ID
 *     tags: [Address]
 */
router.get("/:id/addresses", getAllAddressesByUserId);
router.post("/:id/addresses", createAddressByUserId);
/**
 * @swagger
 * /users/{id}/addresses/{addressId}:
 *   delete:
 *     summary: Delete address by user ID
 *     tags: [Address]
 *   put:
 *     summary: Update address by user ID
 *     tags: [Address]
 */
router.delete("/:id/addresses/:addressId", deleteAddressByUserId);
router.put("/:id/addresses/:addressId", validateSchema(addressSchema), updateAddressByUserId);

/**
 * @swagger
 * tags:
 *   name: Artisan
 *   description: Artisan APIs
 */
/**
 * @swagger
 * /users/{id}/artisan:
 *   get:
 *     summary: Get artisan profile by user ID
 *     tags: [Artisan]
 *   put:
 *     summary: Update artisan profile by user ID
 *     tags: [Artisan]
 */
router.get("/:id/artisan", getArtisanById);
/**
 * @swagger
 * /users/{id}/artisan:
 *   post:
 *     summary: Create artisan profile for user
 *     tags: [Artisan]
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
 *             $ref: '#/components/schemas/ArtisanProfile'
 *     responses:
 *       201:
 *         description: Artisan profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArtisanProfile'
 *       400:
 *         description: Bad request
 */
router.post("/:id/artisan", validateSchema(artisanProfileSchema), createArtisanProfile);

/**
 * @swagger
 * /users/{id}/artisan:
 *   put:
 *     summary: Update artisan profile by user ID
 *     tags: [Artisan]
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
 *             $ref: '#/components/schemas/ArtisanProfile'
 *     responses:
 *       200:
 *         description: Artisan profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArtisanProfile'
 *       400:
 *         description: Bad request
 */
router.put("/:id/artisan", validateSchema(artisanProfileSchema), updateArtisanById);

/**
 * @swagger
 * /users/reset-pass:
 *   post:
 *     summary: Set new password using reset token (after email link)
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               token: "reset-token-from-email"
 *               newPassword: "NewStrongPass123!"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post("/reset-pass", resetPass);

module.exports = router;