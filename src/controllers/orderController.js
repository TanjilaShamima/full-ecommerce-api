const Orders = require("../models/orderModel");
const createError = require("http-errors");
const successResponse = require("../services/response").successResponse;

const createNewOrders = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    const userId = req.user.userId || req.user.id;

    // Validate the request body
    if (!products || !Array.isArray(products) || products.length === 0 || !totalAmount) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Create a new order
    const newOrder = await Order.create({
      userId,
      products,
      totalAmount,
      status: "pending", // Default status
    });
    
    successResponse(res, {
      statusCode: 201,
      message: "Order created successfully",
      payload: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
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

module.exports = {
  createNewOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};