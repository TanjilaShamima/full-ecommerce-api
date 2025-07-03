/**
 * @file src/models/productRouter.js
 * @description This file defines the router for product data routes.
 */

/**
 * @swagger
 * tags:
 *   - name: Product
 *     description: Product management and operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         category:
 *           type: string
 *         stock:
 *           type: integer
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         material:
 *           type: string
 *         dimensions:
 *           type: object
 *           properties:
 *             length:
 *               type: number
 *             width:
 *               type: number
 *             height:
 *               type: number
 *         color:
 *           type: string
 *         size:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *         - stock
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     security:
 *       - bearerAuth: []
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 minItems: 1
 *                 maxItems: 5
 *                 description: Upload 1 to 5 images
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               material:
 *                 type: string
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   length:
 *                     type: number
 *                   width:
 *                     type: number
 *                   height:
 *                     type: number
 *               color:
 *                 type: string
 *               size:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update product by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 minItems: 1
 *                 maxItems: 5
 *                 description: Upload 1 to 5 images (replaces old images)
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               material:
 *                 type: string
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   length:
 *                     type: number
 *                   width:
 *                     type: number
 *                   height:
 *                     type: number
 *               color:
 *                 type: string
 *               size:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */

const router = require("express").Router();
const {
  addNewProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} = require("../controllers/productController");
const { isLoggedIn } = require("../middlewares/auth");
const permitRole = require("../middlewares/permitRole");
const { uploader } = require("../middlewares/upload");
const validateSchema = require("../middlewares/validateSchema");
const productSchema = require("../schemas/productSchema");

router.get("/", getAllProducts);
router.post(
  "/",
  isLoggedIn,
  permitRole(["super_admin", "admin", "artisan"]),
  validateSchema(productSchema),
  uploader.array("images", 5), // Allow up to 5 images
  addNewProduct
);
router.get("/:id", getProductById);
router.put(
  "/:id",
  isLoggedIn,
  permitRole(["super_admin", "admin", "artisan"]),
  uploader.array("images", 5), // Allow up to 5 images
  updateProductById
);
router.delete(
  "/:id",
  isLoggedIn,
  permitRole(["super_admin", "admin", "artisan"]),
  deleteProductById
);

module.exports = router;
