const express = require("express");
const router = express.Router();
const adminController = require("../controllers/userController");
const permitRole = require("../middlewares/permitRole");
const { isLoggedIn } = require("../middlewares/auth");
const { getAllUsers, updateUsersRoleById, approvedUserRole, getAllRoleRequests } = require("../controllers/adminController");

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
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 */
router.get("/users", isLoggedIn, permitRole(["admin", "super_admin"]), getAllUsers);
/**
 * @swagger
 * /admin/update-role/{id}:
 *   patch:
 *     summary: Update user's role by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 */
router.patch("/update-role/:id", isLoggedIn, permitRole(["admin", "super_admin"]), updateUsersRoleById);
/**
 * @swagger
 * /admin/approved-role/{id}:
 *   post:
 *     summary: Approve user role by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 */
router.post("/approved-role/:id", isLoggedIn, permitRole(["admin", "super_admin"]), approvedUserRole);
/**
 * @swagger
 * /admin/role-requests:
 *   get:
 *     summary: Get all role requests
 *     security:
 *       - bearerAuth: []
 *     tags: [Admin]
 */
router.get("/role-requests", isLoggedIn, permitRole(["admin", "super_admin"]), getAllRoleRequests);

module.exports = router;
