const Order = require("../Model/OrderModel");

// Get all orders
const getAllOrders = async (req, res, next) => {
    let orders;
    const { customerEmail } = req.query;

    try {
        if (customerEmail) {
            // Filter orders by customer email
            orders = await Order.find({ customerEmail: customerEmail });
        } else {
            // Get all orders (for admin)
            orders = await Order.find();
        }
    } catch (err) {
        console.log(err);
    }

    if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json({ orders });
};

// Add order
const addOrders = async (req, res, next) => {
    const { orderId, customerName, customerEmail, date, products, quantities, total, orderstatus, deliveryMethod } = req.body;

    let orders;

    try {
        orders = new Order({ orderId, customerName, customerEmail, date, products, quantities, total, orderstatus, deliveryMethod });
        await orders.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error while adding order" });
    }

    if (!orders) {
        return res.status(400).json({ message: "Unable to add order" });
    }

    return res.status(201).json({ orders });
};

// Get order by ID
const getById = async (req, res, next) => {
    const id = req.params.id;

    let order;

    try {
        order = await Order.findById(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error while fetching order" });
    }

    if (!order) {
        return res.status(404).json({ message: "Order not available" });
    }

    return res.status(200).json({ order });
};

// Update order
const updateOrder = async (req, res, next) => {
    const id = req.params.id;
    const { orderId, customerName, customerEmail, date, products, quantities, total, orderstatus, deliveryMethod } = req.body;

    let order;

    try {
        order = await Order.findByIdAndUpdate(
            id,
            { orderId, customerName, customerEmail, date, products, quantities, total, orderstatus, deliveryMethod },
            { new: true } // return updated doc
        );
    } catch (err) {
        console.log(err);
    }

    if (!order) {
        return res.status(404).json({ message: "Unable to update order details" });
    }

    return res.status(200).json({ order });
};

// Delete order
const deleteOrder = async (req, res, next) => {
    const id = req.params.id;

    let order;

    try {
        order = await Order.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }

    if (!order) {
        return res.status(404).json({ message: "Unable to delete order details" });
    }

    return res.status(200).json({ order });
};

module.exports = {
    getAllOrders,
    addOrders,
    getById,
    updateOrder,
    deleteOrder
};
