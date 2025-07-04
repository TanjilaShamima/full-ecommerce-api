/**
 * @file src/models/cartRouter.js
 * @description This file defines all the necessary routers for cart-related operations.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CartProduct:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
 *     Cart:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartProduct'
 *         totalPrice:
 *           type: number
 *
 * /carts:
 *   get:
 *     summary: Get my cart details
 *     security:
 *       - bearerAuth: []
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 *   delete:
 *     summary: Delete my cart
 *     security:
 *       - bearerAuth: []
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 * /carts/products/{productId}:
 *   post:
 *     summary: Add product to cart
 *     security:
 *       - bearerAuth: []
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to add
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 *   delete:
 *     summary: Remove product from cart
 *     security:
 *       - bearerAuth: []
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 *
 * /carts/products/quantity:
 *   patch:
 *     summary: Increment or decrement product quantity in cart
 *     security:
 *       - bearerAuth: []
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prodId:
 *                 type: string
 *               action:
 *                 type: string
 *                 enum: [increment, decrement]
 *     responses:
 *       200:
 *         description: Product quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart or product not found
 */

const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/auth");
const cartController = require("../controllers/cartController");

router.get("/", isLoggedIn, cartController.getMyCartDetails);
// router.patch("/", isLoggedIn, cartController.updateMyCart);
router.delete("/", isLoggedIn, cartController.deleteMyCart);
router.post("/products/:productId", isLoggedIn, cartController.addProductInCart);
router.delete("/products/:productId", isLoggedIn, cartController.deleteProductFromCart);
router.patch("/products/quantity", isLoggedIn, cartController.incrementOrDecrementProduct);

module.exports = router;