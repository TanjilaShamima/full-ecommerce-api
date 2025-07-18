const express = require("express");
const router = express.Router();
const {
  registerUser
} = require("../controllers/authController");
const { loginUser } = require("../controllers/authController");
const { verifyUser } = require("../controllers/authController");
const { forgetPass } = require("../controllers/authController");
const { resetPass } = require("../controllers/authController");
const { logout } = require("../controllers/authController");
const validateSchema = require("../middlewares/validateSchema");
const userSchema = require("../schemas/userSchema");
const passport = require("../config/passport");
const { loginGoogle } = require("../controllers/authController");

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
 *     summary: Register a new user manually
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - fullName
 *               - mobile
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               fullName:
 *                 type: string
 *               mobile:
 *                 type: string
 *               requestRole:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: user@example.com
 *               fullName: John Doe
 *               mobile: "01700000000"
 *               password: StrongPass123!
 *               requestRole: "artisan"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/register", validateSchema(userSchema), registerUser);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123!
 *     responses:
 *       200:
 *         description: Login successful
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
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     googleId:
 *                       type: string
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: Please verify your email before logging in
 */
router.post("/login", loginUser);
/**
 * @swagger
 * /auth/verify-user/{id}:
 *   post:
 *     summary: Verify user with OTP
 *     tags: [Auth]
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
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: User verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/verify-user/:id", verifyUser);
/**
 * @swagger
 * /auth/forget-pass:
 *   post:
 *     summary: Request password reset (send reset link to email)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Bad request
 */
router.post("/forget-pass", forgetPass);

/**
 * @swagger
 * /auth/reset-pass:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
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
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 */
router.post("/logout", logout);
/**
 * @swagger
 * /auth/login-google:
 *   get:
 *     summary: Login with Google OAuth2
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 */
router.get(
  "/login-google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful Google login, returns JWT
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/v1/auth/login-failed",
  }),
  loginGoogle
);

module.exports = router;
