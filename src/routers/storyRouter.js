/**
 * @file src/models/storyModel.js
 * @description This file defines all the necessary routers for story-related operations.
 */

const express = require("express");
const {
  createStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
} = require("../controllers/storyController");
const validateSchema = require("../middlewares/validateSchema");
const storySchema = require("../schemas/storySchema");
const { uploader } = require("../middlewares/upload");
const { isLoggedIn } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
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
 *     "Craft Type":
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
 *     ArtisanProfile:
 *       type: object
 *       required:
 *         - name
 *         - district
 *         - city
 *         - productType
 *       properties:
 *         name:
 *           type: string
 *         tagLine:
 *           type: string
 *         district:
 *           type: string
 *         city:
 *           type: string
 *         productType:
 *           type: string
 *         socialMedia:
 *           type: string
 *         about:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *     Story:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the story
 *         title:
 *           type: string
 *           description: The title of the story
 *         content:
 *           type: string
 *           description: The content of the story
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags for the story
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Image URLs for the story
 *       required:
 *         - title
 *         - content
 */

/**
 * @swagger
 * /stories:
 *   get:
 *     summary: Get all stories
 *     tags: [Story]
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
 *         description: Number of stories per page (default 10)
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: false
 *         description: Filter by tags (one or more)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or content
 *     responses:
 *       200:
 *         description: List of stories (with pagination and filters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Story'
 *                 meta:
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
 */

/**
 * @swagger
 * /stories:
 *   post:
 *     summary: Create a new story
 *     security:
 *       - bearerAuth: []
 *     tags: [Story]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 3 images
 *     responses:
 *       201:
 *         description: The story was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Story'
 *       400:
 *         description: Bad request
 *
 * /stories/{id}:
 *   get:
 *     summary: Get a story by ID
 *     tags: [Story]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The story id
 *     responses:
 *       200:
 *         description: The story description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Story'
 *       404:
 *         description: Story not found
 *   put:
 *     summary: Update a story by ID (only owner can update)
 *     security:
 *       - bearerAuth: []
 *     tags: [Story]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The story id
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 3 images (replaces old images)
 *     responses:
 *       200:
 *         description: The updated story
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Story'
 *       403:
 *         description: Forbidden. Only the story owner can update.
 *       404:
 *         description: Story not found
 *   delete:
 *     summary: Delete a story by ID (only owner can delete)
 *     security:
 *       - bearerAuth: []
 *     tags: [Story]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The story id
 *     responses:
 *       204:
 *         description: Story deleted successfully
 *       403:
 *         description: Forbidden. Only the story owner can delete.
 *       404:
 *         description: Story not found
 */

router.post(
  "/",
  isLoggedIn,
  validateSchema(storySchema),
  uploader.array("images", 3),
  createStory
);
router.get("/", getAllStories);
router.get("/:id", getStoryById);
router.put(
  "/:id",
  isLoggedIn,
  uploader.array("images", 3),
  updateStory // must check story.userId === req.user.id inside controller
);
router.delete(
  "/:id",
  isLoggedIn,
  deleteStory // must check story.userId === req.user.id inside controller
);

module.exports = router;
