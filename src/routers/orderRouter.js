/**
 * @file orderRouter.js
 * @description This file defines all the necessary routers for order-related operations.
 */

const express = require("express");
const {
  createNewOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} = require("../controllers/orderController");
const { isLoggedIn } = require("../middlewares/auth");
const permitRole = require("../middlewares/permitRole");

const router = express.Router();

router.post("/", isLoggedIn, createNewOrders);
router.get("/", isLoggedIn, getAllOrders);
router.get("/:id", isLoggedIn, getOrderById);
router.put("/:id/status", isLoggedIn, permitRole(["super_admin", "admin"]), updateOrderStatus);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order management APIs
 * components:
 *   schemas:
 *     OrderProduct:
 *       type: object
 *       properties:
 *         productId:
 *           type: integer
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderProduct'
 *         totalPrice:
 *           type: number
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 * /orders:
 *   post:
 *     summary: Create a new order
 *     security:
 *       - bearerAuth: []
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderProduct'
 *             required:
 *               - products
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get all orders (for current user or admin)
 *     security:
 *       - bearerAuth: []
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status for the order
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
