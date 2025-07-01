const express = require("express");
const router = express.Router();
const adminController = require("../controllers/userController");
const permitRole = require("../middlewares/permitRole");
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
 *     tags: [Admin]
 */
router.get("/users", permitRole(["admin", "super_admin"]), getAllUsers);
/**
 * @swagger
 * /admin/update-role/{id}:
 *   patch:
 *     summary: Update user's role by ID
 *     tags: [Admin]
 */
router.patch("/update-role/:id", permitRole(["admin", "super_admin"]), updateUsersRoleById);
/**
 * @swagger
 * /admin/approved-role/{id}:
 *   post:
 *     summary: Approve user role by ID
 *     tags: [Admin]
 */
router.post("/approved-role/:id", permitRole(["admin", "super_admin"]), approvedUserRole);
/**
 * @swagger
 * /admin/role-requests:
 *   get:
 *     summary: Get all role requests
 *     tags: [Admin]
 */
router.get("/role-requests", permitRole(["admin", "super_admin"]), getAllRoleRequests);

module.exports = router;
