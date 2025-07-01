const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController");
const { loginUser } = require("../controllers/authController");
const { verifyUser } = require("../controllers/authController");
const { forgetPass } = require("../controllers/authController");
const { resetPass } = require("../controllers/authController");
const { logout } = require("../controllers/authController");
const validateSchema = require("../middlewares/validateSchema");
const userSchema = require("../schemas/userSchema");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
router.post("/register", validateSchema(userSchema), registerUser);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */
router.post("/login", loginUser);
/**
 * @swagger
 * /auth/verify-user:
 *   post:
 *     summary: Verify user
 *     tags: [Auth]
 */
router.post("/verify-user", verifyUser);
/**
 * @swagger
 * /auth/forget-pass:
 *   post:
 *     summary: Forget password
 *     tags: [Auth]
 */
router.post("/forget-pass", forgetPass);
/**
 * @swagger
 * /auth/reset-pass:
 *   get:
 *     summary: Reset password
 *     tags: [Auth]
 */
router.get("/reset-pass", resetPass);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 */
router.post("/logout", logout);

module.exports = router;
