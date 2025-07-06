const Cart = require("../models/cartModel");
const Orders = require("../models/orderModel");
const createError = require("http-errors");
const successResponse = require("../services/response").successResponse;

const createNewOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { shippingAddress, paymentMethod, paymentStatus } = req.body;
    // Fetch the user's cart
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart || !Array.isArray(cart.products) || cart.products.length === 0) {
      throw createError(400, "Cart is empty or not found");
    }
    if (!shippingAddress || !paymentMethod || !paymentStatus) {
      throw createError(400, "shippingAddress, paymentMethod, and paymentStatus are required");
    }
    // Create the order using cart's products and totalPrice
    const order = await Orders.create({
      userId,
      products: cart.products,
      totalPrice: cart.totalPrice,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      status: "pending", // or your default status
    });

    // Optionally, clear the cart after order creation
    await cart.destroy();

    successResponse(res, {
      statusCode: 201,
      message: "Order created successfully",
      payload: order,
    });
  } catch (error) {
    throw createError(error.status || 500, error.message || "Failed to create order");
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Orders.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Orders.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const cancelOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Orders.findByPk(id);
    if (!order) {
        throw createError(404, "Order not found");
    }

    // Assuming 'cancelled' is a valid status in your application
    order.status = "cancelled";
    await order.save();

    successResponse(res, {
      statusCode: 200,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw createError(error);
  }
};

module.exports = {
  createNewOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrderById
};