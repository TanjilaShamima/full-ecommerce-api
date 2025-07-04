const Cart = require("../models/cartModel");
const { successResponse } = require("../services/response");
const createError = require("http-errors");
const logger = require("../utils/logger");
const Products = require("../models/productModel");

const getMyCartDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("products.productId");

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
    const userId = req.user.id;

    const cart = await Cart.findOneAndDelete({ userId });

    if (!cart) {
      logger.warn(`Cart not found for userId: ${userId}`);
      throw createError(404, "Cart not found");
    }

    successResponse(res, {
      statusCode: 200,
      message: "Cart deleted successfully",
      payload: cart,
    });
  } catch (error) {
    logger.error("Error deleting cart:", error);
    throw createError(error);
  }
};

const addProductInCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, price } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, products: [], totalPrice: 0 });
    }

    const existingProduct = cart.products.find(item => item.productId === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      const product = await Products.findById(productId);
      cart.products.push({ productId, quantity, price: product.price });
    }

    cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);

    await cart.save();

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
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId } } },
      { new: true }
    );

    if (!cart) {
      logger.warn(`Cart not found for userId: ${userId}`);
      throw createError(404, "Cart not found");
    }

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
    const userId = req.user.id;
    const { prodId, action } = req.body;

    if (!["increment", "decrement"].includes(action)) {
      throw createError(400, "Invalid action. Use 'increment' or 'decrement'.");
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      logger.warn(`Cart not found for userId: ${userId}`);
      throw createError(404, "Cart not found");
    }

    const product = cart.products.find(item => item.productId === prodId);

    if (!product) {
      throw createError(404, "Product not found in cart");
    }

    if (action === "increment") {
      product.quantity += 1;
    } else if (action === "decrement") {
      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        throw createError(400, "Quantity cannot be less than 1");
      }
    }

    cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);
    
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
}

module.exports = {
  getMyCartDetails,
  updateMyCart,
  deleteMyCart,
  addProductInCart,
  deleteProductFromCart,
  incrementOrDecrementProduct,
};