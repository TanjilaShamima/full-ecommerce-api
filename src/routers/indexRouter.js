const router = require("express").Router();
const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const adminRouter = require("./adminRouter");
const craftTypeRouter = require("./craftTypeRouter");
const productRouter = require("./productRouter");

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
 *   - name: Product
 *     description: Product management and operations
 *   - name: Reviews
 *     description: Reviews management and operations
 *   - name: Cart
 *     description: Cart management and operations
 *   - name: Order
 *     description: Order management and operations
 */

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/admin", adminRouter);
router.use("/craft-types", craftTypeRouter);
router.use("/products", productRouter);

module.exports = router;
