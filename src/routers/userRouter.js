const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/userController");
const { getMyDetails } = require("../controllers/userController");
const { updateUserById } = require("../controllers/userController");
const { deleteUserById } = require("../controllers/userController");
const validateSchema = require("../middlewares/validateSchema");
const userSchema = require("../schemas/userSchema");

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
const { getArtisanById, updateArtisanById } = require("../controllers/artisanProfileController");
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
router.put("/:id/artisan", validateSchema(artisanProfileSchema), updateArtisanById);

module.exports = router;