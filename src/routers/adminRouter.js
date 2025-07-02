const express = require("express");
const router = express.Router();
const adminController = require("../controllers/userController");
const permitRole = require("../middlewares/permitRole");
const { isLoggedIn } = require("../middlewares/auth");
const {
  getAllUsers,
  updateUsersRoleById,
  approvedUserRole,
  getAllRoleRequests,
} = require("../controllers/adminController");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs
 */
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (paginated)
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
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
 *         name: role
 *         schema:
 *           type: string
 *           enum: [super_admin, admin, customer, artisan, merchant]
 *         description: Filter by user role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, active, deactivate, baned, deleted]
 *         description: Filter by user status
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/src/schemas/User'
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
router.get(
  "/users",
  isLoggedIn,
  permitRole(["admin", "super_admin"]),
  getAllUsers
);
/**
 * @swagger
 * /admin/update-role/{id}:
 *   patch:
 *     summary: Update user's role by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
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
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 description: New role to assign
 *             example:
 *               role: "artisan"
 *     responses:
 *       200:
 *         description: User role updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Role not found
 *       404:
 *         description: User not found
 */
router.patch(
  "/update-role/:id",
  isLoggedIn,
  permitRole(["admin", "super_admin"]),
  updateUsersRoleById
);
/**
 * @swagger
 * /admin/approved-role/{id}:
 *   post:
 *     summary: Approve user role by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User role approved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: No requested role to approve
 *       404:
 *         description: User not found
 */
router.post(
  '/approved-role/:id',
  isLoggedIn,
  permitRole(["admin", "super_admin"]),
  approvedUserRole
);

// /**
//  * @swagger
//  * /admin/role-requests:
//  *   get:
//  *     summary: Get all role requests (paginated)
//  *     security:
//  *       - bearerAuth: []
//  *     tags: [Admin]
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *         description: Page number (default 1)
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *         description: Page size (default 10)
//  *       - in: query
//  *         name: search
//  *         schema:
//  *           type: string
//  *         description: Search by email, fullName, or username
//  *     responses:
//  *       200:
//  *         description: Paginated list of users with pending role requests
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 users:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/src/schemas/User'
//  *                 pagination:
//  *                   type: object
//  *                   properties:
//  *                     total:
//  *                       type: integer
//  *                     page:
//  *                       type: integer
//  *                     limit:
//  *                       type: integer
//  *                     totalPages:
//  *                       type: integer
//  *       400:
//  *         description: Bad request
//  */
router.get(
  "/role-requests",
  isLoggedIn,
  permitRole(["admin", "super_admin"]),
  getAllRoleRequests
);

module.exports = router;
