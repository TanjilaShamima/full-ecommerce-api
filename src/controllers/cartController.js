const Cart = require("../models/cartModel");
const { successResponse } = require("../services/response");
const createError = require("http-errors");
const logger = require("../utils/logger");
const Products = require("../models/productModel");

const getMyCartDetails = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    if (!userId) {
      logger.warn("User ID is required to fetch cart details");
      throw createError(400, "User ID is required");
    }
    let cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      throw createError(404, "Cart not found");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Cart details fetched successfully",
      payload: cart,
    });
  } catch (error) {
    logger.error("Error fetching cart details:", error);
    throw createError(error);
  }
};

const updateMyCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { products } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { products },
      { new: true }
    );

    if (!cart) {
      logger.warn(`Cart not found for userId: ${userId}`);
      throw createError(404, "Cart not found");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Cart updated successfully",
      payload: cart,
    });
  } catch (error) {
    logger.error("Error updating cart:", error);
    throw createError(error);
  }
};

const deleteMyCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      logger.warn("User ID is required to delete cart");
      throw createError(400, "User ID is required");
    }

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      logger.warn(`Cart not found for userId: ${userId}`);
      throw createError(404, "Cart not found");
    }

    await cart.destroy();
    successResponse(res, {
      statusCode: 200,
      message: "Cart deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting cart:", error);
    throw createError(error);
  }
};

const addProductInCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.productId;
    let { quantity } = req.body;
    quantity = quantity ? Number(quantity) : 1;
    if (!productId) {
      logger.warn("Product ID is required to add to cart");
      throw createError(400, "Product ID is required");
    }

    const product = await Products.findByPk(productId);
    if (!product) {
      logger.warn(`Product not found with ID: ${productId}`);
      throw createError(404, "Product not found");
    }
    let cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      const newProducts = [
        {
          productId: Number(productId),
          quantity,
          price: product.price, // Price will be updated after fetching product details
        },
      ];
      cart = await Cart.create({
        userId,
        products: newProducts,
        totalPrice: quantity * product.price,
      });
    } else {
      const existingProduct = cart.products.find(
        (item) => item.productId === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products = [
          ...cart.products,
          { productId: Number(productId), quantity, price: product.price },
        ];
      }

      cart.totalPrice = cart.products.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      logger.info(cart);

      await cart.save();
    }

    successResponse(res, {
      statusCode: 201,
      message: "Product added to cart successfully",
      payload: cart,
    });
  } catch (error) {
    logger.error("Error adding product to cart:", error);
    throw createError(error);
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      logger.warn(`Cart not found for userId: ${userId}`);
      throw createError(404, "Cart not found");
    }
    cart.products = cart.products.filter(
      (item) => item.productId !== Number(productId)
    );

    cart.totalPrice = cart.products.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    if (cart.products.length === 0) {
      await cart.destroy();
      return successResponse(res, {
        statusCode: 200,
        message: "Cart is empty now",
      });
    }
    await cart.save();

    successResponse(res, {
      statusCode: 200,
      message: "Product removed from cart successfully",
      payload: cart,
    });
  } catch (error) {
    logger.error("Error removing product from cart:", error);
    throw createError(error);
  }
};

const incrementOrDecrementProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { prodId, action } = req.body;

    if (!["increment", "decrement"].includes(action)) {
      throw createError(400, "Invalid action. Use 'increment' or 'decrement'.");
    }

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      logger.warn(`Cart not found for userId: ${userId}`);
      throw createError(404, "Cart not found");
    }

    if (!Array.isArray(cart.products)) {
      cart.products = [];
    }

    const productIndex = cart.products.findIndex(
      (item) => Number(item.productId) === Number(prodId)
    );

    if (productIndex === -1) {
      throw createError(404, "Product not found in cart");
    }

    if (action === "increment") {
      cart.products = cart.products.map(item =>
        Number(item.productId) === Number(prodId)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else if (action === "decrement") {
      if (cart.products[productIndex].quantity > 1) {
        cart.products = cart.products.map(item =>
          Number(item.productId) === Number(prodId)
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        throw createError(400, "Quantity cannot be less than 1");
      }
    }

    cart.totalPrice = cart.products.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    successResponse(res, {
      statusCode: 200,
      message: `Product quantity ${action}ed successfully`,
      payload: cart,
    });
  } catch (error) {
    logger.error("Error updating product quantity:", error);
    throw createError(error);
  }
};

module.exports = {
  getMyCartDetails,
  updateMyCart,
  deleteMyCart,
  addProductInCart,
  deleteProductFromCart,
  incrementOrDecrementProduct,
};
