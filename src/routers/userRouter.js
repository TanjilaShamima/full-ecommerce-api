const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/userController");
const { getMyDetails } = require("../controllers/userController");
const { updateUserById } = require("../controllers/userController");
const { deleteUserById } = require("../controllers/userController");
const { updatePassword } = require("../controllers/userController");
const validateSchema = require("../middlewares/validateSchema");
const userSchema = require("../schemas/userSchema");

const {
  getAllAddressesByUserId,
  createAddressByUserId,
  deleteAddressByUserId,
  updateAddressByUserId,
} = require("../controllers/addressController");
const addressSchema = require("../schemas/addressSchema");
const {
  createArtisanProfile,
  getArtisanById,
  updateArtisanById,
  getAllArtisans,
} = require("../controllers/artisanProfileController");
const { isLoggedIn } = require("../middlewares/auth");
const { uploader } = require("../middlewares/upload");
const artisanProfileSchema = require("../schemas/artisanProfileSchema");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User APIs
 */

/**
 * @swagger
 * /users/artisans:
 *   get:
 *     summary: Get all artisans (paginated)
 *     tags: [Artisan]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size (default 10)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by email, fullName, or username
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, active, deactivate, baned, deleted]
 *         description: Filter by user status
 *     responses:
 *       200:
 *         description: Paginated list of artisans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 artisans:
 *                   type: array
 *                   items:
 *                     $ref: '#/src/schemas/ArtisanProfile'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Bad request
 */


/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get my details
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     responses:
 *       200:
 *         description: My details loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/src/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/me", isLoggedIn, getMyDetails);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/src/schemas/User'
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update user by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Jane Doe
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: female
 *               mobile:
 *                 type: string
 *                 example: "01700000000"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Single image file upload
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/src/schemas/User'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden (not your own profile)
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete user by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden (not your own account)
 *       404:
 *         description: User not found
 */

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
 *     security:
 *       - bearerAuth: []
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/src/schemas/Address'
 *   post:
 *     summary: Create address by user ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/src/schemas/Address'
 *     responses:
 *       201:
 *         description: Address created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/src/schemas/Address'
 *       400:
 *         description: Bad request
 */


/**
 * @swagger
 * /users/{id}/addresses/{addressId}:
 *   put:
 *     summary: Update address by user ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/src/schemas/Address'
 *     responses:
 *       200:
 *         description: Address updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/src/schemas/Address'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden (not your own address)
 *       404:
 *         description: Address not found
 *   delete:
 *     summary: Delete address by user ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       403:
 *         description: Forbidden (not your own address)
 *       404:
 *         description: Address not found
 */

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
 *     security:
 *       - bearerAuth: []
 *     tags: [Artisan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Artisan profile loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     artisanProfile:
 *                       $ref: '#/src/schemas/ArtisanProfile'
 *       404:
 *         description: Artisan profile not found
 *   put:
 *     summary: Update artisan profile by user ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Artisan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Artisan"
 *               tagLine:
 *                 type: string
 *                 example: "Handmade with love"
 *               district:
 *                 type: string
 *                 example: "Dhaka"
 *               city:
 *                 type: string
 *                 example: "Dhaka"
 *               productType:
 *                 type: string
 *                 enum: [pottery, textile, jewelry, woodwork, painting, other]
 *                 example: pottery
 *               socialMedia:
 *                 type: string
 *                 format: uri
 *                 example: "https://instagram.com/janeartisan"
 *               about:
 *                 type: string
 *                 example: "I create unique pottery pieces."
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 3 images
 *     responses:
 *       200:
 *         description: Artisan profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     artisanProfile:
 *                       $ref: '#/src/schemas/ArtisanProfile'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Artisan profile not found
 *   post:
 *     summary: Create artisan profile for user
 *     security:
 *       - bearerAuth: []
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Artisan"
 *               tagLine:
 *                 type: string
 *                 example: "Handmade with love"
 *               district:
 *                 type: string
 *                 example: "Dhaka"
 *               city:
 *                 type: string
 *                 example: "Dhaka"
 *               productType:
 *                 type: string
 *                 enum: [pottery, textile, jewelry, woodwork, painting, other]
 *                 example: pottery
 *               socialMedia:
 *                 type: string
 *                 format: uri
 *                 example: "https://instagram.com/janeartisan"
 *               about:
 *                 type: string
 *                 example: "I create unique pottery pieces."
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 3 images
 *     responses:
 *       201:
 *         description: Artisan profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     artisanProfile:
 *                       $ref: '#/src/schemas/ArtisanProfile'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /users/update-password:
 *   post:
 *     summary: Set new password using reset token (after email link)
 *     security:
 *       - bearerAuth: []
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - addressLine1
 *         - city
 *         - state
 *         - postalCode
 *         - country
 *       properties:
 *         addressLine1:
 *           type: string
 *         addressLine2:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         postalCode:
 *           type: string
 *         country:
 *           type: string
 *       example:
 *         addressLine1: "123 Main St"
 *         addressLine2: "Apt 4B"
 *         city: "Dhaka"
 *         state: "Dhaka"
 *         postalCode: "1207"
 *         country: "Bangladesh"
 */

router.get("/artisans", getAllArtisans);
router.get("/:id", getUserById);
router.put("/:id", isLoggedIn, uploader.single("image"), updateUserById);
router.delete("/:id", deleteUserById);
router.get("/:id/addresses", isLoggedIn, getAllAddressesByUserId);
router.post(
  "/:id/addresses",
  isLoggedIn,
  validateSchema(addressSchema),
  createAddressByUserId
);
router.put(
  "/:id/addresses/:addressId",
  isLoggedIn,
  validateSchema(addressSchema),
  updateAddressByUserId
);
router.delete("/:id/addresses/:addressId", isLoggedIn, deleteAddressByUserId);
router.get("/:id/artisan", getArtisanById);
router.put(
  "/:id/artisan",
  isLoggedIn,
  uploader.array("images", 3),
  updateArtisanById
);
router.post(
  "/:id/artisan",
  isLoggedIn,
  validateSchema(artisanProfileSchema),
  uploader.array("images", 3),
  createArtisanProfile
);
router.post("/update-password", updatePassword);

// router.use("/:id/stories", isLoggedIn, storyRouter);

module.exports = router;
