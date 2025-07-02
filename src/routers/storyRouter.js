/**
 * @file src/models/storyModel.js
 * @description This file defines all the necessary routers for story-related operations.
 */


const express = require("express");
const { createStory, getAllStories, getStoryById, updateStory, deleteStory } = require("../controllers/storyController");
const validateSchema = require("../middlewares/validateSchema");
const storySchema = require("../schemas/storySchema");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and login
 *   - name: Admin
 *     description: Admin management and operations
 *   - name: Craft Type
 *     description: Craft type management and operations
 *   - name: User
 *     description: User management and operations
 *   - name: Address
 *     description: Address management and operations
 *   - name: Artisan
 *     description: Artisan management and operations
 *   - name: Story
 *     description: Story management and operations
 */

/**
 * @swagger
 * components:
 *   schemas:
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
 * /users/{id}/stories:
 *   post:
 *     summary: Create a new story for a user
 *     tags: [Story]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Story'
 *     responses:
 *       201:
 *         description: The story was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Story'
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get all stories for a user
 *     tags: [Story]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: List of all stories for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Story'
 */

/**
 * @swagger
 * /users/{id}/stories:
 *   get:
 *     summary: Get all stories
 *     tags: [Story]
 *     responses:
 *       200:
 *         description: List of all stories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Story'
 */

/**
 * @swagger
 * /users/{id}/stories/{id}:
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
 */

/**
 * @swagger
 * /users/{id}/stories/{id}:
 *   put:
 *     summary: Update a story by ID
 *     tags: [Story]
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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Story'
 *     responses:
 *       200:
 *         description: The updated story
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Story'
 *       404:
 *         description: Story not found
 */

/**
 * @swagger
 * /users/{id}/stories/{id}:
 *   delete:
 *     summary: Delete a story by ID
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
 *       404:
 *         description: Story not found
 */

router.post("/", validateSchema(storySchema), createStory);
router.get("/", getAllStories);
router.get("/:id", getStoryById);
router.put("/:id",  updateStory);
router.delete("/:id", deleteStory);

module.exports = router;
